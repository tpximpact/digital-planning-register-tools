"""The MHCLG national public view, over HTTP.

Kept out of the OpenAPI docs on purpose, like the admin routes. The documented API is the ODP
spec and nothing else, and the national public view is a different standard that has not been
agreed yet. When it is, these can move into the documented surface.

The datasets are built from gold and hold approved records only, so nothing here can show a
record a person has not approved.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from . import api_common, national


def _connection():
    # Through the module, not a direct import, so a test can swap it out.
    return api_common._connection()

router = APIRouter(prefix="/national", include_in_schema=False)


# Declared before the dataset route, because a path parameter would otherwise swallow them.
@router.get("/datasets")
def datasets(council: str | None = Query(None)) -> dict:
    """The eight datasets, with row counts."""
    connection = _connection()
    where = " WHERE council = ?" if council else ""
    params = [council] if council else []
    return {
        "datasets": [
            {
                "name": name,
                "note": definition["note"],
                "fields": definition["fields"],
                "rows": connection.execute(
                    f"SELECT count(*) FROM {national.table_name(name)}{where}", params
                ).fetchone()[0],
            }
            for name, definition in national.DATASETS.items()
        ]
    }


@router.get("/coverage")
def coverage(council: str | None = Query(None), empty: bool = Query(False)) -> dict:
    """Field by field, with the reason where a field is empty because of the standard."""
    connection = _connection()
    lines = national.coverage(connection, council)
    if empty:
        lines = [line for line in lines if not line["filled"]]
    return {"summary": national.summary(connection, council), "fields": lines}


@router.get("/application/{council}/{reference:path}")
def application(council: str, reference: str) -> dict:
    """Every national row belonging to one application, across all eight datasets.

    This is the shape the national model works in: the application, the site it points at, the
    decision notice, the documents and the timeline, as separate records rather than one object.
    """
    connection = _connection()
    collected: dict[str, list[dict]] = {}

    for name, definition in national.DATASETS.items():
        columns = [national.column_name(field) for field in definition["fields"]]
        if name == "site":
            where, params = "reference = ?", [f"{reference}:site"]
        elif name == "planning-application":
            where, params = "reference = ?", [reference]
        elif "planning-application" in definition["fields"]:
            where, params = "planning_application = ?", [reference]
        elif "decision-notice" in definition["fields"]:
            where, params = "decision_notice = ?", [f"{reference}:decision"]
        else:
            where, params = "reference LIKE ?", [f"{reference}:%"]

        rows = connection.execute(
            f"SELECT {', '.join(columns)} FROM {national.table_name(name)}"
            f" WHERE council = ? AND {where} ORDER BY reference",
            [council, *params],
        ).fetchall()
        collected[name] = [dict(zip(definition["fields"], row)) for row in rows]

    if not collected.get("planning-application"):
        raise HTTPException(404, f"No published application {reference} for {council}")
    return collected


@router.get("/{dataset}")
def rows(
    dataset: str,
    council: str | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
) -> dict:
    """One national dataset, as rows."""
    if dataset not in national.DATASETS:
        raise HTTPException(404, f"No national dataset called {dataset}")

    connection = _connection()
    definition = national.DATASETS[dataset]
    columns = [national.column_name(field) for field in definition["fields"]]
    where = " WHERE council = ?" if council else ""
    params = [council] if council else []

    total = connection.execute(
        f"SELECT count(*) FROM {national.table_name(dataset)}{where}", params
    ).fetchone()[0]
    found = connection.execute(
        f"SELECT {', '.join(columns)} FROM {national.table_name(dataset)}{where}"
        f" ORDER BY reference LIMIT ? OFFSET ?",
        [*params, size, (page - 1) * size],
    ).fetchall()

    return {
        "dataset": dataset,
        "total": total,
        "page": page,
        "size": size,
        "rows": [dict(zip(definition["fields"], row)) for row in found],
    }
