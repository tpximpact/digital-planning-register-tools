"""The record builder, against the stages in the standard's own examples.

Each case mirrors one of the example files (submission, invalid, assessment in progress, committee,
council determined, appeal, withdrawn) and checks the stage, the status and the blocks that stage
should carry. Where the published schema can be found the record is validated against it too.
"""

import datetime as dt
import json

import pytest

from dpr_pipeline import post_submission, validate

D = dt.date

BASE = dict(
    council="camden", application_type="ldc.proposed", reference="ABC-123-XYZ",
    received_at=D(2024, 2, 18), validated_at=D(2024, 2, 19), decided_at=None,
    officer_name="A Officer", generated_at=dt.datetime(2024, 3, 1, tzinfo=dt.timezone.utc),
)

APPEAL = dict(lodged=D(2024, 5, 1), reason="They ignored the environmental impact.")


def build(**extra):
    return post_submission.build(**{**BASE, **extra})


def application(record):
    return record["data"]["application"]


def test_a_legacy_row_with_no_decision_stays_in_validation():
    record = build()
    assert (application(record)["stage"], application(record)["status"]) == ("validation", "undetermined")
    assert "assessment" not in record["data"]


def test_an_invalid_application_is_returned():
    record = build(is_valid=False)
    assert (application(record)["stage"], application(record)["status"]) == ("validation", "returned")
    assert record["data"]["validation"]["isValid"] is False


def test_assessment_in_progress_carries_an_expiry_date():
    record = build(expiry_date=D(2024, 4, 11))
    assert (application(record)["stage"], application(record)["status"]) == ("assessment", "undetermined")
    assert record["data"]["assessment"] == {"expiryDate": "2024-04-11"}


def test_council_determined():
    record = build(decided_at=D(2024, 3, 21), decision="granted", expiry_date=D(2024, 4, 11),
                   decision_notice_url="https://planningregister.org")
    assert application(record)["status"] == "determined"
    assert record["data"]["assessment"] == {
        "expiryDate": "2024-04-11",
        "planningOfficerDecision": "granted",
        "planningOfficerDecisionDate": "2024-03-21",
        "decisionNotice": {"url": "https://planningregister.org"},
    }


def test_in_committee_has_a_recommendation_and_no_decision():
    record = build(recommendation="refused", committee_sent_at=D(2024, 3, 22),
                   expiry_date=D(2024, 4, 11))
    assert application(record)["status"] == "undetermined"
    assessment = record["data"]["assessment"]
    assert assessment["planningOfficerRecommendation"] == "refused"
    assert assessment["committeeSentDate"] == "2024-03-22"
    assert "committeeDecision" not in assessment


def test_committee_determined_uses_the_committee_fields():
    record = build(recommendation="refused", committee_sent_at=D(2024, 3, 22),
                   committee_decision="granted", decided_at=D(2024, 4, 1),
                   expiry_date=D(2024, 4, 11))
    assessment = record["data"]["assessment"]
    assert assessment["committeeDecision"] == "granted"
    assert assessment["committeeDecisionDate"] == "2024-04-01"
    assert "planningOfficerDecision" not in assessment


def test_withdrawn_keeps_its_stage_and_adds_when_and_why():
    record = build(expiry_date=D(2024, 4, 11), withdrawn_at=D(2024, 2, 20),
                   withdrawn_reason="The applicant decided not to proceed")
    assert application(record)["status"] == "withdrawn"
    assert application(record)["stage"] == "assessment"
    assert application(record)["withdrawnAt"].startswith("2024-02-20")
    assert application(record)["withdrawnReason"] == "The applicant decided not to proceed"


def test_appeal_stages_fill_in_as_the_appeal_moves():
    decided = dict(decided_at=D(2024, 3, 21), decision="granted", expiry_date=D(2024, 4, 11))
    lodged = build(**decided, appeal=APPEAL)
    assert application(lodged)["stage"] == "appeal"
    assert set(lodged["data"]["appeal"]) == {"lodgedDate", "reason"}

    determined = build(**decided, appeal={**APPEAL, "validated": D(2024, 5, 2),
                                          "started": D(2024, 5, 2), "decided": D(2024, 5, 7),
                                          "decision": "allowed"})
    appeal = determined["data"]["appeal"]
    assert appeal["decision"] == "allowed"
    assert appeal["decisionDate"] == "2024-05-07"


