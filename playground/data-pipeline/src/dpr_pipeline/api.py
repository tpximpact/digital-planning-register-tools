"""The API over the gold layer, split into public and private.

Two sets of endpoints, because they do different jobs:

  public    what the register and anyone else reads. Read only, published records, and no sign of
            who edited what
  private   what an admin tool uses. The same records plus their history, and create, update and
            delete

Both sit on gold rather than silver, because gold is where editing happens and silver stays exactly
as the council sent it.

Comments are out of scope for now.

    uvicorn dpr_pipeline.api:app --reload
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Literal

from fastapi import APIRouter, Body, FastAPI, Header, HTTPException, Query
from fastapi.responses import FileResponse, RedirectResponse

from . import config, db, gold

STATIC = Path(__file__).parent / "static"

SORTABLE = {"reference", "published_at", "updated_at"}

app = FastAPI(
    title="DPR published applications",
    description=(
        "Planning applications in the post submission standard.\n\n"
        "**/public** is read only, for the register and anyone else consuming the data.\n\n"
        "**/private** is for an admin tool: the same records, plus their history, and the"
        " endpoints that change them."
    ),
    version="0.2.0",
)

public = APIRouter(prefix="/public", tags=["public"])
private = APIRouter(prefix="/private", tags=["private"])


def _connection():
    return db.connect(config.load().database_path)


def _editor(x_edited_by: str | None) -> str:
    """Who is making the change. A header for now; real authentication comes later."""
    if not x_edited_by:
        raise HTTPException(400, "Send an X-Edited-By header so the change can be attributed.")
    return x_edited_by


def _listing(council: str | None, page: int, size: int, sort: str, order: str,
             include_editing: bool) -> dict:
    if sort not in SORTABLE:
        raise HTTPException(400, f"Cannot sort by {sort}")

    connection = _connection()
    where = "WHERE council = ?" if council else ""
    params: list[Any] = [council] if council else []

    total = connection.execute(
        f"SELECT count(*) FROM gold.applications {where}", params
    ).fetchone()[0]


    direction = "ASC" if order == "asc" else "DESC"
    # The council's own wording, the address, the description and their decision, live beside the
    # record rather than inside it, because the standard has no place for them. An admin tool needs
    # them to make a list readable, so they are joined back on here.
    rows = connection.execute(
        f"""
        SELECT g.council, g.reference, g.published_at, g.updated_at, g.edited, g.record,
               s.address, s.description, s.status, s.decision
        FROM gold.applications g
        LEFT JOIN silver.applications s USING (council, reference)
        {where.replace("council", "g.council") if where else ""}
        ORDER BY g.{sort} {direction}
        LIMIT ? OFFSET ?
        """,
        params + [size, (page - 1) * size],
    ).fetchall()

    applications = []
    for row in rows:
        council_name, reference, published, updated, edited, record = row[:6]
        address, description, status, decision = row[6:]
        item = {
            "council": council_name,
            "reference": reference,
            "publishedAt": published.isoformat() if published else None,
            "record": json.loads(record),
        }
        if include_editing:
            # Who has touched a record is an internal matter, so it stays out of the public feed.
            item["updatedAt"] = updated.isoformat() if updated else None
            item["edited"] = edited
            item["detail"] = {
                "address": address,
                "description": description,
                "status": status,
                "decision": decision,
            }
        applications.append(item)

    return {
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size,
        "applications": applications,
    }


# --------------------------------------------------------------- public, read only

@public.get("/applications", summary="List published applications")
def list_public(
    council: str | None = Query(None, description="Limit to one council"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    sort: Literal["reference", "published_at"] = "reference",
    order: Literal["asc", "desc"] = "asc",
) -> dict:
    return _listing(council, page, size, sort, order, include_editing=False)


@public.get("/applications/{council}/{reference:path}", summary="Get one published application")
def get_public(council: str, reference: str) -> dict:
    record = gold.get(_connection(), council, reference)
    if record is None:
        raise HTTPException(404, f"No published application {reference} for {council}")
    return record


# --------------------------------------------------------------- private, for an admin tool

@private.get("/applications", summary="List, showing what has been edited")
def list_private(
    council: str | None = Query(None, description="Limit to one council"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    sort: Literal["reference", "published_at", "updated_at"] = "reference",
    order: Literal["asc", "desc"] = "asc",
) -> dict:
    return _listing(council, page, size, sort, order, include_editing=True)


# Declared before the plain get, because a path parameter would otherwise swallow "/history".
@private.get("/applications/{council}/{reference:path}/history",
             summary="What changed, and who by")
def get_history(council: str, reference: str) -> list[dict]:
    connection = _connection()
    if gold.get(connection, council, reference) is None:
        raise HTTPException(404, f"No published application {reference} for {council}")
    return gold.history(connection, council, reference)


@private.get("/applications/{council}/{reference:path}", summary="Get one application")
def get_private(council: str, reference: str) -> dict:
    record = gold.get(_connection(), council, reference)
    if record is None:
        raise HTTPException(404, f"No published application {reference} for {council}")
    return record


@private.post("/applications/{council}/{reference:path}", status_code=201,
              summary="Add one by hand")
def create_application(
    council: str,
    reference: str,
    record: dict = Body(...),
    x_edited_by: str | None = Header(None),
) -> dict:
    connection = _connection()
    if not gold.create(connection, council, reference, record, _editor(x_edited_by)):
        raise HTTPException(409, f"{reference} is already published for {council}")
    return record


@private.put("/applications/{council}/{reference:path}", summary="Replace one")
def update_application(
    council: str,
    reference: str,
    record: dict = Body(...),
    x_edited_by: str | None = Header(None),
) -> dict:
    connection = _connection()
    if not gold.update(connection, council, reference, record, _editor(x_edited_by)):
        raise HTTPException(404, f"No published application {reference} for {council}")
    return record


@private.delete("/applications/{council}/{reference:path}", status_code=204,
                summary="Unpublish one")
def delete_application(
    council: str,
    reference: str,
    x_edited_by: str | None = Header(None),
) -> None:
    connection = _connection()
    if not gold.delete(connection, council, reference, _editor(x_edited_by)):
        raise HTTPException(404, f"No published application {reference} for {council}")


app.include_router(public)
app.include_router(private)


@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse("/admin")


@app.get("/admin", include_in_schema=False)
def admin():
    """A plain screen for reviewing and editing published records.

    A fuller admin front end is being written separately; this is a small one so the pipeline can be
    shown to people who would rather click than read a terminal. It uses the private endpoints.
    """
    return FileResponse(STATIC / "admin.html")
