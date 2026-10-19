"""What kind of problem a mapping issue is, and whether a person can do anything about it.

These came out of a review session. "Gap" was one word doing three jobs, and a reviewer looking at
a flagged record could not see what they were supposed to look at.
"""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, api_common, gold, issues

from .test_gold import REFERENCE, build


@pytest.fixture
def connection(tmp_path):
    connection = build(tmp_path)
    gold.publish(connection)
    return connection


@pytest.fixture
def client(connection, monkeypatch):
    monkeypatch.setattr(api_common, "_connection", lambda: connection)
    return TestClient(api.app)


# --- the three kinds --------------------------------------------------------------------------


def test_a_value_the_export_never_held_is_missing():
    assert issues.classify(
        "submission", "no original submission for a historic record, only the dates it was received"
    ) == issues.MISSING
    assert issues.classify("location", "no coordinates in the source record") == issues.MISSING


def test_a_value_that_disagrees_with_the_standard_is_a_mismatch():
    """The distinction the whole approval split rests on: only this kind can be read and settled."""
    assert issues.classify(
        "application_type", "put on pp.full.householder by fallback, not an agreed equivalent"
    ) == issues.MISMATCH
    assert issues.classify(
        "system_status", "council wording, not yet mapped to ODP status"
    ) == issues.MISMATCH


def test_a_row_that_is_not_an_application_is_excluded():
    assert issues.classify(
        "application_type", "not a planning application, left out of silver"
    ) == issues.EXCLUDED


def test_every_issue_in_silver_carries_a_kind(connection):
    rows = connection.execute(
        "SELECT count(*) FROM silver.mapping_issues WHERE kind IS NULL OR kind = ''"
    ).fetchone()[0]
    assert rows == 0

    kinds = {k for (k,) in connection.execute(
        "SELECT DISTINCT kind FROM silver.mapping_issues"
    ).fetchall()}
    assert kinds <= set(issues.KINDS)


# --- why a record is flagged ------------------------------------------------------------------


def test_the_reason_a_record_is_flagged_comes_back_with_it(client):
    """Showing the tag without the reason was the first thing anyone asked about the screen."""
    body = client.get("/admin/data/camden/gold").json()
    assert body["rows"]
    for item in body["rows"]:
        assert "flags" in item
        if item["flagged"]:
            assert item["flags"], "a flagged record must say what to look at"
            assert all(flag["reason"] for flag in item["flags"])


def test_the_list_and_the_approval_split_agree(client, connection):
    """A gap true of every legacy record must not flag a record in one place and not the other."""
    counts = gold.flagged_counts(connection, "camden")
    body = client.get("/admin/data/camden/gold", params={"size": 200}).json()
    flagged = sum(1 for item in body["rows"] if item["flagged"])
    assert flagged == counts["flagged"]


def test_a_structural_gap_does_not_show_as_a_reason(client):
    """The missing submission is true of every legacy record, so it is not something to read."""
    body = client.get("/admin/data/camden/gold").json()
    fields = {flag["field"] for item in body["rows"] for flag in item["flags"]}
    assert "submission" not in fields


# --- the public side is unchanged ---------------------------------------------------------------


def test_flags_stay_off_the_published_register(client, connection):
    """Why a record was held back is internal housekeeping, not planning data."""
    gold.approve(connection, "camden", [REFERENCE], "a reviewer")
    body = client.get("/api/@next/public/applications", headers={"x-client": "camden"}).json()
    assert body["data"]
    for item in body["data"]:
        assert "flags" not in item
        assert "flagged" not in item
