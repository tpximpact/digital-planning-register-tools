"""The standard's document and comment endpoints, for both the public and the unredacted side.

They are the same routes with the same handlers; only redaction and visibility differ, so they are
registered twice from here rather than written twice.
"""

from __future__ import annotations

from typing import Any, Callable, Literal

from fastapi import APIRouter, Body, Header, HTTPException, Query
from pydantic import BaseModel

from . import items
from .api_responses import envelope

Sentiment = Literal["objection", "neutral", "supportive"]
Topic = Literal["design", "use", "light", "privacy", "access", "noise", "traffic", "other"]
SpecialistSentiment = Literal["approved", "amendmentsNeeded", "objected"]
Order = Literal["asc", "desc"]


class _Name(BaseModel):
    singleLine: str


class _Address(BaseModel):
    line1: str
    line2: str | None = None
    town: str
    county: str | None = None
    postcode: str
    country: str | None = None


class _Author(BaseModel):
    name: _Name
    address: _Address


class _Topical(BaseModel):
    topic: Topic
    question: str
    comment: str


class PublicCommentBody(BaseModel):
    """What the public sends. Matches publicComments.submit.body in the spec."""

    sentiment: Sentiment
    author: _Author
    comment: list[_Topical]
    commentRedacted: list[_Topical] | None = None


def register(router: APIRouter, *, public: bool, connection: Callable[[], Any],
             exists: Callable[[str, str], None]) -> None:
    """Add the nine routes to a router. exists raises a 404 when the application is not visible."""

    word = "published " if public else ""

    def view(kind: str, item: dict) -> dict:
        return items.redact(kind, item) if public else item

    def page_of(kind: str, client: str, application_id: str, page: int, size: int,
                sort_by: str, order_by: str, **filters) -> dict:
        exists(client, application_id)
        everything = items.fetch(connection(), client, application_id, kind, published_only=public)
        chosen = items.ordered(kind, items.filtered(kind, everything, **filters), sort_by, order_by)
        start = (page - 1) * size
        shown = [view(kind, item) for item in chosen[start:start + size]]

        pagination = {
            "resultsPerPage": size,
            "currentPage": page,
            "totalPages": (len(chosen) + size - 1) // size,
            "totalResults": len(chosen),
            "totalAvailableItems": len(everything),
        }
        data: Any = shown
        if kind != items.DOCUMENTS:
            data = {"summary": items.summary(kind, everything), "comments": shown}
        return envelope(data, pagination)

    def single(kind: str, client: str, application_id: str, item_id: str) -> dict:
        exists(client, application_id)
        item = items.one(connection(), client, application_id, kind, item_id, published_only=public)
        if item is None:
            raise HTTPException(404, f"No {kind} {item_id} for {application_id}")
        return envelope(view(kind, item))

    def client_header():
        return Header(..., alias="x-client", min_length=1, max_length=100)

    def service_header():
        return Header(None, alias="x-service", max_length=100)

    # Most specific first: the application route that follows would otherwise swallow these.

    @router.get("/applications/{application_id:path}/documents/{document_id}",
                summary=f"Get {word}document")
    def get_document(application_id: str, document_id: str, x_client: str = client_header(),
                     x_service: str | None = service_header()) -> dict:
        return single(items.DOCUMENTS, x_client, application_id, document_id)

    @router.get("/applications/{application_id:path}/documents", summary=f"Get {word}documents")
    def list_documents(
        application_id: str,
        page: int = Query(1, ge=1),
        results_per_page: int = Query(10, ge=1, le=200, alias="resultsPerPage"),
        sort_by: Literal["publishedAt", "name"] = Query("publishedAt", alias="sortBy"),
        order_by: Order = Query("desc", alias="orderBy"),
        name: str | None = Query(None),
        type: str | None = Query(None),
        x_client: str = client_header(),
        x_service: str | None = service_header(),
    ) -> dict:
        return page_of(items.DOCUMENTS, x_client, application_id, page, results_per_page,
                       sort_by, order_by, name=name, doc_type=type)

    @router.get("/applications/{application_id:path}/publicComments/{comment_id}",
                summary=f"Get {word}public comment")
    def get_public_comment(application_id: str, comment_id: str, x_client: str = client_header(),
                           x_service: str | None = service_header()) -> dict:
        return single(items.PUBLIC_COMMENTS, x_client, application_id, comment_id)

    @router.get("/applications/{application_id:path}/publicComments",
                summary=f"Get {word}public comments")
    def list_public_comments(
        application_id: str,
        page: int = Query(1, ge=1),
        results_per_page: int = Query(10, ge=1, le=200, alias="resultsPerPage"),
        query: str | None = Query(None),
        sentiment: Sentiment | None = Query(None),
        topic: Topic | None = Query(None),
        published_at_from: str | None = Query(None, alias="publishedAtFrom"),
        published_at_to: str | None = Query(None, alias="publishedAtTo"),
        sort_by: Literal["publishedAt"] = Query("publishedAt", alias="sortBy"),
        order_by: Order = Query("desc", alias="orderBy"),
        x_client: str = client_header(),
        x_service: str | None = service_header(),
    ) -> dict:
        return page_of(items.PUBLIC_COMMENTS, x_client, application_id, page, results_per_page,
                       sort_by, order_by, query=query, sentiment=sentiment, topic=topic,
                       published_from=published_at_from, published_to=published_at_to)

    @router.post("/applications/{application_id:path}/publicComments",
                 summary="Send public comment")
    def send_public_comment(
        application_id: str,
        body: PublicCommentBody = Body(...),
        x_client: str = client_header(),
        x_service: str | None = service_header(),
    ) -> dict:
        exists(x_client, application_id)
        items.add_public_comment(connection(), x_client, application_id, body.model_dump())
        # The spec's answer to a sent comment is an empty 200. It is held until published.
        return envelope(None)

    @router.get("/applications/{application_id:path}/specialistComments/{specialist_id}",
                summary=f"Get {word}specialist")
    def get_specialist(application_id: str, specialist_id: str, x_client: str = client_header(),
                       x_service: str | None = service_header()) -> dict:
        return single(items.SPECIALIST_COMMENTS, x_client, application_id, specialist_id)

    @router.get("/applications/{application_id:path}/specialistComments",
                summary=f"Get {word}specialist comments")
    def list_specialist_comments(
        application_id: str,
        page: int = Query(1, ge=1),
        results_per_page: int = Query(10, ge=1, le=200, alias="resultsPerPage"),
        query: str | None = Query(None),
        sentiment: SpecialistSentiment | None = Query(None),
        published_at_from: str | None = Query(None, alias="publishedAtFrom"),
        published_at_to: str | None = Query(None, alias="publishedAtTo"),
        sort_by: Literal["publishedAt"] = Query("publishedAt", alias="sortBy"),
        order_by: Order = Query("desc", alias="orderBy"),
        x_client: str = client_header(),
        x_service: str | None = service_header(),
    ) -> dict:
        return page_of(items.SPECIALIST_COMMENTS, x_client, application_id, page,
                       results_per_page, sort_by, order_by, query=query, sentiment=sentiment,
                       published_from=published_at_from, published_to=published_at_to)
