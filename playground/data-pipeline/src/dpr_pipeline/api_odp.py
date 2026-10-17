"""The Open Digital Planning endpoints: exactly the routes in the standard's OpenAPI spec.

Nothing here is for an admin tool. /api/@next/public is the redacted, approved-only register and
/api/@next is the unredacted version of the same routes. Both take x-client to pick the council
and answer in the spec's data, pagination and status envelope.
"""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Header, Query

from . import api_common, api_items
from .api_common import _exists, _listing, _one

public = APIRouter(prefix="/api/@next/public", tags=["ODP public"])
unredacted = APIRouter(prefix="/api/@next", tags=["ODP unredacted"])


# --------------------------------------------------------------- the standard's endpoints

def _schema_list(x_client: str, page: int, results_per_page: int, query: str | None,
                 sort_by: str, order_by: str, reference: str | None, approved_only: bool) -> dict:
    return _listing(x_client, page, results_per_page, sort_by, order_by,
                    approved_only=approved_only, query=query, reference=reference)


# Documents and comments come first: the application route below would swallow their paths.
api_items.register(public, public=True, connection=lambda: api_common._connection(),
                   exists=lambda council, reference: _exists(council, reference, True))
api_items.register(unredacted, public=False, connection=lambda: api_common._connection(),
                   exists=lambda council, reference: _exists(council, reference, False))


@public.get("/applications", summary="Get published applications",
            description="A redacted list of applications. x-client picks the council.")
def list_public(
    page: int = Query(1, ge=1),
    results_per_page: int = Query(10, ge=1, le=200, alias="resultsPerPage"),
    query: str | None = Query(None, description="Search the reference, address and description"),
    sort_by: Literal["publishedAt", "receivedAt"] = Query("publishedAt", alias="sortBy"),
    order_by: Literal["asc", "desc"] = Query("desc", alias="orderBy"),
    reference: str | None = Query(None),
    x_client: str = Header(..., alias="x-client", min_length=1, max_length=100,
                           examples=["camden"]),
    x_service: str | None = Header(None, alias="x-service", max_length=100),
) -> dict:
    return _schema_list(x_client, page, results_per_page, query, sort_by, order_by, reference,
                        approved_only=True)


@public.get("/applications/{application_id:path}", summary="Get published application")
def get_public(
    application_id: str,
    x_client: str = Header(..., alias="x-client", min_length=1, max_length=100),
    x_service: str | None = Header(None, alias="x-service", max_length=100),
) -> dict:
    return _one(x_client, application_id, approved_only=True)


@unredacted.get("/applications", summary="Get applications",
                description="An unredacted list of all applications. x-client picks the council.")
def list_unredacted(
    page: int = Query(1, ge=1),
    results_per_page: int = Query(10, ge=1, le=200, alias="resultsPerPage"),
    query: str | None = Query(None),
    sort_by: Literal["publishedAt", "receivedAt"] = Query("publishedAt", alias="sortBy"),
    order_by: Literal["asc", "desc"] = Query("desc", alias="orderBy"),
    reference: str | None = Query(None),
    x_client: str = Header(..., alias="x-client", min_length=1, max_length=100),
    x_service: str | None = Header(None, alias="x-service", max_length=100),
) -> dict:
    return _schema_list(x_client, page, results_per_page, query, sort_by, order_by, reference,
                        approved_only=False)


@unredacted.get("/applications/{application_id:path}", summary="Get application")
def get_unredacted(
    application_id: str,
    x_client: str = Header(..., alias="x-client", min_length=1, max_length=100),
    x_service: str | None = Header(None, alias="x-service", max_length=100),
) -> dict:
    return _one(x_client, application_id, approved_only=False)