def test_consultation_is_only_written_when_there_is_one():
    assert "consultation" not in build()
    record = build(consultation={"start": D(2024, 2, 19), "end": D(2024, 3, 11), "site_notice": True})
    assert record["data"]["consultation"] == {
        "startDate": "2024-02-19", "endDate": "2024-03-11", "siteNotice": True}


def test_the_submission_holds_the_applicant_the_address_and_the_description():
    record = build(applicant_name="Mr A N Other", address="12 High Road N12 8AB",
                   description="Rear extension", latitude=51.6, longitude=-0.17)
    data = record["submission"]["data"]
    assert data["applicant"] == {"name": {"first": "Mr A N", "last": "Other"}}
    assert data["property"]["address"] == {"singleLine": "12 High Road N12 8AB",
                                           "title": "12 High Road N12 8AB",
                                           "latitude": 51.6, "longitude": -0.17}
    assert data["proposal"] == {"description": "Rear extension"}


def test_a_boundary_appears_only_when_the_source_has_one():
    assert "boundary" not in build(address="x")["submission"]["data"]["property"]
    shape = {"site": {"type": "Feature"}}
    assert build(address="x", boundary=shape)["submission"]["data"]["property"]["boundary"] == shape


def test_a_source_with_nothing_gives_an_empty_submission_not_invented_values():
    assert build()["submission"]["data"] == {}


@pytest.mark.parametrize("wording, expected", [
    ("Granted", "granted"), ("Grant with conditions", "granted"), ("Permitted", "granted"),
    ("Refused", "refused"), ("Refuse permission", "refused"),
    ("Withdrawn", None), ("Split decision", None), ("", None), (None, None), ("Gibberish", None),
])
def test_council_wording_becomes_the_standards_decision(wording, expected):
    assert post_submission.normalise_decision(wording) == expected


# ---- against the published schema, when a checkout can be found

def _schema():
    path = validate.find_schema()
    if path is None:
        pytest.skip("no schema checkout found, set DPR_SCHEMAS")
    return validate.load_schema(path)


CASES = {
    "in progress": dict(expiry_date=D(2024, 4, 11)),
    "council determined": dict(decided_at=D(2024, 3, 21), decision="granted",
                               expiry_date=D(2024, 4, 11),
                               decision_notice_url="https://planningregister.org"),
    "committee": dict(recommendation="refused", committee_sent_at=D(2024, 3, 22),
                      committee_decision="granted", decided_at=D(2024, 4, 1),
                      expiry_date=D(2024, 4, 11)),
    "withdrawn": dict(expiry_date=D(2024, 4, 11), withdrawn_at=D(2024, 2, 20),
                      withdrawn_reason="Not proceeding"),
    "invalid": dict(is_valid=False),
    "appeal": dict(decided_at=D(2024, 3, 21), decision="granted", expiry_date=D(2024, 4, 11),
                   appeal={**APPEAL, "validated": D(2024, 5, 2), "started": D(2024, 5, 2),
                           "decided": D(2024, 5, 7), "decision": "allowed"}),
    "consultation": dict(consultation={"start": D(2024, 2, 19), "end": D(2024, 3, 11),
                                       "site_notice": True}),
}


@pytest.mark.parametrize("name", CASES)
def test_every_stage_fits_the_published_schema(name):
    from jsonschema import Draft202012Validator

    record = json.loads(json.dumps(build(**CASES[name])))
    errors = [
        real.message for error in Draft202012Validator(_schema()).iter_errors(record)
        for real in validate._deepest(error)
        if not any(gap in real.message for gap in validate.LEGACY_GAPS)
        and not validate._inside_submission(real)
    ]
    assert errors == []


def test_a_point_becomes_a_geojson_site_around_it():
    site = build(address="x", latitude=51.5215, longitude=-0.122)[
        "submission"]["data"]["property"]["boundary"]
    ring = site["site"]["geometry"]["coordinates"][0]
    assert site["site"]["geometry"]["type"] == "Polygon"
    assert ring[0] == ring[-1] and len(ring) == 5
    west, south, east, north = site["site"]["bbox"]
    assert west < -0.122 < east and south < 51.5215 < north
    assert site["area"]["squareMetres"] == 100


