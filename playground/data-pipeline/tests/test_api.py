"""The API: only the ODP endpoints, public and unredacted."""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, api_common, db, gold, items

from .test_gold import REFERENCE, build
from .test_items import DOCUMENT, PUBLIC as COMMENT, SPECIALIST

EDITOR = {"X-Edited-By": "officer@camden.gov.uk"}
CAMDEN = {"x-client": "camden", "x-service": "tests"}
PUBLIC = "/api/@next/public/applications"
UNREDACTED = "/api/@next/applications"


@pytest.fixture
def client(tmp_path, monkeypatch):
    connection = build(tmp_path)
    gold.publish(connection)
    for reference in ("2019-0001-P", "2020-0002-P"):
        gold.create(connection, "camden", reference, {"applicationType": "pp.full.minor"},
                    edited_by="setup")
    # These tests are about the shape of the two sides, not about approval, so everything is
    # approved up front. Approval has its own tests.
    everything = [row[0] for row in connection.execute(
        "SELECT reference FROM gold.applications WHERE council = 'camden'").fetchall()]
    gold.approve(connection, "camden", everything, "setup")
    monkeypatch.setattr(api_common, "_connection", lambda: connection)
    return TestClient(api.app)


def test_public_is_read_only(client):
    """The register reads this. Nothing here should be able to change a record."""
    record = client.get(f"{PUBLIC}/{REFERENCE}", headers=CAMDEN).json()["data"]
    assert record["data"]["application"]["reference"] == REFERENCE

    assert client.put(f"{PUBLIC}/{REFERENCE}", json=record,
                      headers={**EDITOR, **CAMDEN}).status_code == 405
    assert client.delete(f"{PUBLIC}/{REFERENCE}",
                         headers={**EDITOR, **CAMDEN}).status_code == 405
    assert client.post(f"{PUBLIC}/NEW-2", json={}, headers={**EDITOR, **CAMDEN}).status_code == 405


def test_public_has_no_history(client):
    assert client.get(f"{PUBLIC}/{REFERENCE}/history", headers=CAMDEN).status_code == 404


# ---- the standard's own endpoints

def test_the_standard_list_is_records_in_an_api_response(client):
    body = client.get(PUBLIC, headers=CAMDEN, params={"resultsPerPage": 2}).json()
    assert set(body) == {"data", "pagination", "status"}
    assert body["status"] == {"code": 200, "message": "OK"}
    assert body["pagination"]["resultsPerPage"] == 2
    assert body["pagination"]["totalResults"] == 3
    assert all("applicationType" in item and "data" in item for item in body["data"])


def test_the_standard_list_needs_a_client(client):
    response = client.get(PUBLIC)
    assert response.status_code == 422
    body = response.json()
    assert body["data"] is None
    assert body["status"]["code"] == 422
    assert isinstance(body["status"]["detail"], str)


def test_the_client_header_picks_the_council(client):
    body = client.get(PUBLIC, headers={"x-client": "barnet"}).json()
    assert body["data"] == []
    assert body["pagination"]["totalAvailableItems"] == 0


def test_the_standard_list_can_be_sorted_and_filtered(client):
    ascending = client.get(PUBLIC, headers=CAMDEN, params={
        "sortBy": "publishedAt", "orderBy": "asc"}).json()["data"]
    assert len(ascending) == 3
    by_received = client.get(PUBLIC, headers=CAMDEN, params={"sortBy": "receivedAt"})
    assert by_received.status_code == 200

    one = client.get(PUBLIC, headers=CAMDEN, params={"reference": REFERENCE}).json()
    assert [item["data"]["application"]["reference"] for item in one["data"]] == [REFERENCE]
    assert one["pagination"]["totalResults"] == 1
    assert one["pagination"]["totalAvailableItems"] == 3


def test_an_unknown_sort_is_refused(client):
    assert client.get(PUBLIC, headers=CAMDEN, params={"sortBy": "nonsense"}).status_code == 422


def test_unapproved_records_are_only_in_the_unredacted_list(client):
    connection = api_common._connection()
    gold.unapprove(connection, "camden", [REFERENCE], "setup")

    public = client.get(PUBLIC, headers=CAMDEN).json()["pagination"]
    assert public["totalResults"] == 2
    assert client.get(f"{PUBLIC}/{REFERENCE}", headers=CAMDEN).status_code == 404

    everything = client.get(UNREDACTED, headers=CAMDEN).json()
    assert everything["pagination"]["totalResults"] == 3
    assert client.get(f"{UNREDACTED}/{REFERENCE}", headers=CAMDEN).status_code == 200


def test_a_missing_application_is_a_404_in_the_same_shape(client):
    body = client.get(f"{PUBLIC}/NOPE", headers=CAMDEN).json()
    assert body["data"] is None
    assert body["status"]["code"] == 404


# ---- documents and comments

BODY = {
    "sentiment": "supportive",
    "author": {"name": {"singleLine": "A Resident"},
               "address": {"line1": "2 Road", "town": "Town", "postcode": "AA1 1AA"}},
    "comment": [{"topic": "design", "question": "Q", "comment": "Looks good"}],
}


@pytest.fixture
def attached(client):
    connection = api_common._connection()
    items.put(connection, "camden", REFERENCE, items.PUBLIC_COMMENTS, COMMENT)
    items.put(connection, "camden", REFERENCE, items.DOCUMENTS, DOCUMENT)
    items.put(connection, "camden", REFERENCE, items.SPECIALIST_COMMENTS, SPECIALIST)
    return client


def test_public_comments_come_redacted_with_a_summary(attached):
    body = attached.get(f"{PUBLIC}/{REFERENCE}/publicComments", headers=CAMDEN).json()
    assert body["data"]["summary"]["totalComments"] == 1
    comment = body["data"]["comments"][0]
    assert "comment" not in comment
    assert comment["commentRedacted"]
    assert body["pagination"]["totalResults"] == 1


