"""The endpoints an admin tool needs, on gold."""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import api, db, gold

from .test_gold import REFERENCE, build

EDITOR = {"X-Edited-By": "officer@camden.gov.uk"}


@pytest.fixture
def client(tmp_path, monkeypatch):
    connection = build(tmp_path)
    gold.publish(connection)
    for reference in ("2019/0001/P", "2020/0002/P"):
        gold.create(connection, "camden", reference, {"applicationType": "pp.full.minor"},
                    edited_by="setup")
    monkeypatch.setattr(api, "_connection", lambda: connection)
    return TestClient(api.app)


def test_list_is_paged(client):
    body = client.get("/private/applications", params={"size": 2, "page": 1}).json()
    assert body["total"] == 3
    assert body["pages"] == 2
    assert len(body["applications"]) == 2


def test_list_can_be_sorted(client):
    ascending = client.get("/private/applications", params={"sort": "reference", "order": "asc"}).json()
    descending = client.get("/private/applications", params={"sort": "reference", "order": "desc"}).json()
    first = ascending["applications"][0]["reference"]
    last = descending["applications"][0]["reference"]
    assert first != last
    assert first < last


def test_get_one_by_reference(client):
    response = client.get(f"/private/applications/camden/{REFERENCE}")
    assert response.status_code == 200
    assert response.json()["data"]["application"]["reference"] == REFERENCE


def test_missing_reference_is_a_404(client):
    assert client.get("/private/applications/camden/NOPE").status_code == 404


def test_update_records_who_made_the_change(client):
    record = client.get(f"/private/applications/camden/{REFERENCE}").json()
    record["data"]["caseOfficer"]["name"] = "Redacted"

    response = client.put(f"/private/applications/camden/{REFERENCE}", json=record, headers=EDITOR)
    assert response.status_code == 200

    history = client.get(f"/private/applications/camden/{REFERENCE}/history").json()
    assert history[-1]["by"] == "officer@camden.gov.uk"
    saved = client.get(f"/private/applications/camden/{REFERENCE}").json()
    assert saved["data"]["caseOfficer"]["name"] == "Redacted"


def test_an_edit_without_a_name_is_refused(client):
    record = client.get(f"/private/applications/camden/{REFERENCE}").json()
    assert client.put(f"/private/applications/camden/{REFERENCE}", json=record).status_code == 400


def test_create_and_delete(client):
    created = client.post("/private/applications/camden/NEW-1",
                          json={"applicationType": "pp.full.minor"}, headers=EDITOR)
    assert created.status_code == 201
    assert client.post("/private/applications/camden/NEW-1", json={}, headers=EDITOR).status_code == 409

    assert client.delete("/private/applications/camden/NEW-1", headers=EDITOR).status_code == 204
    assert client.get("/private/applications/camden/NEW-1").status_code == 404


def test_admin_screen_is_served(client):
    response = client.get("/admin")
    assert response.status_code == 200
    assert "Published applications" in response.text


def test_root_goes_to_the_admin_screen(client):
    assert client.get("/", follow_redirects=False).status_code == 307


def test_public_is_read_only(client):
    """The register reads this. Nothing here should be able to change a record."""
    record = client.get(f"/public/applications/camden/{REFERENCE}").json()
    assert record["data"]["application"]["reference"] == REFERENCE

    assert client.put(f"/public/applications/camden/{REFERENCE}", json=record,
                      headers=EDITOR).status_code == 405
    assert client.delete(f"/public/applications/camden/{REFERENCE}",
                         headers=EDITOR).status_code == 405
    assert client.post("/public/applications/camden/NEW-2", json={}, headers=EDITOR).status_code == 405


def test_public_does_not_say_who_edited_what(client):
    """Who touched a record is internal. The public feed carries the record, not the housekeeping."""
    item = client.get("/public/applications").json()["applications"][0]
    assert "edited" not in item
    assert "updatedAt" not in item

    private_item = client.get("/private/applications").json()["applications"][0]
    assert "edited" in private_item
    assert "updatedAt" in private_item


def test_public_has_no_history(client):
    assert client.get(f"/public/applications/camden/{REFERENCE}/history").status_code == 404


def test_both_sides_return_the_same_record(client):
    public_record = client.get(f"/public/applications/camden/{REFERENCE}").json()
    private_record = client.get(f"/private/applications/camden/{REFERENCE}").json()
    assert public_record == private_record


def test_private_list_carries_the_council_detail(client):
    """The standard has no place for an address, so an admin list needs it joined back on."""
    item = client.get("/private/applications", params={"council": "camden"}).json()[
        "applications"][0]
    assert "address" in item["detail"]
    assert "decision" in item["detail"]


def test_public_list_does_not(client):
    item = client.get("/public/applications").json()["applications"][0]
    assert "detail" not in item
