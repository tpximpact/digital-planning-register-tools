"""The data behind the classic admin page, at /admin/data.

These are the admin's own JSON routes. They are kept out of the OpenAPI docs on purpose, so the
documented API stays the standard's ODP endpoints and nothing else. They read all three layers
(the ODP API only serves gold) and make the changes the classic page offers.
"""

from __future__ import annotations

import json
from typing import Any, Literal

from fastapi import APIRouter, Body, Header, HTTPException, Query

from . import api_common, config, contract, gold, oddities, validate

router = APIRouter(prefix="/admin/data", include_in_schema=False)

LAYERS = ("bronze", "silver", "gold")
GOLD_SORT = {"reference": "g.reference", "published_at": "g.published_at",
             "updated_at": "g.updated_at"}


def _connection():
    return api_common._connection()


def _editor(name: str | None) -> str:
    if not name:
        raise HTTPException(400, "Send an X-Edited-By header so the change can be attributed.")
    return name


def _flagged(connection, council: str, reference: str) -> bool:
    """True if the mapper noted something specific to this record, beyond the known limits."""
    return bool(connection.execute(
        f"SELECT count(*) FROM silver.mapping_issues WHERE council = ? AND reference = ? "
        f"AND field NOT IN ({', '.join(repr(f) for f in gold.KNOWN_LIMITS)})",
        [council, reference]).fetchone()[0])


def _layer_counts(council: str) -> dict[str, int]:
    connection = _connection()

    def count(sql: str) -> int:
        return connection.execute(sql, [council]).fetchone()[0]

    return {
        "bronze": count("SELECT count(*) FROM bronze.applications WHERE council = ?"),
        "silver": count("SELECT count(*) FROM silver.applications WHERE council = ?"),
        "gold": count("SELECT count(*) FROM gold.applications WHERE council = ?"),
        "unmapped": count(
            """SELECT count(*) FROM bronze.applications b WHERE b.council = ? AND NOT EXISTS
               (SELECT 1 FROM silver.applications s
                WHERE s.council = b.council AND s.source_reference = b.reference)"""),
        "unpublished": count(
            """SELECT count(*) FROM silver.applications s WHERE s.council = ? AND NOT EXISTS
               (SELECT 1 FROM gold.applications g
                WHERE g.council = s.council AND g.reference = s.reference)"""),
    }


def _record(raw) -> Any:
    return json.loads(raw) if isinstance(raw, str) else raw


@router.get("/councils")
def councils() -> list[str]:
    return [row[0] for row in _connection().execute(
        """SELECT council FROM bronze.applications UNION SELECT council FROM silver.applications
           UNION SELECT council FROM gold.applications ORDER BY 1""").fetchall()]


@router.get("/summary")
def summary(council: str) -> dict:
    """Approval counts for gold, and how many records each layer holds."""
    connection = _connection()
    return {**gold.flagged_counts(connection, council), **_layer_counts(council)}


@router.get("/oddities")
def strange_but_true(council: str, limit: int = Query(5, ge=1, le=25)) -> dict:
    """Things in a council's own data that cannot be right, or are hard to believe. Read from bronze,
    so it is the council's data as sent. The lab's Strange But True page shows it."""
    try:
        return oddities.scan_database(_connection(), council, limit=limit)
    except FileNotFoundError:
        raise HTTPException(404, f"No mapping is defined for {council}.")


