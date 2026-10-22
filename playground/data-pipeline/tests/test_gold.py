"""Gold is where editing happens, so these tests are about not losing people's work."""

import json

from dpr_pipeline import db, gold
from dpr_pipeline.config import SourceConfig
from dpr_pipeline.mappers import camden as camden_mapper
from dpr_pipeline.sources import camden as camden_source
from dpr_pipeline.storage import Storage

from .test_camden_mapper import SAMPLE
from .test_pipeline import FakeSession

REFERENCE = "2018-2267-P"


def build(tmp_path, records=(SAMPLE,)):
    connection = db.connect(str(tmp_path / "test.duckdb"))
    storage = Storage(str(tmp_path / "bronze"))
    source = SourceConfig(name="camden", url="http://example.test/data.json", page_size=10)
    camden_source.ingest(connection, source, storage, session=FakeSession(list(records)))
    camden_mapper.map_all(connection)
    return connection


def test_publish_copies_silver_into_gold(tmp_path):
    connection = build(tmp_path)
    result = gold.publish(connection)
    assert result["added"] == 1

    record = gold.get(connection, "camden", REFERENCE)
    assert record["data"]["application"]["reference"] == REFERENCE


def test_publishing_twice_does_not_duplicate(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)
    gold.publish(connection)
    count = connection.execute("SELECT count(*) FROM gold.applications").fetchone()[0]
    assert count == 1


def test_an_edit_survives_the_pipeline_running_again(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)

    record = gold.get(connection, "camden", REFERENCE)
    record["data"]["caseOfficer"]["name"] = "Redacted by an officer"
    gold.update(connection, "camden", REFERENCE, record, edited_by="officer@camden.gov.uk")

    # The whole pipeline runs again, as it would tomorrow morning.
    camden_mapper.map_all(connection)
    gold.publish(connection)

    after = gold.get(connection, "camden", REFERENCE)
    assert after["data"]["caseOfficer"]["name"] == "Redacted by an officer"


def test_silver_is_never_touched_by_an_edit(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)

    record = gold.get(connection, "camden", REFERENCE)
    record["data"]["caseOfficer"]["name"] = "Removed"
    gold.update(connection, "camden", REFERENCE, record, edited_by="officer@camden.gov.uk")

    silver = connection.execute(
        "SELECT record FROM silver.applications WHERE reference = ?", [REFERENCE]
    ).fetchone()[0]
    assert json.loads(silver)["data"]["caseOfficer"]["name"] == "Not recorded"


def test_every_change_is_recorded_with_who_and_when(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)

    record = gold.get(connection, "camden", REFERENCE)
    gold.update(connection, "camden", REFERENCE, record, edited_by="officer@camden.gov.uk")
    gold.delete(connection, "camden", REFERENCE, edited_by="manager@camden.gov.uk")

    history = gold.history(connection, "camden", REFERENCE)
    assert [entry["action"] for entry in history] == ["update", "delete"]
    assert history[1]["by"] == "manager@camden.gov.uk"


def test_a_record_can_be_added_by_hand(tmp_path):
    connection = build(tmp_path)
    added = gold.create(connection, "camden", "NEW/1", {"applicationType": "pp.full.minor"},
                        edited_by="officer@camden.gov.uk")
    assert added
    assert gold.get(connection, "camden", "NEW/1") is not None
    assert not gold.create(connection, "camden", "NEW/1", {}, edited_by="someone")
