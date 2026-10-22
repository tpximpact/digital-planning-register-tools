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


def test_a_granted_decision_reaches_the_assessment_block():
    record, _, _ = camden.map_record(SAMPLE)
    assessment = record["data"]["assessment"]
    assert assessment["planningOfficerDecision"] == "granted"
    assert assessment["planningOfficerDecisionDate"] == "2018-06-07"


def test_the_missing_expiry_date_is_estimated_and_reported():
    record, issues, _ = camden.map_record(SAMPLE)
    # No registered date in the sample, so it counts from the valid date, 56 days for this type.
    assert record["data"]["assessment"]["expiryDate"] == "2018-07-11"
    assert any(field == "expiryDate" and "estimated" in reason for field, _, reason in issues)


def test_the_site_geometry_is_built_from_the_coordinates():
    record, _, _ = camden.map_record(SAMPLE)
    boundary = record["submission"]["data"]["property"]["boundary"]
    assert boundary["site"]["geometry"]["type"] == "Polygon"
    assert record["data"]["application"]["reference"] == "2018-2267-P"


def test_wording_that_is_not_granted_or_refused_is_reported():
    record, issues, _ = camden.map_record({**SAMPLE, "decision_type": "Unusual outcome"})
    assert "assessment" not in record["data"]
    assert any(field == "decision" for field, _, _ in issues)


def test_withdrawn_is_not_a_decision():
    record, _, _ = camden.map_record({**SAMPLE, "decision_type": "Withdrawn"})
    application = record["data"]["application"]
    assert application["withdrawnAt"].startswith("2018-06-07")
    assert application["status"] == "withdrawn"
    assert "planningOfficerDecision" not in record["data"].get("assessment", {})


def test_the_field_layout_comes_from_the_yaml():
    from dpr_pipeline.mappers import common

    mapping = common.Mapping.load("camden")
    assert mapping.raw(SAMPLE, "reference") == "2018/2267/P"
    assert mapping.raw(SAMPLE, "latitude") == "51.5215"
    assert str(mapping.get(SAMPLE, "decided")) == "2018-06-07"
    assert mapping.raw(SAMPLE, "nothing declared") == ""


def _site(source):
    record, _, _ = camden.map_record(source)
    return record["submission"]["data"]["property"].get("boundary")


def test_the_site_is_built_wherever_camden_puts_the_coordinates():
    bare = {k: v for k, v in SAMPLE.items() if k != "location"}
    flat = {**bare, "latitude": "51.5215", "longitude": "-0.1220"}
    point = {**bare, "location": {"latitude": "51.5215", "longitude": "-0.1220"}}
    for source in (flat, point):
        boundary = _site(source)
        assert boundary["site"]["geometry"]["type"] == "Polygon"
        west, south, east, north = boundary["site"]["bbox"]
        assert west < -0.1220 < east and south < 51.5215 < north


def test_no_coordinates_means_no_site_and_a_location_issue():
    bare = {k: v for k, v in SAMPLE.items() if k != "location"}
    assert _site(bare) is None
    _, issues, _ = camden.map_record(bare)
    assert any(field == "location" for field, _, _ in issues)


# --- the extended dataset: a real boundary, real dates -------------------------------------------

PLOT = {"type": "Polygon", "coordinates": [[
    [-0.1221, 51.5214], [-0.1219, 51.5214], [-0.1219, 51.5216], [-0.1221, 51.5216],
    [-0.1221, 51.5214]]]}
EXTENDED = {**{k: v for k, v in SAMPLE.items() if k != "location"},
            "latitude": 51.5215, "longitude": -0.1220, "location": PLOT,
            "application_received_date": "2018-05-10T00:00:00.000",
            "registered_date": "2018-05-14T00:00:00.000",
            "statutory_expiry_date": "2018-07-11T00:00:00.000"}


def test_the_plotted_polygon_is_the_site_not_a_square_around_the_point():
    record, issues, _ = camden.map_record(EXTENDED)
    boundary = record["submission"]["data"]["property"]["boundary"]
    assert boundary["site"]["geometry"] == PLOT
    assert boundary["area"]["squareMetres"] > 300          # a 10 m square would be 100
    assert not any(field == "boundary" for field, _, _ in issues)


