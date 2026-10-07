"""Camden, into bronze.

Camden publishes planning applications on an open data platform called Socrata. The API is public,
needs no key and is updated daily, which is why Camden is the first council in the pipeline.

Each page is written to storage as it arrives, so there is always a copy of exactly what the API
returned, and then loaded into the bronze table.
"""

from __future__ import annotations

import datetime as dt
from typing import Iterator

import requests

from ..config import SourceConfig
from ..storage import Storage

COUNCIL = "camden"
REFERENCE_FIELD = "application_number"
TIMEOUT_SECONDS = 60


def fetch_pages(source: SourceConfig, session: requests.Session | None = None) -> Iterator[list[dict]]:
    """Pull the dataset a page at a time, oldest first, stopping when the API runs out."""
    session = session or requests.Session()
    headers = {"X-App-Token": source.app_token} if source.app_token else {}

    offset = 0
    pulled = 0
    while True:
        remaining = None
        if source.max_records:
            remaining = source.max_records - pulled
            if remaining <= 0:
                return

        limit = source.page_size if remaining is None else min(source.page_size, remaining)
        params = {"$limit": limit, "$offset": offset, "$order": REFERENCE_FIELD}

        response = session.get(source.url, params=params, headers=headers, timeout=TIMEOUT_SECONDS)
        response.raise_for_status()
        page = response.json()

        if not page:
            return

        yield page

        pulled += len(page)
        offset += len(page)
        if len(page) < limit:
            return


def ingest(connection, source: SourceConfig, storage: Storage,
           session: requests.Session | None = None) -> int:
    """Pull Camden into bronze and return how many records were written."""
    pulled_at = dt.datetime.now(dt.timezone.utc)
    stamp = pulled_at.strftime("%Y%m%dT%H%M%SZ")
    written = 0

    for number, page in enumerate(fetch_pages(source, session=session), start=1):
        storage.write_json(f"{COUNCIL}/{stamp}/page-{number:05d}.json", page)

        rows = [
            (
                COUNCIL,
                str(record.get(REFERENCE_FIELD, "")).strip(),
                pulled_at,
                source.url,
                record,
            )
            for record in page
            if str(record.get(REFERENCE_FIELD, "")).strip()
        ]
        if not rows:
            continue

        # Re-running should refresh a record rather than fail on the primary key.
        connection.executemany(
            """
            INSERT INTO bronze.applications (council, reference, pulled_at, source_url, record)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (council, reference) DO UPDATE SET
                pulled_at = excluded.pulled_at,
                source_url = excluded.source_url,
                record = excluded.record
            """,
            [(c, r, t, u, _as_json(rec)) for c, r, t, u, rec in rows],
        )
        written += len(rows)

    return written


def _as_json(record: dict) -> str:
    import json

    return json.dumps(record, ensure_ascii=False)
