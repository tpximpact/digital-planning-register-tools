"""Both councils through the shared mapper, without needing a database."""

import json

import pytest

from dpr_pipeline import validate
from dpr_pipeline.mappers import barnet, camden, common

from .test_camden_mapper import SAMPLE

UNIFORM = {
    "APPLICATIONS": {
        "REFVAL": "24/0001/FUL", "APPTYPE": "HSE", "RECEIVEDDATE": "2024-03-04",
        "VALIDDATE": "2024-03-11", "DECISIONDATE": "2024-05-02", "DECISION": "GTD",
        "STATUS": "DC", "CASEOFFICER": "A Patel", "APPLICANTNAME": "Mr A Owner",
    },
    "PROPOSALS": {"PROPOSAL": "Single storey rear extension"},
    "ADDRESSES": {"HOUSENUMBER": "12", "STREET": "High Road", "TOWN": "London",
                  "POSTCODE": "N12 8AB"},
}


def with_application(**changes):
    return {**UNIFORM, "APPLICATIONS": {**UNIFORM["APPLICATIONS"], **changes}}


def test_barnet_reads_across_tables_and_joins_the_address():
    record, issues, beside = barnet.map_record(UNIFORM)
    assert record["applicationType"] == "pp.full.householder"
    assert beside["address"] == "12 High Road London N12 8AB"
    assert beside["description"] == "Single storey rear extension"
    assert beside["decision"] == "Granted"
    assert beside["status"] == "Decided"
    assert record["data"]["assessment"]["planningOfficerDecision"] == "granted"


def test_barnet_code_tables_come_from_the_yaml():
    assert barnet.TYPE_CODES["HSE"] == "pp.full.householder"
    assert common.Mapping.load("barnet").lookups["decision"]["REF"] == "Refused"


def test_unknown_barnet_codes_are_reported():
    _, issues, _ = barnet.map_record(with_application(APPTYPE="ZZZ", STATUS="QQQ", DECISION="XXX"))
    fields = {field for field, _, _ in issues}
    assert {"APPTYPE", "STATUS", "DECISION"} <= fields


def test_a_refusal_and_a_withdrawal_map_differently():
    refused, _, _ = barnet.map_record(with_application(DECISION="REF"))
    assert refused["data"]["assessment"]["planningOfficerDecision"] == "refused"

    withdrawn, _, _ = barnet.map_record(with_application(DECISION="WDN"))
    assert "withdrawnAt" in withdrawn["data"]["application"]
    assert withdrawn["data"]["application"]["status"] == "withdrawn"


def test_an_invalid_uniform_status_returns_the_application():
    record, _, _ = barnet.map_record(with_application(STATUS="INV", DECISION="", DECISIONDATE=""))
    application = record["data"]["application"]
    assert (application["stage"], application["status"]) == ("validation", "returned")


def test_the_submission_block_comes_from_the_mapped_fields():
    camden_record, _, _ = camden.map_record(SAMPLE)
    data = camden_record["submission"]["data"]
    assert data["proposal"]["description"] == "Reconfiguration of ground floor level"
    assert data["property"]["address"]["singleLine"] == "114-118 Southampton Row WC1B 5AA"
    assert data["property"]["address"]["latitude"] == 51.5215
    assert data["applicant"]["name"] == {"first": "A N", "last": "Other"}

    barnet_record, _, _ = barnet.map_record(UNIFORM)
    assert barnet_record["submission"]["data"]["property"]["address"]["singleLine"] \
        == "12 High Road London N12 8AB"


def test_a_council_with_more_data_only_needs_more_yaml():
    """An opt_ line in the mapping is all it takes to carry the field through."""
    mapping = common.Mapping({
        "council": "camden",
        "fields": {
            **common.Mapping.load("camden").fields,
            "opt_expiry": {"from": "target_date", "as": "date"},
            "opt_recommendation": {"from": "recommendation"},
        },
    })
    source = {**SAMPLE, "target_date": "2018-08-01", "recommendation": "Refuse", "decision_type": ""}
    issues = []
    extra = common.standard_fields(mapping, source, issues)
    assert str(extra["expiry_date"]) == "2018-08-01"
    assert extra["recommendation"] == "refused"


def _schema():
    path = validate.find_schema()
    if path is None:
        pytest.skip("no schema checkout found, set DPR_SCHEMAS")
    return validate.load_schema(path)


@pytest.mark.parametrize("record", [
    camden.map_record(SAMPLE)[0],
    camden.map_record({**SAMPLE, "decision_type": "Withdrawn"})[0],
    barnet.map_record(UNIFORM)[0],
    barnet.map_record(with_application(DECISION="REF"))[0],
    barnet.map_record(with_application(STATUS="INV", DECISION="", DECISIONDATE=""))[0],
])
def test_mapped_records_fit_the_published_schema_apart_from_the_known_gaps(record):
    from jsonschema import Draft202012Validator

    record = json.loads(json.dumps(record))
    problems = [
        real.message
        for error in Draft202012Validator(_schema()).iter_errors(record)
        for real in validate._deepest(error)
        if not any(gap in real.message for gap in validate.LEGACY_GAPS)
        and not validate._inside_submission(real)
    ]
    assert problems == []
