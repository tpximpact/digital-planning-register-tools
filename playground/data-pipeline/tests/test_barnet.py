"""Barnet, from a made up Uniform export.

Barnet have no approval to share their records and there is no contract, so these tests run against
rows in the right shape rather than real ones. The shape is the part being tested.
"""

import json

from dpr_pipeline import application_types, db, gold
from dpr_pipeline.config import SourceConfig
from dpr_pipeline.mappers import barnet as barnet_mapper
from dpr_pipeline.mappers import camden as camden_mapper
from dpr_pipeline.sources import barnet as barnet_source
from dpr_pipeline.sources import camden as camden_source
from dpr_pipeline.storage import Storage

from .test_camden_mapper import SAMPLE
from .test_pipeline import FakeSession

UNIFORM_ROW = {
    "APPLICATIONS": {
        "KEYVAL": "00000001",
        "REFVAL": "24/0001/FUL",
        "APPTYPE": "HSE",
        "RECEIVEDDATE": "2024-03-04",
        "VALIDDATE": "2024-03-11",
        "DECISIONDATE": "2024-05-02",
        "DECISION": "GTD",
        "STATUS": "DC",
        "CASEOFFICER": "A Patel",
        "APPLICANTNAME": "Mr A Owner",
    },
    "PROPOSALS": {"KEYVAL": "00000001", "PROPOSAL": "Single storey rear extension"},
    "ADDRESSES": {
        "KEYVAL": "00000001",
        "HOUSENUMBER": "12",
        "STREET": "High Road",
        "TOWN": "London",
        "POSTCODE": "N12 8AB",
    },
}


def make_export(tmp_path):
    """Write a small export, one CSV per table, the way a council would send it."""
    import csv

    folder = tmp_path / "export"
    folder.mkdir()
    for table, row in UNIFORM_ROW.items():
        with (folder / f"{table}.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(row))
            writer.writeheader()
            writer.writerow(row)
    return folder


def test_codes_become_the_standard(tmp_path):
    record, issues, beside = barnet_mapper.map_record(UNIFORM_ROW)
    assert record["applicationType"] == "pp.full.householder"
    assert beside["decision"] == "Granted"
    assert beside["status"] == "Decided"
    assert not any(field == "APPTYPE" for field, _, _ in issues)


def test_tables_are_joined_into_one_record(tmp_path):
    _, _, beside = barnet_mapper.map_record(UNIFORM_ROW)
    assert beside["description"] == "Single storey rear extension"
    assert beside["address"] == "12 High Road London N12 8AB"


def test_unknown_code_still_produces_a_valid_type():
    row = {**UNIFORM_ROW, "APPLICATIONS": {**UNIFORM_ROW["APPLICATIONS"], "APPTYPE": "ZZZ"}}
    record, issues, _ = barnet_mapper.map_record(row)
    assert record["applicationType"] in application_types.VALID
    assert any(field == "APPTYPE" for field, _, _ in issues)


def test_made_up_data_is_labelled_as_such():
    _, _, beside = barnet_mapper.map_record(UNIFORM_ROW)
    assert beside["made_up_data"] is True


def test_csv_export_loads_into_bronze_keeping_their_column_names(tmp_path):
    connection = db.connect(str(tmp_path / "test.duckdb"))
    folder = make_export(tmp_path)
    source = SourceConfig(name="barnet", url=str(folder))

    written = barnet_source.ingest(connection, source, Storage(str(tmp_path / "bronze")))
    assert written == 1

    raw = connection.execute(
        "SELECT record FROM bronze.applications WHERE council = 'barnet'"
    ).fetchone()[0]
    stored = json.loads(raw)
    assert stored["APPLICATIONS"]["REFVAL"] == "24/0001/FUL"
    assert "PROPOSALS" in stored and "ADDRESSES" in stored


def test_two_councils_end_up_in_the_same_shape(tmp_path):
    """The point of the whole pipeline: different systems, one shape at the end."""
    connection = db.connect(str(tmp_path / "test.duckdb"))
    storage = Storage(str(tmp_path / "bronze"))

    camden_source.ingest(
        connection,
        SourceConfig(name="camden", url="http://example.test/data.json", page_size=10),
        storage,
        session=FakeSession([SAMPLE]),
    )
    barnet_source.ingest(
        connection, SourceConfig(name="barnet", url=str(make_export(tmp_path))), storage
    )

    camden_mapper.map_all(connection)
    barnet_mapper.map_all(connection)
    gold.publish(connection)

    rows = connection.execute(
        "SELECT council, record FROM gold.applications ORDER BY council"
    ).fetchall()
    assert [row[0] for row in rows] == ["barnet", "camden"]

    shapes = []
    for _, record in rows:
        published = json.loads(record)
        shapes.append((
            sorted(published.keys()),
            sorted(published["data"].keys()),
            sorted(published["data"]["application"].keys()),
            sorted(published["metadata"].keys()),
        ))
    assert shapes[0] == shapes[1]
