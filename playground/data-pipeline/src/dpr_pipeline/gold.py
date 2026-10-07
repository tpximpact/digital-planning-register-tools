"""The published layer, and the only place records are edited.

Agreed with the team:

  * silver stays exactly as the council sent it and is never edited
  * gold starts as a copy of silver, and every edit happens there
  * re-running the pipeline refreshes silver without wiping anyone's edits

Records arrive in gold unapproved. Nothing is public until somebody approves it, and approval is
done in bulk, because a council with tens of thousands of historic records cannot read them one at
a time. The pipeline already records every gap it found per record, so the clean ones can be
approved together and only the flagged ones need a look.

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


#: Gaps that every record has, because of what legacy data is, not because of this record.
#: They are recorded so the limits stay visible, but they are not a reason to hold a record back:
#: no amount of reviewing will produce a PlanX submission for a 2010 application.
KNOWN_LIMITS = ("submission", "boundary", "location", "system_status")


def _blocking_clause(alias: str = "i") -> str:
    """Only gaps specific to a record should stop it being approved."""
    fields = ", ".join(f"'{field}'" for field in KNOWN_LIMITS)
    return f"{alias}.field NOT IN ({fields})"


def approve(connection, council: str, references: list[str], approved_by: str) -> int:
    """Approve named records so they become public. Returns how many changed."""
    if not references:
        return 0

    now = dt.datetime.now(dt.timezone.utc)
    changed = 0
    for reference in references:
        row = connection.execute(
            "SELECT approved FROM gold.applications WHERE council = ? AND reference = ?",
            [council, reference],
        ).fetchone()
        if row is None or row[0]:
            continue
        connection.execute(
            """
            UPDATE gold.applications
            SET approved = true, approved_at = ?, approved_by = ?
            WHERE council = ? AND reference = ?
            """,
            [now, approved_by, council, reference],
        )
        _log(connection, council, reference, "approve", approved_by, now, None, None)
        changed += 1

    return changed


def unapprove(connection, council: str, references: list[str], approved_by: str) -> int:
    """Take records back out of public view without deleting them."""
    if not references:
        return 0

    now = dt.datetime.now(dt.timezone.utc)
    changed = 0
    for reference in references:
        row = connection.execute(
            "SELECT approved FROM gold.applications WHERE council = ? AND reference = ?",
            [council, reference],
        ).fetchone()
        if row is None or not row[0]:
            continue
        connection.execute(
            """
            UPDATE gold.applications
            SET approved = false, approved_at = NULL, approved_by = NULL
            WHERE council = ? AND reference = ?
            """,
            [council, reference],
        )
        _log(connection, council, reference, "unapprove", approved_by, now, None, None)
        changed += 1

    return changed


def clean_references(connection, council: str | None = None) -> list[tuple[str, str]]:
    """Records with nothing flagged against them, so nothing needs reading before approval."""
    where = "WHERE g.council = ?" if council else ""
    params = [council] if council else []
    blocking = _blocking_clause()
    rows = connection.execute(
        f"""
        SELECT g.council, g.reference
        FROM gold.applications g
        {where}
        {"AND" if where else "WHERE"} g.approved = false
          AND NOT EXISTS (
            SELECT 1 FROM silver.mapping_issues i
            WHERE i.council = g.council AND i.reference = g.reference
              AND {blocking}
          )
        ORDER BY g.reference
        """,
        params,
    ).fetchall()
    return [(council_name, reference) for council_name, reference in rows]


def flagged_counts(connection, council: str | None = None) -> dict:
    """How the work splits: clean, flagged, already approved."""
    where = "WHERE g.council = ?" if council else ""
    params = [council] if council else []
    blocking = _blocking_clause()
    row = connection.execute(
        f"""
        SELECT
            count(*) FILTER (WHERE g.approved) AS approved,
            count(*) FILTER (
                WHERE NOT g.approved AND NOT EXISTS (
                    SELECT 1 FROM silver.mapping_issues i
                    WHERE i.council = g.council AND i.reference = g.reference
                      AND {blocking})
            ) AS clean,
            count(*) FILTER (
                WHERE NOT g.approved AND EXISTS (
                    SELECT 1 FROM silver.mapping_issues i
                    WHERE i.council = g.council AND i.reference = g.reference
                      AND {blocking})
            ) AS flagged
        FROM gold.applications g
        {where}
        """,
        params,
    ).fetchone()
    return {"approved": row[0], "clean": row[1], "flagged": row[2]}


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
