"""The published layer, and the only place records are edited.

Agreed with the team:

  * silver stays exactly as the council sent it and is never edited
  * gold starts as a copy of silver, and every edit happens there
  * re-running the pipeline refreshes silver without wiping anyone's edits

So publishing copies across records that are not in gold yet, and leaves edited ones alone. A
record that has never been touched can be refreshed from silver, because nothing is lost by doing
so. Every change is written to gold.edits, so the difference from what the council sent can always
be shown.
"""

from __future__ import annotations

import datetime as dt
import json


def publish(connection, council: str | None = None, refresh_unedited: bool = True) -> dict:
    """Copy silver into gold. Returns what happened, by count."""
    now = dt.datetime.now(dt.timezone.utc)
    where = "WHERE council = ?" if council else ""
    params = [council] if council else []

    rows = connection.execute(
        f"SELECT council, reference, record FROM silver.applications {where}", params
    ).fetchall()

    added = refreshed = untouched = 0
    for council_name, reference, record in rows:
        existing = connection.execute(
            "SELECT edited FROM gold.applications WHERE council = ? AND reference = ?",
            [council_name, reference],
        ).fetchone()

        if existing is None:
            connection.execute(
                """
                INSERT INTO gold.applications
                    (council, reference, published_at, edited, record)
                VALUES (?, ?, ?, false, ?)
                """,
                [council_name, reference, now, record],
            )
            added += 1
        elif existing[0]:
            # Edited here, so silver must not overwrite it.
            untouched += 1
        elif refresh_unedited:
            connection.execute(
                """
                UPDATE gold.applications SET record = ?, published_at = ?
                WHERE council = ? AND reference = ?
                """,
                [record, now, council_name, reference],
            )
            refreshed += 1
        else:
            untouched += 1

    return {"added": added, "refreshed": refreshed, "left alone": untouched}


def get(connection, council: str, reference: str) -> dict | None:
    row = connection.execute(
        "SELECT record FROM gold.applications WHERE council = ? AND reference = ?",
        [council, reference],
    ).fetchone()
    return json.loads(row[0]) if row else None


def update(connection, council: str, reference: str, record: dict, edited_by: str) -> bool:
    """Replace a record in gold and mark it as edited. False if it is not there."""
    before = get(connection, council, reference)
    if before is None:
        return False

    now = dt.datetime.now(dt.timezone.utc)
    connection.execute(
        """
        UPDATE gold.applications
        SET record = ?, updated_at = ?, updated_by = ?, edited = true
        WHERE council = ? AND reference = ?
        """,
        [json.dumps(record, ensure_ascii=False), now, edited_by, council, reference],
    )
    _log(connection, council, reference, "update", edited_by, now, before, record)
    return True


def create(connection, council: str, reference: str, record: dict, edited_by: str) -> bool:
    """Add a record that did not come from a council. False if the reference is taken."""
    if get(connection, council, reference) is not None:
        return False

    now = dt.datetime.now(dt.timezone.utc)
    connection.execute(
        """
        INSERT INTO gold.applications
            (council, reference, published_at, updated_at, updated_by, edited, record)
        VALUES (?, ?, ?, ?, ?, true, ?)
        """,
        [council, reference, now, now, edited_by, json.dumps(record, ensure_ascii=False)],
    )
    _log(connection, council, reference, "create", edited_by, now, None, record)
    return True


def delete(connection, council: str, reference: str, edited_by: str) -> bool:
    """Remove a record from the published layer. It stays in silver and bronze."""
    before = get(connection, council, reference)
    if before is None:
        return False

    now = dt.datetime.now(dt.timezone.utc)
    connection.execute(
        "DELETE FROM gold.applications WHERE council = ? AND reference = ?", [council, reference]
    )
    _log(connection, council, reference, "delete", edited_by, now, before, None)
    return True


def history(connection, council: str, reference: str) -> list[dict]:
    rows = connection.execute(
        """
        SELECT action, edited_by, edited_at FROM gold.edits
        WHERE council = ? AND reference = ? ORDER BY edited_at
        """,
        [council, reference],
    ).fetchall()
    return [{"action": a, "by": b, "at": c.isoformat()} for a, b, c in rows]


def _log(connection, council, reference, action, edited_by, at, before, after) -> None:
    connection.execute(
        """
        INSERT INTO gold.edits (council, reference, action, edited_by, edited_at, before, after)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [
            council,
            reference,
            action,
            edited_by,
            at,
            json.dumps(before, ensure_ascii=False) if before is not None else None,
            json.dumps(after, ensure_ascii=False) if after is not None else None,
        ],
    )
