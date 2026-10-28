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
def test_the_partial_submission_shows_up_under_strict(tmp_path):
    """The one gap legacy data cannot close, so it is reported apart from the rest."""
    connection = build(tmp_path)
    schema = validate.load_schema(SCHEMA)

    strict = validate.against_schema(connection, schema, "camden", strict=True)
    assert any(problem.startswith("submission") for _, problem in strict)


@needs_schema
def test_the_quick_check_finds_what_the_whole_schema_finds(tmp_path):
    """Checking only the alternative for the record's own type must not hide anything outside
    the submission: same errors as the full schema, minus the ones the full check throws away."""
    connection = build(tmp_path)
    connection.execute(
        "UPDATE silver.applications SET record = json_merge_patch(record, "
        "'{\"data\": {\"application\": {\"stage\": \"not a stage\"}}}')")
    schema = validate.load_schema(SCHEMA)
    quick = validate.against_schema(connection, schema, "camden")
    whole = [p for p in validate.against_schema(connection, schema, "camden", strict=True)
             if not p[1].startswith("submission")]
    assert quick and sorted(quick) == sorted(whole)


@needs_schema
def test_the_admin_check_reports_the_same_known_gaps_as_the_whole_schema(tmp_path):
    """The check button shows how much of the original submission a historic record lacks.
    Narrowing to one type must not change that count."""
    connection = build(tmp_path)
    gold.publish(connection)
    record = gold.get(connection, "camden", "2018-2267-P")

    whole = 0
    for error in validate._validator(str(SCHEMA)).iter_errors(record):
        whole += sum(1 for real in validate._deepest(error)
                     if any(gap in real.message for gap in validate.LEGACY_GAPS)
                     or validate._inside_submission(real))
    result = validate.check_record(record, "public", str(SCHEMA.parent.parent))
    assert result["knownGaps"] == whole > 0


@needs_schema
def test_an_unknown_application_type_is_named_not_searched(tmp_path):
    connection = build(tmp_path)
    connection.execute(
        "UPDATE silver.applications SET record = json_merge_patch(record, "
        "'{\"applicationType\": \"not.a.type\"}')")
    problems = validate.against_schema(connection, validate.load_schema(SCHEMA), "camden")
    assert len(problems) == 1 and "'not.a.type' is not one of" in problems[0][1]


@needs_schema
def test_an_edit_cannot_quietly_break_the_standard(tmp_path):
    """Gold is editable, so it is worth knowing the check still applies after someone edits."""
    connection = build(tmp_path)
    gold.publish(connection)

    record = gold.get(connection, "camden", "2018-2267-P")
    record["applicationType"] = "not a real type"
    gold.update(connection, "camden", "2018-2267-P", record, edited_by="someone")

    from jsonschema import Draft202012Validator

    validator = Draft202012Validator(validate.load_schema(SCHEMA))
    assert list(validator.iter_errors(record))

