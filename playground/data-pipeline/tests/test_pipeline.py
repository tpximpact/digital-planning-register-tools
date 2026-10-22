"""End to end on a fake API, so the test needs no network."""

import json

from dpr_pipeline import db, validate
from dpr_pipeline.config import SourceConfig
from dpr_pipeline.mappers import camden as camden_mapper
from dpr_pipeline.sources import camden as camden_source
from dpr_pipeline.storage import Storage

from .test_camden_mapper import SAMPLE


class FakeResponse:
    def __init__(self, payload):
        self._payload = payload

    def raise_for_status(self):
        pass

    def json(self):
        return self._payload


class FakeSession:
    """Returns one page, then an empty one."""

    def __init__(self, page):
        self.page = page
        self.calls = 0

    def get(self, url, params=None, headers=None, timeout=None):
        self.calls += 1
        return FakeResponse(self.page if self.calls == 1 else [])


def test_bronze_to_silver(tmp_path):
    connection = db.connect(str(tmp_path / "test.duckdb"))
    storage = Storage(str(tmp_path / "bronze"))
    source = SourceConfig(name="camden", url="http://example.test/data.json", page_size=2)

    written = camden_source.ingest(connection, source, storage, session=FakeSession([SAMPLE]))
    assert written == 1

    # The raw page is kept on disk as well as in the database.
    assert storage.list("camden/*/page-*.json")

    mapped, issues = camden_mapper.map_all(connection)
    assert mapped == 1
    assert issues > 0

    row = connection.execute(
        "SELECT reference, application_type, record FROM silver.applications"
    ).fetchone()
    assert row[0] == "2018/2267/P"
    assert row[1] == "pp.full.minor"
    assert json.loads(row[2])["data"]["application"]["status"] == "determined"

    assert validate.basic_checks(connection) == []


def test_ingest_twice_does_not_duplicate(tmp_path):
    connection = db.connect(str(tmp_path / "test.duckdb"))
    storage = Storage(str(tmp_path / "bronze"))
    source = SourceConfig(name="camden", url="http://example.test/data.json", page_size=2)

    camden_source.ingest(connection, source, storage, session=FakeSession([SAMPLE]))
    camden_source.ingest(connection, source, storage, session=FakeSession([SAMPLE]))

    count = connection.execute("SELECT count(*) FROM bronze.applications").fetchone()[0]
    assert count == 1
