"""Batch approval.

A council with tens of thousands of historic records cannot read them one at a time. Nothing is
public until somebody approves it, and the pipeline already knows which records have something
worth looking at, so the rest can go together.
"""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, gold

from .test_gold import REFERENCE, build

EDITOR = {"X-Edited-By": "officer@camden.gov.uk"}


@pytest.fixture
def connection(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)
    return connection


@pytest.fixture
def client(connection, monkeypatch):
    monkeypatch.setattr(api, "_connection", lambda: connection)
    return TestClient(api.app)


def test_nothing_is_public_until_it_is_approved(connection):
    row = connection.execute("SELECT approved FROM gold.applications").fetchone()
    assert row[0] is False


def test_a_structural_gap_does_not_hold_a_record_back(connection):
    """Every legacy record is missing the original submission. That is not a reason to review it."""
    issues = connection.execute(
        "SELECT DISTINCT field FROM silver.mapping_issues"
    ).fetchall()
    assert any(field in gold.KNOWN_LIMITS for (field,) in issues)

    counts = gold.flagged_counts(connection, "camden")
    assert counts["clean"] == 1
    assert counts["flagged"] == 0


def test_a_real_gap_does_hold_a_record_back(connection):
    connection.execute(
        """
        INSERT INTO silver.mapping_issues (council, reference, field, value, reason, found_at)
        VALUES ('camden', ?, 'application_type', 'Something', 'no equivalent', now())
        """,
        [REFERENCE],
    )
    counts = gold.flagged_counts(connection, "camden")
    assert counts["clean"] == 0
    assert counts["flagged"] == 1


def test_approving_the_clean_ones_leaves_the_rest(connection):
    gold.create(connection, "camden", "FLAGGED/1", {"applicationType": "pp.full.minor"},
                edited_by="setup")
    connection.execute(
        """
        INSERT INTO silver.mapping_issues (council, reference, field, value, reason, found_at)
        VALUES ('camden', 'FLAGGED/1', 'application_type', 'Something', 'no equivalent', now())
        """
    )
    # A record added by hand counts as edited, so put it back to waiting for this test.
    connection.execute("UPDATE gold.applications SET approved = false")

    clean = [reference for _, reference in gold.clean_references(connection, "camden")]
    assert REFERENCE in clean
    assert "FLAGGED/1" not in clean

    approved = gold.approve(connection, "camden", clean, "officer@camden.gov.uk")
    assert approved == 1

    counts = gold.flagged_counts(connection, "camden")
    assert counts["approved"] == 1
    assert counts["flagged"] == 1


def test_approving_twice_does_not_double_count(connection):
    gold.approve(connection, "camden", [REFERENCE], "officer@camden.gov.uk")
    again = gold.approve(connection, "camden", [REFERENCE], "officer@camden.gov.uk")
    assert again == 0


def test_every_approval_is_attributed(connection):
    gold.approve(connection, "camden", [REFERENCE], "officer@camden.gov.uk")
    history = gold.history(connection, "camden", REFERENCE)
    assert history[-1]["action"] == "approve"
    assert history[-1]["by"] == "officer@camden.gov.uk"


def test_a_record_can_be_taken_back_out(connection):
    gold.approve(connection, "camden", [REFERENCE], "officer@camden.gov.uk")
    gold.unapprove(connection, "camden", [REFERENCE], "manager@camden.gov.uk")

    counts = gold.flagged_counts(connection, "camden")
    assert counts["approved"] == 0
    assert [entry["action"] for entry in gold.history(connection, "camden", REFERENCE)][-1] \
        == "unapprove"


def test_public_only_shows_approved_records(client, connection):
    assert client.get("/public/applications").json()["total"] == 0
    assert client.get(f"/public/applications/camden/{REFERENCE}").status_code == 404

    gold.approve(connection, "camden", [REFERENCE], "officer@camden.gov.uk")

    assert client.get("/public/applications").json()["total"] == 1
    assert client.get(f"/public/applications/camden/{REFERENCE}").status_code == 200


def test_private_shows_everything_and_says_which_is_which(client):
    body = client.get("/private/applications").json()
    item = body["applications"][0]
    assert item["approved"] is False
    assert "flagged" in item

    waiting = client.get("/private/applications", params={"state": "waiting"}).json()
    assert waiting["total"] == body["total"]
    assert client.get("/private/applications", params={"state": "approved"}).json()["total"] == 0


def test_approve_endpoint_takes_a_list(client):
    response = client.post("/private/approval/approve",
                           json={"council": "camden", "references": [REFERENCE]}, headers=EDITOR)
    assert response.json() == {"approved": 1}


def test_approve_endpoint_can_do_all_the_clean_ones(client):
    response = client.post("/private/approval/approve",
                           json={"council": "camden", "all_clean": True}, headers=EDITOR)
    assert response.json()["approved"] >= 1
    assert client.get("/public/applications").json()["total"] >= 1


def test_approving_without_a_name_is_refused(client):
    response = client.post("/private/approval/approve",
                           json={"council": "camden", "references": [REFERENCE]})
    assert response.status_code == 400


def test_the_summary_tells_a_reviewer_where_they_stand(client):
    summary = client.get("/private/approval/summary", params={"council": "camden"}).json()
    assert set(summary) == {"approved", "clean", "flagged"}
    assert summary["approved"] + summary["clean"] + summary["flagged"] >= 1