def test_an_unusable_polygon_falls_back_to_the_square_and_says_so():
    broken = {**EXTENDED, "location": {"type": "Polygon", "coordinates": [[[0, 0], [1, 1]]]}}
    record, issues, _ = camden.map_record(broken)
    assert record["submission"]["data"]["property"]["boundary"]["area"]["squareMetres"] == 100.0
    assert any(field == "boundary" for field, _, _ in issues)


def test_a_polygon_sent_as_a_json_string_is_still_read():
    import json
    record, _, _ = camden.map_record({**EXTENDED, "location": json.dumps(PLOT)})
    assert record["submission"]["data"]["property"]["boundary"]["site"]["geometry"] == PLOT


def test_no_spatial_information_means_no_site_and_a_location_issue():
    bare = {k: v for k, v in EXTENDED.items() if k not in ("latitude", "longitude", "location")}
    record, issues, _ = camden.map_record(bare)
    assert "boundary" not in record["submission"]["data"].get("property", {})
    assert any(field == "location" for field, _, _ in issues)


def test_received_is_when_it_arrived_not_when_it_was_registered():
    record, _, _ = camden.map_record(EXTENDED)
    assert record["data"]["validation"]["receivedAt"].startswith("2018-05-10")
    assert record["data"]["submission"]["submittedAt"].startswith("2018-05-10")


def test_registered_date_stands_in_when_there_is_no_received_date():
    later = {k: v for k, v in EXTENDED.items() if k != "application_received_date"}
    record, _, _ = camden.map_record(later)
    assert record["data"]["validation"]["receivedAt"].startswith("2018-05-14")


def test_the_real_expiry_replaces_the_estimate():
    record, issues, _ = camden.map_record(EXTENDED)
    assert record["data"]["assessment"]["expiryDate"] == "2018-07-11"
    assert not any(field == "expiryDate" for field, _, _ in issues)


def test_an_extended_expiry_beats_the_statutory_one():
    record, _, _ = camden.map_record({**EXTENDED, "extended_expiry_date": "2018-09-01T00:00:00.000"})
    assert record["data"]["assessment"]["expiryDate"] == "2018-09-01"


def test_without_either_expiry_the_estimate_is_used_and_flagged():
    bare = {k: v for k, v in EXTENDED.items() if k != "statutory_expiry_date"}
    record, issues, _ = camden.map_record(bare)
    assert "expiryDate" in record["data"]["assessment"]
    assert any(field == "expiryDate" and "estimated" in why for field, _, why in issues)


def test_an_expiry_before_the_received_date_is_kept_but_flagged():
    odd = {**EXTENDED, "statutory_expiry_date": "2018-04-01T00:00:00.000"}
    record, issues, _ = camden.map_record(odd)
    assert record["data"]["assessment"]["expiryDate"] == "2018-04-01"
    assert any(field == "expiryDate" and "before the received date" in why
               for field, _, why in issues)


# --- size, decisions, status ----------------------------------------------------------------------

def test_the_return_code_makes_a_full_application_major_or_minor():
    major = camden.map_record({**EXTENDED, "statutory_return_code": "EMAJOFF"})[0]
    assert major["applicationType"] == "pp.full.major"
    minor = camden.map_record({**EXTENDED, "statutory_return_code": "EMIDW"})[0]
    assert minor["applicationType"] == "pp.full.minor"
    unknown = camden.map_record({**EXTENDED, "statutory_return_code": "EOTHER"})[0]
    assert unknown["applicationType"] == "pp.full.minor"


def test_outline_applications_are_sized_too_and_other_types_are_left_alone():
    outline = {**EXTENDED, "application_type": "Outline Planning Permission"}
    assert camden.map_record({**outline, "statutory_return_code": "EMADW"})[0][
        "applicationType"] == "pp.outline.major"
    assert camden.map_record({**outline, "statutory_return_code": "EMIOT"})[0][
        "applicationType"] == "pp.outline.minor"
    assert camden.map_record({**outline, "statutory_return_code": ""})[0][
        "applicationType"] == "pp.outline"
    householder = {**EXTENDED, "application_type": "Householder Application",
                   "statutory_return_code": "EMAJOFF"}
    assert camden.map_record(householder)[0]["applicationType"] == "pp.full.householder"


