"""Validation against the real ODP schema.

These tests are skipped when the schema repository is not checked out, so the suite still runs
anywhere. When it is there, they are the ones that matter most: they prove a legacy record can be
made to fit the published standard.
"""

import pytest

from dpr_pipeline import gold, validate

from .test_barnet import make_export
from .test_gold import build

SCHEMA = validate.find_schema()
needs_schema = pytest.mark.skipif(SCHEMA is None, reason="ODP schema repository not checked out")


def test_basic_checks_pass_on_a_mapped_record(tmp_path):
    connection = build(tmp_path)
    assert validate.basic_checks(connection) == []


def test_basic_checks_notice_a_missing_description(tmp_path):
    connection = build(tmp_path)
    connection.execute("UPDATE silver.applications SET description = ''")
    assert any("description" in problem for _, problem in validate.basic_checks(connection))


@needs_schema
def test_camden_records_fit_the_published_standard(tmp_path):
    connection = build(tmp_path)
    schema = validate.load_schema(SCHEMA)
    assert validate.against_schema(connection, schema, "camden") == []


@needs_schema
def test_barnet_records_fit_the_same_standard(tmp_path):
    from dpr_pipeline.config import SourceConfig
    from dpr_pipeline.mappers import barnet as barnet_mapper
    from dpr_pipeline.sources import barnet as barnet_source
    from dpr_pipeline.storage import Storage

    connection = build(tmp_path)
    barnet_source.ingest(
        connection,
        SourceConfig(name="barnet", url=str(make_export(tmp_path))),
        Storage(str(tmp_path / "bronze")),
    )
    barnet_mapper.map_all(connection)

    schema = validate.load_schema(SCHEMA)
    assert validate.against_schema(connection, schema, "barnet") == []


@needs_schema
def test_the_missing_submission_shows_up_under_strict(tmp_path):
    """The one gap legacy data cannot close, so it is reported apart from the rest."""
    connection = build(tmp_path)
    schema = validate.load_schema(SCHEMA)

    strict = validate.against_schema(connection, schema, "camden", strict=True)
    assert any(validate.LEGACY_GAP in problem for _, problem in strict)


@needs_schema
def test_an_edit_cannot_quietly_break_the_standard(tmp_path):
    """Gold is editable, so it is worth knowing the check still applies after someone edits."""
    connection = build(tmp_path)
    gold.publish(connection)

    record = gold.get(connection, "camden", "2018/2267/P")
    record["applicationType"] = "not a real type"
    gold.update(connection, "camden", "2018/2267/P", record, edited_by="someone")

    from jsonschema import Draft202012Validator

    validator = Draft202012Validator(validate.load_schema(SCHEMA))
    assert list(validator.iter_errors(record))
