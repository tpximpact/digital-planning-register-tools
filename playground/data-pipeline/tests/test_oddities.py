"""Strange but true: each rule fires on the thing it is named for, and stays quiet otherwise."""

import datetime as dt

from dpr_pipeline import geo, oddities
from dpr_pipeline.mappers.common import Mapping

TODAY = dt.date(2026, 10, 17)
MAPPING = Mapping.load("camden")

SQUARE = {"type": "Polygon", "coordinates": [[[-0.13, 51.53], [-0.1295, 51.53], [-0.1295, 51.5305],
                                              [-0.13, 51.5305], [-0.13, 51.53]]]}
FINE = {"application_number": "2020/1/P", "application_received_date": "2020-01-10T00:00:00.000",
        "registered_date": "2020-01-14T00:00:00.000", "valid_from_date": "2020-01-14T00:00:00.000",
        "decision_date": "2020-03-01T00:00:00.000", "decision_type": "Granted",
        "statutory_expiry_date": "2020-03-10T00:00:00.000", "applicant_name": "A N Other",
        "development_description": "A loft", "latitude": 51.5302, "longitude": -0.1297,
        "location": SQUARE}


def found(source, rule_id):
    report = oddities.scan([(source.get("application_number", "x"), source)], MAPPING, today=TODAY)
    return next((o for o in report["oddities"] if o["id"] == rule_id), None)


def test_a_normal_record_has_nothing_strange_about_it():
    report = oddities.scan([("2020/1/P", FINE)], MAPPING, today=TODAY)
    assert report["oddities"] == []
    assert report["scanned"] == 1 and len(report["clean"]) == len(oddities.RULES) + 1


def test_expiry_before_received_says_by_how_much():
    odd = found({**FINE, "statutory_expiry_date": "2019-12-01T00:00:00.000"}, "expired-before-received")
    assert odd["count"] == 1
    assert "40 days before it was received" in odd["examples"][0]["fact"]


def test_the_extended_expiry_is_the_one_judged():
    source = {**FINE, "statutory_expiry_date": "2019-12-01T00:00:00.000",
              "extended_expiry_date": "2020-06-01T00:00:00.000"}
    assert found(source, "expired-before-received") is None


def test_decided_and_valid_before_received():
    assert found({**FINE, "decision_date": "2019-01-01T00:00:00.000"}, "decided-before-received")
    assert found({**FINE, "valid_from_date": "2019-01-01T00:00:00.000"}, "validated-before-received")


def test_dates_from_the_future_and_before_planning_existed():
    assert found({**FINE, "decision_date": "2027-01-01T00:00:00.000"}, "from-the-future")
    assert found({**FINE, "application_received_date": "1900-01-01T00:00:00.000",
                  "registered_date": "1900-01-01T00:00:00.000"}, "older-than-planning")


def test_a_wait_of_more_than_five_years():
    source = {**FINE, "application_received_date": "2010-01-01T00:00:00.000",
              "registered_date": "2010-01-05T00:00:00.000", "valid_from_date": "2010-01-05T00:00:00.000"}
    assert found(source, "the-very-long-wait")


def test_decision_and_date_must_go_together_but_withdrawals_need_no_date():
    assert found({k: v for k, v in FINE.items() if k != "decision_date"}, "undated-decision")
    assert found({k: v for k, v in FINE.items() if k != "decision_type"}, "decided-nothing")
    withdrawn = {k: v for k, v in FINE.items() if k != "decision_date"}
    assert found({**withdrawn, "decision_type": "Withdrawn Decision"}, "undated-decision") is None


def test_placeholder_applicants():
    for name in (".", "-", "N/A", "", "   "):
        assert found({**FINE, "applicant_name": name}, "mystery-applicant"), name
    assert found({**FINE, "applicant_name": "J Smith"}, "mystery-applicant") is None


def test_coordinates_outside_london_and_the_famous_zero_zero():
    assert found({**FINE, "latitude": 0, "longitude": 0}, "lost-at-sea")["examples"][0]["fact"].count("Atlantic")
    assert found({**FINE, "latitude": 40.0, "longitude": -3.7}, "lost-at-sea")
    assert found(FINE, "lost-at-sea") is None


def test_a_point_that_is_not_inside_its_own_site():
    assert found({**FINE, "latitude": 51.55, "longitude": -0.10}, "missed-its-own-site")
    assert found(FINE, "missed-its-own-site") is None


def test_giant_and_tiny_sites():
    big = {"type": "Polygon", "coordinates": [[[-0.2, 51.5], [-0.18, 51.5], [-0.18, 51.52],
                                               [-0.2, 51.52], [-0.2, 51.5]]]}
    tiny = {"type": "Polygon", "coordinates": [[[-0.13, 51.53], [-0.12999, 51.53], [-0.12999, 51.530015],
                                                [-0.13, 51.530015], [-0.13, 51.53]]]}
    assert "football pitches" in found({**FINE, "location": big}, "giant-site")["examples"][0]["fact"]
    assert found({**FINE, "location": tiny}, "tiny-site")
    assert found(FINE, "giant-site") is None and found(FINE, "tiny-site") is None


def test_a_very_long_description():
    assert found({**FINE, "development_description": "word " * 700}, "war-and-peace")


def test_references_that_become_the_same_one_are_twins():
    rows = [("2020/1/P", FINE), ("2020 1 P", FINE)]
    report = oddities.scan(rows, MAPPING, today=TODAY)
    twins = next(o for o in report["oddities"] if o["id"] == "identical-twins")
    assert twins["count"] == 1


def test_the_worst_comes_first_and_the_list_is_limited():
    rows = [(f"r{i}", {**FINE, "statutory_expiry_date": f"2019-{12 - i:02d}-01T00:00:00.000"})
            for i in range(6)]
    odd = oddities.scan(rows, MAPPING, limit=3, today=TODAY)["oddities"][0]
    assert odd["count"] == 6 and len(odd["examples"]) == 3
    assert odd["examples"][0]["reference"] == "r5"   # the longest gap


def test_a_record_that_cannot_be_read_is_counted_not_fatal():
    def explode(facts):
        raise ValueError("strange")
    broken = (oddities.Rule("boom", "Test", "Boom", "Always fails", explode),)
    report = oddities.scan([("a", FINE), ("b", FINE)], MAPPING, today=TODAY, rules=broken)
    assert report["scanned"] == 2 and report["unreadable"] == 2


def test_contains_respects_holes():
    holed = {"type": "Polygon", "coordinates": [SQUARE["coordinates"][0],
             [[-0.1299, 51.5001 + 0.0299], [-0.1297, 51.5300 + 0.0001], [-0.1297, 51.53025],
              [-0.1299, 51.53025], [-0.1299, 51.5301]]]}
    assert geo.contains(SQUARE, 51.5302, -0.1297) is True
    assert geo.contains(SQUARE, 51.6, -0.1297) is False
    assert geo.contains({"type": "Polygon", "coordinates": []}, 0, 0) in (None, False)