def _page(total: int, page: int, size: int, rows: list[dict]) -> dict:
    return {"total": total, "page": page, "size": size,
            "pages": max(1, (total + size - 1) // size), "rows": rows}


@router.get("/{council}/{layer}")
def rows(council: str, layer: Literal["bronze", "silver", "gold"],
         page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=200), q: str = "",
         sort: str = "reference", order: Literal["asc", "desc"] = "asc",
         state: Literal["all", "waiting", "approved"] = "all") -> dict:
    connection = _connection()
    pattern = api_common._like(q) if q else None
    direction = "ASC" if order == "asc" else "DESC"
    offset = (page - 1) * size

    if layer == "gold":
        if sort not in GOLD_SORT:
            raise HTTPException(400, f"Cannot sort gold by {sort}")
        where, params = ["g.council = ?"], [council]
        if state == "approved":
            where.append("g.approved = true")
        elif state == "waiting":
            where.append("g.approved = false")
        if q:
            where.append("(g.reference ILIKE ? ESCAPE '\\' OR s.address ILIKE ? ESCAPE '\\'"
                         " OR s.description ILIKE ? ESCAPE '\\')")
            params += [pattern] * 3
        clause = " AND ".join(where)
        total = connection.execute(
            f"SELECT count(*) FROM {api_common.FROM} WHERE {clause}", params).fetchone()[0]
        found = connection.execute(
            f"""SELECT g.reference, g.record, g.approved, g.edited, g.updated_at,
                       s.address, s.description, s.status, s.decision
                FROM {api_common.FROM} WHERE {clause}
                ORDER BY {GOLD_SORT[sort]} {direction}, g.reference ASC LIMIT ? OFFSET ?""",
            params + [size, offset]).fetchall()
        out = []
        for ref, record, approved, edited, updated, address, description, status, decision in found:
            out.append({"council": council, "reference": ref, "record": _record(record),
                        "approved": approved, "edited": edited,
                        "flagged": _flagged(connection, council, ref),
                        "updatedAt": updated.isoformat() if updated else None,
                        "address": address, "description": description,
                        "status": status, "decision": decision})
        return _page(total, page, size, out)

    if layer == "silver":
        where, params = ["s.council = ?"], [council]
        if q:
            where.append("(s.reference ILIKE ? ESCAPE '\\' OR s.address ILIKE ? ESCAPE '\\'"
                         " OR s.description ILIKE ? ESCAPE '\\')")
            params += [pattern] * 3
        clause = " AND ".join(where)
        total = connection.execute(
            f"SELECT count(*) FROM silver.applications s WHERE {clause}", params).fetchone()[0]
        found = connection.execute(
            f"""SELECT s.reference, s.record, s.address, s.description, s.status, s.decision,
                       s.mapped_at,
                       EXISTS (SELECT 1 FROM gold.applications g
                               WHERE g.council = s.council AND g.reference = s.reference)
                FROM silver.applications s WHERE {clause}
                ORDER BY s.reference {direction} LIMIT ? OFFSET ?""",
            params + [size, offset]).fetchall()
        out = [{"council": council, "reference": ref, "record": _record(record),
                "address": address, "description": description, "status": status,
                "decision": decision, "mappedAt": mapped.isoformat() if mapped else None,
                "inGold": in_gold,
                "flagged": _flagged(connection, council, ref)}
               for ref, record, address, description, status, decision, mapped, in_gold in found]
        return _page(total, page, size, out)

    where, params = ["b.council = ?"], [council]
    if q:
        where.append("(b.reference ILIKE ? ESCAPE '\\' OR CAST(b.record AS VARCHAR) ILIKE ? ESCAPE '\\')")
        params += [pattern] * 2
    clause = " AND ".join(where)
    join = ("FROM bronze.applications b LEFT JOIN silver.applications s "
            "ON s.council = b.council AND s.source_reference = b.reference")
    total = connection.execute(f"SELECT count(*) {join} WHERE {clause}", params).fetchone()[0]
    found = connection.execute(
        f"""SELECT b.reference, b.record, b.pulled_at, s.reference, s.address, s.description
            {join} WHERE {clause} ORDER BY b.reference {direction} LIMIT ? OFFSET ?""",
        params + [size, offset]).fetchall()
    out = [{"council": council, "reference": ref, "record": _record(record),
            "pulledAt": pulled.isoformat() if pulled else None, "mappedTo": mapped,
            "address": address, "description": description}
           for ref, record, pulled, mapped, address, description in found]
    return _page(total, page, size, out)


@router.post("/validate")
def validate_record(body: dict = Body(...)) -> dict:
    """{schema: "private" | "public", record}. Private is postSubmissionApplication, the
    unredacted one, and public is postSubmissionPublishedApplication."""
    kind = body.get("schema", "public")
    if kind not in validate.SCHEMA_FILES:
        raise HTTPException(422, "schema must be private or public")
    record = body.get("record")
    if not isinstance(record, dict):
        raise HTTPException(422, "record must be a JSON object")
    try:
        return validate.check_record(record, kind)
    except validate.NoSchema as error:
        raise HTTPException(503, str(error))


@router.get("/{council}/{reference}/check")
def check(council: str, reference: str) -> dict:
    """Does the OpenAPI spec accept this record as the unredacted endpoint sends it?"""
    api_common._exists(council, reference, approved_only=False)
    try:
        result = contract.check(config.load().openapi_path, "GET",
                                f"/api/@next/applications/{reference}", 200,
                                api_common._one(council, reference, approved_only=False))
    except contract.NoSpec as error:
        return {"valid": None, "errors": [str(error)]}
    return {"valid": result["valid"], "errors": result["errors"]}


@router.get("/{council}/{reference}/history")
def history(council: str, reference: str) -> list[dict]:
    return gold.history(_connection(), council, reference)


@router.post("/approve")
def approve(body: dict = Body(...), x_edited_by: str | None = Header(None)) -> dict:
    """{council, references} or {council, all_clean: true}. Add undo: true to take them back."""
    editor = _editor(x_edited_by)
    council = body.get("council")
    if not council:
        raise HTTPException(422, "council is required")
    connection = _connection()
    if body.get("all_clean"):
        references = [ref for _, ref in gold.clean_references(connection, council)]
    else:
        references = list(body.get("references") or [])
    if body.get("undo"):
        return {"changed": gold.unapprove(connection, council, references, editor)}
    return {"changed": gold.approve(connection, council, references, editor)}


@router.put("/{council}/{reference}")
def update(council: str, reference: str, record: dict = Body(...),
           x_edited_by: str | None = Header(None)) -> dict:
    editor = _editor(x_edited_by)
    record.get("metadata", {}).pop("pipeline", None)
    if not gold.update(_connection(), council, reference, record, editor):
        raise HTTPException(404, f"No published application {reference} for {council}")
    return {"saved": True}


@router.delete("/{council}/{reference}", status_code=204)
def unpublish(council: str, reference: str, x_edited_by: str | None = Header(None)) -> None:
    if not gold.delete(_connection(), council, reference, _editor(x_edited_by)):
        raise HTTPException(404, f"No published application {reference} for {council}")
