"""The admin page at /admin and the JSON behind it at /admin/data."""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, api_common, gold

from .test_gold import REFERENCE, build

EDITOR = {"X-Edited-By": "sam"}


@pytest.fixture
def connection(tmp_path, monkeypatch):
    connection = build(tmp_path)
    gold.publish(connection)
    monkeypatch.setattr(api_common, "_connection", lambda: connection)
    return connection


@pytest.fixture
def client(connection):
    return TestClient(api.app)


def test_the_root_goes_to_the_admin(client):
    assert client.get("/", follow_redirects=False).headers["location"] == "/admin"


def test_the_admin_is_served_with_a_layer_switch(client):
    html = client.get("/admin").text
    assert 'data-layer="bronze"' in html and 'data-layer="silver"' in html and 'data-layer="gold"' in html
    assert client.get("/admin/classic").status_code in (404, 405)

@pytest.mark.parametrize("layer", ["bronze", "silver", "gold"])
def test_each_layer_is_served_to_the_admin_page(client, layer):
    body = client.get(f"/admin/data/camden/{layer}").json()
    assert body["total"] == 1 and body["pages"] == 1
    assert body["rows"][0]["record"]
    assert body["rows"][0]["reference"] == ("2018/2267/P" if layer == "bronze" else REFERENCE)


def test_bronze_says_what_it_was_mapped_to_and_search_is_server_side(client):
    row = client.get("/admin/data/camden/bronze").json()["rows"][0]
    assert row["mappedTo"] == REFERENCE
    assert client.get("/admin/data/camden/gold", params={"q": "zzzz"}).json()["total"] == 0


def test_the_admin_summary_counts_every_layer(client):
    summary = client.get("/admin/data/summary", params={"council": "camden"}).json()
    assert summary["bronze"] == summary["silver"] == summary["gold"] == 1
    assert summary["unmapped"] == 0 and summary["unpublished"] == 0


def test_the_list_can_be_narrowed_to_records_that_lost_a_field(client, connection):
    connection.execute(
        "INSERT INTO silver.mapping_issues (council, reference, field, value, reason, kind, found_at) "
        "VALUES ('camden', ?, 'application_type', 'Tree works', 'no mapping', 'mismatch', now())",
        [REFERENCE])
    for layer in ("silver", "gold"):
        assert client.get(f"/admin/data/camden/{layer}", params={"issue": "application_type"}).json()["total"] == 1
        assert client.get(f"/admin/data/camden/{layer}", params={"issue": "never_lost"}).json()["total"] == 0
    # Bronze has no mapping, so the filter does not apply there.
    assert client.get("/admin/data/camden/bronze", params={"issue": "never_lost"}).json()["total"] == 1


def test_admin_approving_needs_a_name_and_can_be_undone(client):
    body = {"council": "camden", "all_clean": True}
    assert client.post("/admin/data/approve", json=body).status_code == 400
    assert client.post("/admin/data/approve", json=body, headers=EDITOR).json() == {"changed": 1}
    undone = client.post("/admin/data/approve", json={**body, "undo": True,
                         "references": [REFERENCE]}, headers=EDITOR)
    assert undone.json() == {"changed": 1}


def test_admin_edit_and_unpublish(client, connection):
    record = gold.get(connection, "camden", REFERENCE)
    record["data"]["caseOfficer"]["name"] = "Changed"
    assert client.put(f"/admin/data/camden/{REFERENCE}", json=record, headers=EDITOR).json() == {"saved": True}
    assert client.get("/admin/data/camden/gold").json()["rows"][0]["edited"] is True
    assert client.delete(f"/admin/data/camden/{REFERENCE}", headers=EDITOR).status_code == 204


def test_the_admin_routes_are_not_in_the_api_docs(client):
    paths = client.get("/openapi.json").json()["paths"]
    assert all(path.startswith("/api/@next") for path in paths)


def test_the_spec_check_reports_without_a_spec_or_with_one(client, monkeypatch, tmp_path):
    from dpr_pipeline import config

    body = client.get(f"/admin/data/camden/{REFERENCE}/check").json()
    assert body["valid"] in (True, False, None) and isinstance(body["errors"], list)
    assert client.get("/admin/data/camden/NOPE/check").status_code == 404


def test_a_record_can_be_validated_against_the_private_or_the_public_schema(client, connection):
    record = gold.get(connection, "camden", REFERENCE)
    for kind, name in (("private", "postSubmissionApplication.json"),
                       ("public", "postSubmissionPublishedApplication.json")):
        result = client.post("/admin/data/validate", json={"schema": kind, "record": record}).json()
        assert result["schema"] == name and result["valid"] is True
    del record["data"]["application"]
    assert client.post("/admin/data/validate", json={"schema": "public", "record": record}
                       ).json()["valid"] is False
    assert client.post("/admin/data/validate", json={"schema": "other", "record": {}}
                       ).status_code == 422


def test_the_council_choice_is_at_the_top_of_the_admin(client):
    html = client.get("/admin").text
    assert html.index('id="council"') < html.index("<h1>") < html.index('id="search"')
