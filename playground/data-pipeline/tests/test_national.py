"""The MHCLG national public view.

The point of these tests is not that the code runs. It is that the two standards are shaped
differently, and the translation has to be honest about that in both directions:

  what comes out    one nested record becomes rows across eight datasets, with the references the
                    national model needs created rather than pretended
  what comes back   the reverse direction, so the cost of storing data in the national shape can
                    be shown rather than argued about
  what is missing   the datasets ODP cannot fill are empty and say why, instead of being filled
                    with something invented
"""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, api_common, gold, national

from .test_gold import REFERENCE, build

EDITOR = "a reviewer"


@pytest.fixture
def connection(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)
    gold.approve(connection, "camden", [REFERENCE], EDITOR)
    return connection


@pytest.fixture
def translated(connection):
    national.translate_all(connection, "camden")
    return connection


@pytest.fixture
def client(translated, monkeypatch):
    monkeypatch.setattr(api_common, "_connection", lambda: translated)
    return TestClient(api.app)


# --- the shape of the thing -------------------------------------------------------------------


def test_the_spec_is_the_eight_datasets_and_fifty_two_fields():
    """If this fails, the vendored spec changed, which is a conversation rather than a bug."""
    assert len(national.DATASETS) == 8
    assert sum(len(d["fields"]) for d in national.DATASETS.values()) == 52


def test_one_record_becomes_rows_across_several_datasets(connection):
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden")

    assert len(rows["planning-application"]) == 1
    assert len(rows["site"]) == 1
    assert rows["planning-permission-timeline"], "a record with dates should produce events"


def test_the_site_gets_an_identity_odp_never_gave_it(connection):
    """Six of the missing national fields are relationships. Something has to create them."""
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden")

    site = rows["site"][0]["reference"]
    assert site == f"{REFERENCE}:site"
    assert rows["planning-application"][0]["site"] == site


def test_dates_become_typed_events(connection):
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden")

    events = {row["permission-process-event"] for row in rows["planning-permission-timeline"]}
    assert "application-submitted" in events
    assert events <= set(national.EVENTS), "an event outside the national vocabulary is not valid"


def test_every_event_has_a_date(connection):
    """An invented date in a timeline is worse than a missing event, so none are emitted empty."""
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden")

    assert all(row["event-date"] for row in rows["planning-permission-timeline"])


# --- being honest about what is not there -----------------------------------------------------


def test_the_datasets_odp_cannot_fill_stay_empty(connection):
    record = gold.get(connection, "camden", REFERENCE)
    rows, issues = national.translate(record, council="camden")

    for dataset in national.NO_SOURCE_IN_ODP:
        assert rows[dataset] == [], f"{dataset} has no source in ODP and must not be invented"
        assert any(found[0] == dataset for found in issues), f"{dataset} should say why it is empty"


def test_a_gap_is_recorded_rather_than_guessed(translated):
    reasons = translated.execute(
        "SELECT DISTINCT dataset FROM national.translation_issues"
    ).fetchall()
    assert {"planning-condition", "decision-condition", "section-106"} <= {d for (d,) in reasons}


def test_coverage_says_why_a_field_is_empty(translated):
    report = national.coverage(translated, "camden")
    conditions = [line for line in report if line["dataset"] == "planning-condition"]

    assert conditions, "the empty datasets still appear in coverage"
    assert all(line["filled"] == 0 for line in conditions)
    assert all(line["reason"] for line in conditions)


# --- the reverse direction, which is the storage question -------------------------------------


#: What silver keeps beside the record. The decision lives here rather than inside the ODP
#: record, because the council writes it in its own words and the standard has not settled them.
BESIDE = {"reference": REFERENCE, "address": "1 Example Street, London NW1 1AA",
          "description": "A proposal", "decision": "Granted", "decided_at": "2018-09-01"}