def _decision(wording, **more):
    record, issues, _ = camden.map_record({**EXTENDED, "decision_type": wording, **more})
    return record["data"].get("assessment", {}).get("planningOfficerDecision"), issues, record


def test_camdens_decision_wordings_are_sorted_by_a_table_not_by_keywords():
    assert _decision("Granted Subject to a Section 106 Legal Agreement")[0] == "granted"
    assert _decision("Approve Works (TPO)")[0] == "granted"
    assert _decision("No Objection to Works to Tree(s) in CA")[0] == "granted"
    assert _decision("Refuse Prior Approval")[0] == "refused"
    assert _decision("Prior Approval Required - Approval Refused")[0] == "refused"
    assert _decision("GRANTED")[0] == "granted"                      # case does not matter


def test_a_split_decision_is_not_called_refused_any_more():
    for wording in ("Part Granted/Refused", "Part Granted/Refused - warn of prosecution",
                    "Grant Certificate, Refuse Application"):
        decision, issues, _ = _decision(wording)
        assert decision is None
        assert any(field == "decision" and "not granted or refused" in why
                   for field, _, why in issues), wording


def test_a_non_determination_and_prior_approval_not_required_are_not_decisions():
    for wording in ("Non-Determination: would have refused",
                    "Non-Determination: would have granted", "Prior Approval not required"):
        assert _decision(wording)[0] is None, wording


def test_every_decision_wording_camden_uses_is_in_the_table():
    from dpr_pipeline.mappers import common
    table = common.Mapping.load("camden").lookups["decision_outcome"]
    assert len(table) == 44
    assert set(table.values()) == {"granted", "refused", "withdrawn", "none"}


def test_a_withdrawn_decision_uses_the_status_change_date():
    withdrawn = {"system_status": "Withdrawn", "system_status_change_date": "2018-07-02T00:00:00.000",
                 "decision_date": ""}
    _, _, record = _decision("Withdrawn Decision", **withdrawn)
    application = record["data"]["application"]
    assert application["status"] == "withdrawn"
    assert application["withdrawnAt"].startswith("2018-07-02")


def test_a_withdrawn_status_alone_is_enough():
    record, _, _ = camden.map_record({**EXTENDED, "decision_type": "", "decision_date": "",
                                      "system_status": "Withdrawn",
                                      "system_status_change_date": "2018-07-02T00:00:00.000"})
    assert record["data"]["application"]["status"] == "withdrawn"


def test_a_withdrawal_with_no_date_anywhere_uses_the_received_date_and_says_so():
    record, issues, _ = camden.map_record({**EXTENDED, "decision_type": "Withdrawn Decision",
                                           "decision_date": "", "system_status_change_date": ""})
    assert record["data"]["application"]["withdrawnAt"].startswith("2018-05-10")
    assert any(field == "withdrawn" for field, _, _ in issues)


def test_an_appeal_lodged_is_described_from_the_status_change_date():
    record, issues, _ = camden.map_record({**EXTENDED, "system_status": "Appeal Lodged",
                                           "system_status_change_date": "2018-08-01T00:00:00.000"})
    assert record["data"]["appeal"]["lodgedDate"] == "2018-08-01"
    assert record["data"]["application"]["stage"] == "appeal"
    assert any(field == "appeal" for field, _, _ in issues)


def test_an_appeal_decided_is_reported_because_the_lodged_date_is_missing():
    record, issues, _ = camden.map_record({**EXTENDED, "system_status": "Appeal Decided"})
    assert "appeal" not in record["data"]
    assert any(field == "appeal" and "no lodged date" in why for field, _, why in issues)


def test_known_statuses_are_quiet_and_an_unknown_one_is_reported():
    _, quiet, _ = camden.map_record({**EXTENDED, "system_status": "Registered"})
    assert not any(field == "system_status" for field, _, _ in quiet)
    _, loud, _ = camden.map_record({**EXTENDED, "system_status": "Teleported"})
    assert any(field == "system_status" for field, _, _ in loud)
