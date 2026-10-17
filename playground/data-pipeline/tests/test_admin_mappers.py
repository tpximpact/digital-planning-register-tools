"""The value mappers page at /admin/mappers and the JSON behind it."""

import pytest
from fastapi.testclient import TestClient

from dpr_pipeline import admin_mappers, api, config
from dpr_pipeline.value_maps import fetch

from .test_value_maps import DOMAIN, IDOX_PAGE, library  # noqa: F401  (a fixture)

BASE = "/admin/mappers/data"


@pytest.fixture
def client(library, monkeypatch):  # noqa: F811
    monkeypatch.setattr(admin_mappers, "_library", lambda: library)
    return TestClient(api.app)


def test_the_page_and_the_shared_styles_are_served(client):
    page = client.get("/admin/mappers")
    assert page.status_code == 200 and "Value mappers" in page.text
    assert client.get("/admin/admin.css").headers["content-type"].startswith("text/css")
    assert "/admin/admin.css" in client.get("/admin").text
    assert "/admin/mappers" in client.get("/admin").text


def test_the_overview_lists_every_table_with_its_progress(client):
    body = client.get(f"{BASE}/tables").json()
    tables = {t["id"]: t for t in body["tables"]}
    assert tables["application-types"]["unmapped"] == 1 and tables["application-types"]["invalid"] == 2
    assert tables[f"idox/{DOMAIN}/caseType"]["required"] is False


def test_one_table_comes_with_its_rows_and_the_values_the_standard_accepts(client):
    body = client.get(f"{BASE}/table", params={"id": "application-types"}).json()
    assert body["targets"] == ["advertConsent", "ldc.existing", "ldc.proposed"]
    assert {r["value"] for r in body["rows"]} >= {"advertising", "change-of-use", "retired"}
    assert client.get(f"{BASE}/table", params={"id": "nope"}).status_code == 404


def test_saving_writes_the_csv_and_returns_the_new_state(client, library):  # noqa: F811
    body = client.put(f"{BASE}/table", params={"id": "application-types"}, json={"changes": [
        {"value": "change-of-use", "entries": [{"target": "ldc.existing", "notes": ""}]}]}).json()
    assert body["summary"]["unmapped"] == 0
    assert any(r["mhclg_type"] == "change-of-use" and r["odp_type"] == "ldc.existing"
               for r in library.read_rows(library.application_table()))


def test_saving_a_wrong_value_is_refused_and_nothing_changes(client, library):  # noqa: F811
    table = library.application_table()
    before = table.csv.read_text(encoding="utf-8")
    response = client.put(f"{BASE}/table", params={"id": "application-types"}, json={"changes": [
        {"value": "advertising", "entries": [{"target": "pp.full", "notes": ""}]}]})
    assert response.status_code == 422 and "pp.full" in response.json()["status"]["message"]
    assert table.csv.read_text(encoding="utf-8") == before


def test_refreshing_a_portal_adds_blank_rows(client, library, monkeypatch):  # noqa: F811
    library.urls_file.write_text(f"https://{DOMAIN}/online-applications/search.do?action=advanced\n",
                                 encoding="utf-8")
    monkeypatch.setattr(fetch, "fetch_page", lambda url, get=None: IDOX_PAGE)
    body = client.post(f"{BASE}/fetch", json={"id": f"idox/{DOMAIN}/status"}).json()
    assert "new values to map" in body["message"]
    assert body["summary"]["unmapped"] == 1


def test_a_failed_refresh_is_a_clear_error(client, library, monkeypatch):  # noqa: F811
    library.urls_file.write_text(f"https://{DOMAIN}/x\n", encoding="utf-8")
    monkeypatch.setattr(fetch, "fetch_page", lambda url, get=None: "<p>nothing</p>")
    response = client.post(f"{BASE}/fetch", json={"id": f"idox/{DOMAIN}/status"})
    assert response.status_code == 502 and "expected dropdowns" in response.json()["status"]["message"]


def test_adding_a_portal_refuses_addresses_inside_a_network(client):
    response = client.post(f"{BASE}/portals", json={"url": "http://127.0.0.1/online-applications"})
    assert response.status_code == 422


def test_adding_a_portal_starts_its_tables(client, library, monkeypatch):  # noqa: F811
    monkeypatch.setattr(fetch, "fetch_page", lambda url, get=None: IDOX_PAGE)
    body = client.post(f"{BASE}/portals",
                       json={"url": "https://new.example.gov.uk/online-applications/search.do"}).json()
    assert body["domain"] == "new.example.gov.uk"
    assert any(t["id"] == "idox/new.example.gov.uk/status" for t in body["tables"])


def test_the_routes_are_not_in_the_api_docs(client):
    paths = client.get("/openapi.json").json()["paths"]
    assert not any("mappers" in p for p in paths)


def test_the_mappers_folder_comes_from_the_config(monkeypatch, tmp_path):
    monkeypatch.delenv("DPR_MAPPERS", raising=False)
    assert config.load().mappers == "mappers"
    monkeypatch.setenv("DPR_MAPPERS", str(tmp_path))
    assert config.load().mappers == str(tmp_path)