def test_a_record_survives_the_round_trip(connection):
    """Out to the national datasets and back. Nothing that comes back may be wrong."""
    record = gold.get(connection, "camden", REFERENCE)
    result = national.round_trip(record, council="camden", beside=BESIDE)

    assert result["changed"] == [], "a value that comes back different is a translation fault"
    assert result["kept"], "something should survive"


def test_the_time_of_day_does_not_survive_and_says_so(connection):
    """The national view holds a date where ODP holds a timestamp. Reported, not hidden."""
    record = gold.get(connection, "camden", REFERENCE)
    result = national.round_trip(record, council="camden", beside=BESIDE)

    assert "data.validation.receivedAt" in result["trimmed"] + result["kept"]
    assert all(path not in result["changed"] for path in result["trimmed"])


def test_a_decision_becomes_its_own_record(connection):
    """The largest structural difference: ODP nests the decision, the national model does not."""
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden", beside=BESIDE)

    notice = rows["decision-notice"][0]
    assert notice["reference"] == f"{REFERENCE}:decision"
    assert notice["planning-application"] == REFERENCE
    # The record carries the decision in the standard's own wording, so that is what travels,
    # not the council's wording held beside it.
    assert notice["decision"] == "granted"


def test_what_the_national_view_does_not_carry_is_named(connection):
    record = gold.get(connection, "camden", REFERENCE)
    result = national.round_trip(record, council="camden")

    assert "data.caseOfficer.name" in result["lost"], (
        "the national public view has no case officer, and that should be visible rather than"
        " quietly dropped"
    )


def test_the_reference_and_the_decision_come_back(connection):
    record = gold.get(connection, "camden", REFERENCE)
    rows, _ = national.translate(record, council="camden")
    back = national.to_odp(rows, council="camden")

    assert back["data"]["application"]["reference"] == REFERENCE
    assert back["applicationType"] == record["applicationType"]


# --- only approved records, same rule as the public endpoints ---------------------------------


def test_nothing_unapproved_reaches_the_national_view(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)

    written = national.translate_all(connection, "camden")
    assert written["planning-application"] == 0, (
        "the national public view is a publication, so an unapproved record has no business in it"
    )


def test_translating_again_does_not_duplicate(translated):
    before = translated.execute(
        "SELECT count(*) FROM national.planning_permission_timeline"
    ).fetchone()[0]
    national.translate_all(translated, "camden")
    after = translated.execute(
        "SELECT count(*) FROM national.planning_permission_timeline"
    ).fetchone()[0]
    assert before == after


# --- the api ----------------------------------------------------------------------------------


def test_the_datasets_are_listed(client):
    body = client.get("/national/datasets").json()
    assert len(body["datasets"]) == 8
    assert all(dataset["note"] for dataset in body["datasets"])


def test_a_dataset_can_be_read_as_rows(client):
    body = client.get("/national/planning-application").json()
    assert body["total"] == 1
    assert body["rows"][0]["reference"] == REFERENCE


def test_an_unknown_dataset_is_not_found(client):
    assert client.get("/national/made-up").status_code == 404


def test_one_application_comes_back_across_the_datasets(client):
    body = client.get(f"/national/application/camden/{REFERENCE}").json()
    assert body["planning-application"][0]["reference"] == REFERENCE
    assert body["site"][0]["reference"] == f"{REFERENCE}:site"
    assert body["planning-condition"] == []


def test_coverage_is_on_the_private_side(client):
    body = client.get("/national/coverage?council=camden").json()
    assert body["summary"]["fields"] == 52
    assert body["summary"]["filled"] > 0


# --- the csv export ---------------------------------------------------------------------------


def test_export_writes_one_csv_per_dataset(translated, tmp_path):
    directory = tmp_path / "national"
    written = national.export(translated, directory, "camden")

    assert set(written) == set(national.DATASETS)
    assert (directory / "planning-application.csv").exists()

    header = (directory / "site.csv").read_text(encoding="utf-8").splitlines()[0]
    assert header.startswith("reference,name,address-text")
