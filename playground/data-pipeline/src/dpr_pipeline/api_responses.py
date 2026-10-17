"""The standard's response envelope, shared by every endpoint."""

from __future__ import annotations

from typing import Any


def envelope(data: Any, pagination: dict | None = None, code: int = 200,
             message: str = "OK", detail: str | None = None) -> dict:
    """The ApiResponse shape: data, optional pagination, and a status."""
    body: dict[str, Any] = {"data": data, "status": {"code": code, "message": message}}
    if detail is not None:
        body["status"]["detail"] = detail
    if pagination is not None:
        body["pagination"] = pagination
    return body
