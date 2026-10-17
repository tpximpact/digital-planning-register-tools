"""The data behind the value mappers admin page, at /admin/mappers/data.

Like admin_data, these routes stay out of the OpenAPI docs: the documented API is the standard's
ODP endpoints and nothing else. They read and write the csv files in the mappers folder through
value_maps, so the page and `dpr mappers` always agree.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, HTTPException, Query

from . import config
from .value_maps import Library, check, fetch, root_from, view

router = APIRouter(prefix="/admin/mappers/data", include_in_schema=False)


def _library() -> Library:
    return Library(root_from(config.load()))


def _table(library: Library, table_id: str):
    try:
        return library.table(table_id)
    except KeyError:
        raise HTTPException(404, f"No mapper table called {table_id}.")


def overview(library: Library) -> dict[str, Any]:
    return {"tables": [check(library, t).summary() for t in library.tables()],
            "urls": library.portal_urls()}


@router.get("/tables")
def tables():
    return overview(_library())


@router.get("/table")
def one_table(id: str = Query(...)):
    library = _library()
    return view(library, _table(library, id))


@router.put("/table")
def save_table(id: str = Query(...), body: dict = Body(...)):
    """Body: {changes: [{value, entries: [{target, notes}]}]}, every row for each value named."""
    library = _library()
    table = _table(library, id)
    rejected = library.save(table, body.get("changes") or [])
    if rejected:
        detail = "; ".join(f"{r['value']}: '{r['target']}' {r['problem']}" for r in rejected)
        raise HTTPException(422, f"Nothing saved. {detail}")
    return view(library, table)


@router.post("/fetch")
def refresh(body: dict = Body(...)):
    """Refresh one table's source: the standard's values and MHCLG's list for the application
    types, or a portal's dropdowns. New values arrive as blank rows; filled-in rows are untouched."""
    library = _library()
    table = _table(library, body.get("id", ""))
    try:
        if table.portal:
            url = next((u for u in library.portal_urls() if fetch.check_portal_url(u) == table.portal),
                       None)
            if not url:
                raise HTTPException(404, f"{table.portal} is not in idox_urls.txt.")
            report = fetch.refresh_portal(library, url)
            message = f"{sum(report['added'].values())} new values to map"
        else:
            counts = fetch.refresh_targets(library)
            total = fetch.refresh_mhclg(library)
            fetch.sync(library, table)
            message = f"{total} MHCLG types and {counts['application_type']} standard types read"
    except fetch.FetchError as problem:
        raise HTTPException(502, str(problem))
    return {"message": message, **view(library, _table(library, table.id))}


@router.post("/portals")
def add_portal(body: dict = Body(...)):
    """Start mapping another Idox portal from the address of its advanced search page."""
    library = _library()
    url = (body.get("url") or "").strip()
    try:
        fetch.check_portal_url(url)
        library.add_portal_url(url)
        report = fetch.refresh_portal(library, url)
    except fetch.FetchError as problem:
        raise HTTPException(422, str(problem))
    first = next(iter(report["added"]), None)
    return {"domain": report["domain"], "first": first, **overview(library)}
