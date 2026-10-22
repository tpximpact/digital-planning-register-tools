"""What the ODP endpoints lean on: the database, listing records, and the pipeline metadata."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import HTTPException

from . import config, db, extension, gold
from .api_responses import envelope

STATIC = Path(__file__).parent / "static"

#: What a list can be ordered by, which is the standard's sortBy. receivedAt lives inside the
#: record rather than in a column.
SORT_COLUMNS = {
    "publishedAt": "g.published_at",
    "receivedAt": "json_extract_string(g.record, '$.data.validation.receivedAt')",
}

FROM = "gold.applications g LEFT JOIN silver.applications s USING (council, reference)"


def _connection():
    return db.connect(config.load().database_path)


def _like(text: str) -> str:
    """Search text as a contains pattern, with the wildcard characters taken literally."""
    escaped = text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def _with_pipeline(connection, council: str, rows: list[tuple]) -> list[dict]:
    """Records with metadata.pipeline added, for the unredacted side only.

    rows are (reference, record, approved, approved_at, approved_by, edited, updated_at,
    updated_by, source_status).
    """
    references = [row[0] for row in rows]
    issues: dict[str, list[tuple[str, str]]] = {}
    if references:
        marks = ", ".join("?" for _ in references)
        for reference, field, reason in connection.execute(
            f"SELECT reference, field, reason FROM silver.mapping_issues "
            f"WHERE council = ? AND reference IN ({marks})", [council, *references]
        ).fetchall():
            issues.setdefault(reference, []).append((field, reason))

    records = []
    for (reference, raw, approved, approved_at, approved_by, edited, updated_at, updated_by,
         status) in rows:
        record = json.loads(raw) if isinstance(raw, str) else raw
        found = issues.get(reference, [])
        record.setdefault("metadata", {})["pipeline"] = extension.pipeline_metadata(
            council=council, approved=approved, approved_at=approved_at, approved_by=approved_by,
            edited=edited, updated_at=updated_at, updated_by=updated_by,
            flagged=any(field not in gold.KNOWN_LIMITS for field, _ in found), issues=found,
            source_status=status)
        records.append(record)
    return records


def _listing(council: str, page: int, size: int, sort: str, order: str,
             approved_only: bool = False, query: str | None = None,
             reference: str | None = None) -> dict:
    """One page of applications, in the standard's ApiResponse shape.

    The scope is this caller's council (and approved records only, on the public side).
    totalAvailableItems counts the scope and totalResults counts what is left after query and
    reference, which is what lets a client say "12 of 4,000".
    """
    if sort not in SORT_COLUMNS:
        raise HTTPException(400, f"Cannot sort by {sort}")

    connection = _connection()
    scope = ["g.council = ?"]
    params: list[Any] = [council]
    if approved_only:
        # Nothing is public until somebody has approved it.
        scope.append("g.approved = true")

    filters: list[str] = []
    filter_params: list[Any] = []
    if reference:
        filters.append("g.reference = ?")
        filter_params.append(reference)
    if query:
        pattern = _like(query)
        filters.append("(g.reference ILIKE ? ESCAPE '\\' OR s.address ILIKE ? ESCAPE '\\'"
                       " OR s.description ILIKE ? ESCAPE '\\')")
        filter_params.extend([pattern, pattern, pattern])

    def where(parts: list[str]) -> str:
        return "WHERE " + " AND ".join(parts)

    available = connection.execute(
        f"SELECT count(*) FROM {FROM} {where(scope)}", params).fetchone()[0]
    total = connection.execute(
        f"SELECT count(*) FROM {FROM} {where(scope + filters)}",
        params + filter_params).fetchone()[0]

    direction = "ASC" if order == "asc" else "DESC"
    rows = connection.execute(
        f"""
        SELECT g.reference, g.record, g.approved, g.approved_at, g.approved_by, g.edited,
               g.updated_at, g.updated_by, s.status
        FROM {FROM}
        {where(scope + filters)}
        ORDER BY {SORT_COLUMNS[sort]} {direction}, g.reference ASC
        LIMIT ? OFFSET ?
        """,
        params + filter_params + [size, (page - 1) * size],
    ).fetchall()

    if approved_only:
        applications = [json.loads(row[1]) for row in rows]
    else:
        applications = _with_pipeline(connection, council, rows)

    return envelope(applications, {
        "resultsPerPage": size,
        "currentPage": page,
        "totalPages": (total + size - 1) // size,
        "totalResults": total,
        "totalAvailableItems": available,
    })


def _exists(council: str, reference: str, approved_only: bool) -> None:
    """404 unless the application is there, and approved when the caller is the public."""
    row = _connection().execute(
        "SELECT approved FROM gold.applications WHERE council = ? AND reference = ?",
        [council, reference],
    ).fetchone()
    if row is None or (approved_only and not row[0]):
        # An unapproved record is not public, so it is not here as far as anyone outside is
        # concerned.
        raise HTTPException(404, f"No application {reference} for {council}")


def _one(council: str, reference: str, approved_only: bool) -> dict:
    """A single record in an ApiResponse, or a 404 in the same shape."""
    _exists(council, reference, approved_only)
    connection = _connection()
    if approved_only:
        return envelope(gold.get(connection, council, reference))
    row = connection.execute(
        """
        SELECT g.reference, g.record, g.approved, g.approved_at, g.approved_by, g.edited,
               g.updated_at, g.updated_by, s.status
        FROM gold.applications g LEFT JOIN silver.applications s USING (council, reference)
        WHERE g.council = ? AND g.reference = ?
        """, [council, reference]).fetchone()
    return envelope(_with_pipeline(connection, council, [row])[0])
