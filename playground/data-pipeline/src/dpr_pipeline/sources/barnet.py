"""Barnet, into bronze, from a CSV export of their Uniform database.

Agreed on 22 September: a council exports one CSV per table from whatever tool they already have,
and the pipeline reads that. An Oracle dump was considered and set aside, because only Oracle can
load one back, which would force a licence on the next council.

Bronze keeps their table and column names, so it is still like for like with their database.

Barnet's own records cannot be used yet: they have no approval to share them and there is no
contract. Until that changes this runs against made up rows in the right shape, from
scripts/make_fake_uniform.py. Only the data changes when a real export is allowed.
"""

from __future__ import annotations

import csv
import datetime as dt
import io
import json

from ..config import SourceConfig
from ..storage import Storage

COUNCIL = "barnet"
KEY = "KEYVAL"
REFERENCE_FIELD = "REFVAL"
MAIN_TABLE = "APPLICATIONS"


def read_tables(export: Storage) -> dict[str, list[dict]]:
    """Every CSV in the export folder, keyed by table name, columns untouched."""
    tables: dict[str, list[dict]] = {}
    for path in export.list("*.csv"):
        name = path.replace("\\", "/").rsplit("/", 1)[-1].rsplit(".", 1)[0].upper()
        with export.fs.open(path, "r") as handle:
            text = handle.read()
        if isinstance(text, bytes):
            text = text.decode("utf-8")
        tables[name] = list(csv.DictReader(io.StringIO(text)))
    return tables


def ingest(connection, source: SourceConfig, storage: Storage, session=None) -> int:
    """Load the export into bronze, one row per application, tables joined on their key."""
    export = Storage(source.url)
    tables = read_tables(export)

    if MAIN_TABLE not in tables:
        raise SystemExit(
            f"No {MAIN_TABLE}.csv in {source.url}. Expected one CSV per table from the export."
        )

    # Everything that is not the main table is keyed by KEYVAL and attached to its application.
    extras: dict[str, dict[str, dict]] = {
        name: {row.get(KEY, ""): row for row in rows}
        for name, rows in tables.items()
        if name != MAIN_TABLE
    }

    pulled_at = dt.datetime.now(dt.timezone.utc)
    stamp = pulled_at.strftime("%Y%m%dT%H%M%SZ")
    rows = []

    for application in tables[MAIN_TABLE]:
        reference = (application.get(REFERENCE_FIELD) or "").strip()
        if not reference:
            continue

        key = application.get(KEY, "")
        record = {MAIN_TABLE: application}
        for name, by_key in extras.items():
            if key in by_key:
                record[name] = by_key[key]

        rows.append((COUNCIL, reference, pulled_at, source.url,
                     json.dumps(record, ensure_ascii=False)))

    storage.write_json(f"{COUNCIL}/{stamp}/tables.json", tables)

    if rows:
        connection.executemany(
            """
            INSERT INTO bronze.applications (council, reference, pulled_at, source_url, record)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (council, reference) DO UPDATE SET
                pulled_at = excluded.pulled_at,
                source_url = excluded.source_url,
                record = excluded.record
            """,
            rows,
        )

    return len(rows)
