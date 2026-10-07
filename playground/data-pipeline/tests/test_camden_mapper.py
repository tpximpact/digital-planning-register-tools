"""The mapper is where the field decisions live, so the tests describe those decisions."""

from dpr_pipeline import application_types
from dpr_pipeline.mappers import camden

SAMPLE = {
    "application_number": "2018/2267/P",
    "application_type": "Full Planning Permission",
    "development_address": "114-118 Southampton Row WC1B 5AA",
    "development_description": "Reconfiguration of ground floor level",
    "system_status": "Final decision",
    "decision_type": "Granted",
    "valid_from_date": "2018-05-16T00:00:00.000",
    "decision_date": "2018-06-07T00:00:00.000",
    "applicant_name": "A N Other",
    "location": {"latitude": "51.5215", "longitude": "-0.1220"},
}


def test_agreed_type_is_mapped_without_comment():
    record, issues, beside = camden.map_record(SAMPLE)
    assert record["applicationType"] == "pp.full.minor"
    assert beside["mapped_by"] == "agreed"
    assert not any(field == "application_type" for field, _, _ in issues)


def test_type_without_an_equivalent_gets_a_valid_one_and_is_reported():
    # A record with no application type fails the schema, so an empty value is not an option.
    record, issues, beside = camden.map_record(
        {**SAMPLE, "application_type": "Householder Application"}
    )
    assert record["applicationType"] == "pp.full.householder"
    assert beside["mapped_by"] == "fallback"
    assert any(field == "application_type" for field, _, _ in issues)


def test_camden_wording_is_kept_beside_the_mapped_type():
    _, _, beside = camden.map_record({**SAMPLE, "application_type": "Listed Building Consent"})
    assert beside["source_application_type"] == "Listed Building Consent"


def test_unheard_of_type_still_produces_a_valid_record():
    record, issues, _ = camden.map_record({**SAMPLE, "application_type": "Something New"})
    assert record["applicationType"] in application_types.VALID
    assert any("last resort" in reason for _, _, reason in issues)


def test_every_mapping_target_exists_in_the_standard():
    assert application_types.unknown_targets() == set()


def test_dates_reach_both_the_record_and_the_columns():
    record, _, beside = camden.map_record(SAMPLE)
    assert record["data"]["validation"]["validatedAt"].startswith("2018-05-16")
    assert record["data"]["application"]["publishedAt"].startswith("2018-06-07")
    assert str(beside["valid_from"]) == "2018-05-16"
    assert str(beside["decided_at"]) == "2018-06-07"


def test_a_decided_application_is_marked_as_determined():
    record, _, _ = camden.map_record(SAMPLE)
    assert record["data"]["application"]["status"] == "determined"
    assert record["data"]["application"]["stage"] == "assessment"


def test_the_missing_submission_is_reported_rather_than_invented():
    # The standard expects the original submission. Historic records predate it, so the gap is
    # recorded instead of being filled with something made up.
    _, issues, _ = camden.map_record(SAMPLE)
    assert any(field == "submission" for field, _, _ in issues)


def test_description_and_address_are_kept_beside_the_record():
    _, _, beside = camden.map_record(SAMPLE)
    assert beside["address"] == "114-118 Southampton Row WC1B 5AA"
    assert beside["description"] == "Reconfiguration of ground floor level"


def test_missing_coordinates_do_not_crash():
    _, issues, _ = camden.map_record({**SAMPLE, "location": {}})
    assert any(field == "location" for field, _, _ in issues)