def test_a_real_boundary_is_not_replaced_by_the_square():
    shape = {"site": {"type": "Feature"}, "area": {"squareMetres": 5}}
    record = build(address="x", latitude=51.5, longitude=-0.1, boundary=shape)
    assert record["submission"]["data"]["property"]["boundary"] == shape


def test_references_keep_only_letters_numbers_and_hyphens():
    from dpr_pipeline.post_submission import clean_reference
    assert clean_reference("2018/2267/P") == "2018-2267-P"
    assert clean_reference(" 2024/1180 (A) ") == "2024-1180-A"
    record = build(reference="2018/2267/P")
    assert record["data"]["application"]["reference"] == "2018-2267-P"
    assert record["metadata"]["id"] == "2018-2267-P"


def test_expiry_is_estimated_by_type_only_where_there_is_an_assessment():
    from dpr_pipeline import expiry
    assert expiry.days_for("pp.full.householder") == 56
    assert expiry.days_for("pp.full.major") == 91
    assert expiry.days_for("environmentalImpact.screening") == 112
    assert expiry.days_for("something.new") == 56
    decided = build(decided_at=D(2024, 3, 1), decision="granted", estimate_expiry=True)
    # ldc.proposed is 56 days, from the 18th of February.
    assert decided["data"]["assessment"]["expiryDate"] == "2024-04-14"
    assert "expiryDate" not in build(decided_at=D(2024, 3, 1), decision="granted"
                                     )["data"]["assessment"]
    waiting = build(estimate_expiry=True)
    assert "assessment" not in waiting["data"]


# ---- the schema extension: metadata.pipeline

def _problems(record, schema):
    from jsonschema import Draft202012Validator

    return [real.message for error in Draft202012Validator(schema).iter_errors(record)
            for real in validate._deepest(error)
            if not any(gap in real.message for gap in validate.LEGACY_GAPS)
            and not validate._inside_submission(real)]


def _with_pipeline(**changes):
    from dpr_pipeline import extension

    record = json.loads(json.dumps(build(decided_at=D(2024, 3, 21), decision="granted",
                                         estimate_expiry=True)))
    record["metadata"]["pipeline"] = extension.pipeline_metadata(
        council="camden", approved=False, approved_at=None, approved_by=None, edited=False,
        updated_at=None, updated_by=None, flagged=True, source_status="Decided",
        issues=[("expiryDate", "estimated")])
    record["metadata"]["pipeline"].update(changes)
    return record


def test_the_published_schema_refuses_extra_metadata_until_it_is_extended():
    import json as _json
    from pathlib import Path

    path = validate.find_schema()
    if path is None:
        pytest.skip("no schema checkout found, set DPR_SCHEMAS")
    plain = _json.loads(Path(path).read_text(encoding="utf-8"))
    assert _problems(_with_pipeline(), plain)
    assert _problems(_with_pipeline(), validate.load_schema(path)) == []


def test_the_extension_still_checks_what_it_adds():
    schema = _schema()
    assert _problems(_with_pipeline(approved="yes"), schema)
    assert _problems(_with_pipeline(surprise=1), schema)


# ---- check_record: the private and the public schema

@pytest.mark.parametrize("kind, name", [("public", "postSubmissionPublishedApplication.json"),
                                        ("private", "postSubmissionApplication.json")])
def test_a_built_record_is_checked_against_either_schema(kind, name):
    record = json.loads(json.dumps(build(decided_at=D(2024, 3, 21), decision="granted",
                                         estimate_expiry=True, applicant_name="A Owner",
                                         address="12 High Road", description="x",
                                         latitude=51.5, longitude=-0.1)))
    result = validate.check_record(record, kind)
    assert result["schema"] == name
    assert result["valid"] and result["errors"] == []
    assert result["knownGaps"] > 0          # the original submission, which a legacy record lacks


def test_a_broken_record_is_reported_for_both_schemas():
    record = json.loads(json.dumps(build()))
    del record["data"]["application"]
    for kind in ("public", "private"):
        result = validate.check_record(record, kind)
        assert not result["valid"] and any("application" in e for e in result["errors"])


def test_the_two_schemas_are_different_files():
    assert validate.find_schema(kind="public").name != validate.find_schema(kind="private").name