def test_unredacted_comments_keep_the_comment(attached):
    body = attached.get(f"{UNREDACTED}/{REFERENCE}/publicComments", headers=CAMDEN).json()
    assert "comment" in body["data"]["comments"][0]


def test_a_comment_can_be_fetched_on_its_own(attached):
    body = attached.get(f"{PUBLIC}/{REFERENCE}/publicComments/1", headers=CAMDEN).json()
    assert body["data"]["id"] == "1"
    assert attached.get(f"{PUBLIC}/{REFERENCE}/publicComments/99", headers=CAMDEN).status_code == 404


def test_public_comments_can_be_filtered(attached):
    path = f"{PUBLIC}/{REFERENCE}/publicComments"
    assert attached.get(path, headers=CAMDEN, params={"sentiment": "objection"}).json()[
        "pagination"]["totalResults"] == 1
    assert attached.get(path, headers=CAMDEN, params={"sentiment": "supportive"}).json()[
        "pagination"]["totalResults"] == 0
    assert attached.get(path, headers=CAMDEN, params={"topic": "noise"}).json()[
        "pagination"]["totalResults"] == 1


def test_a_malformed_comment_is_refused(attached):
    response = attached.post(f"{PUBLIC}/{REFERENCE}/publicComments",
                             json={"sentiment": "shouting"}, headers=CAMDEN)
    assert response.status_code == 422
    assert response.json()["data"] is None


def test_documents_hide_the_private_url_from_the_public(attached):
    public = attached.get(f"{PUBLIC}/{REFERENCE}/documents", headers=CAMDEN).json()["data"]
    assert "url" not in public[0]
    private = attached.get(f"{UNREDACTED}/{REFERENCE}/documents/1", headers=CAMDEN).json()["data"]
    assert private["url"] == DOCUMENT["url"]


def test_specialists_are_listed_with_a_summary_and_fetched_singly(attached):
    body = attached.get(f"{PUBLIC}/{REFERENCE}/specialistComments", headers=CAMDEN).json()
    assert body["data"]["summary"]["totalConsulted"] == 1
    single = attached.get(f"{PUBLIC}/{REFERENCE}/specialistComments/1", headers=CAMDEN).json()
    assert single["data"]["id"] == "1"
    assert all("comment" not in c for c in single["data"]["comments"])


def test_nothing_hangs_off_an_application_the_public_cannot_see(attached):
    gold.unapprove(api_common._connection(), "camden", [REFERENCE], "setup")
    assert attached.get(f"{PUBLIC}/{REFERENCE}/documents", headers=CAMDEN).status_code == 404
    assert attached.get(f"{UNREDACTED}/{REFERENCE}/documents", headers=CAMDEN).status_code == 200


def test_a_comment_sent_in_waits_until_it_is_published(attached):
    path = f"{PUBLIC}/{REFERENCE}/publicComments"
    sent = attached.post(path, json=BODY, headers=CAMDEN)
    assert sent.status_code == 200
    assert sent.json()["data"] is None

    assert attached.get(path, headers=CAMDEN).json()["pagination"]["totalResults"] == 1
    held = attached.get(f"{UNREDACTED}/{REFERENCE}/publicComments", headers=CAMDEN).json()
    assert held["pagination"]["totalResults"] == 2

    items.publish_comment(api_common._connection(), "camden", REFERENCE, "2")
    assert attached.get(path, headers=CAMDEN).json()["pagination"]["totalResults"] == 2


def test_the_api_is_only_the_odp_routes(client):
    paths = client.get("/openapi.json").json()["paths"]
    assert paths and all(path.startswith("/api/@next") for path in paths)
    tags = {tag for path in paths.values() for op in path.values() for tag in op["tags"]}
    assert tags == {"ODP public", "ODP unredacted"}


def test_the_list_is_paged_and_can_be_searched(client):
    body = client.get(PUBLIC, headers=CAMDEN, params={"resultsPerPage": 2, "page": 2}).json()
    assert body["pagination"]["currentPage"] == 2
    assert body["pagination"]["totalPages"] == 2
    assert len(body["data"]) == 1
    none = client.get(PUBLIC, headers=CAMDEN, params={"query": "zzzz-no-match"}).json()
    assert none["pagination"]["totalResults"] == 0
    assert none["pagination"]["totalAvailableItems"] == 3


def test_errors_use_the_envelope(client):
    response = client.get(f"{PUBLIC}/NOPE", headers=CAMDEN)
    assert response.status_code == 404
    body = response.json()
    assert body["data"] is None and body["status"]["code"] == 404


def test_the_public_side_has_no_pipeline_metadata(client):
    public = client.get(f"{PUBLIC}/{REFERENCE}", headers=CAMDEN).json()["data"]
    assert "pipeline" not in public["metadata"]
    listed = client.get(PUBLIC, headers=CAMDEN).json()["data"]
    assert all("pipeline" not in item.get("metadata", {}) for item in listed)


def test_the_unredacted_side_carries_what_the_admin_knows_in_metadata(client):
    record = client.get(f"{UNREDACTED}/{REFERENCE}", headers=CAMDEN).json()["data"]
    pipeline = record["metadata"]["pipeline"]
    assert pipeline["council"] == "camden"
    assert pipeline["approved"] is True and pipeline["edited"] is False
    assert pipeline["flagged"] is False
    assert {issue["field"] for issue in pipeline["issues"]} >= {"submission"}
    listed = client.get(UNREDACTED, headers=CAMDEN).json()["data"]
    assert all("pipeline" in item["metadata"] for item in listed if "metadata" in item)
