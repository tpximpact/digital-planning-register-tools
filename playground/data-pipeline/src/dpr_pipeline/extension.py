"""What this pipeline adds to the standard, and the schema change that allows it.

The API serves only the standard's own endpoints. Anything extra about a record, such as whether it
is approved or what the mapper flagged, travels in metadata.pipeline on the unredacted side. The
public side never carries it.

The standard's metadata does not allow extra keys (additionalProperties is false), so the schema is
extended before anything is validated: extend() adds a `pipeline` property to every metadata object
it finds, in the published schema and in the OpenAPI spec alike. Propose the same addition to the
schemas repository and this module can go.
"""

from __future__ import annotations

import copy
from typing import Any

PIPELINE = {
    "description": "Extra information from the data pipeline. Never published.",
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "council": {"type": "string"},
        "approved": {"type": "boolean"},
        "approvedAt": {"type": "string"},
        "approvedBy": {"type": "string"},
        "edited": {"type": "boolean"},
        "updatedAt": {"type": "string"},
        "updatedBy": {"type": "string"},
        "flagged": {"type": "boolean", "description": "The mapper noted something to check"},
        "issues": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {"field": {"type": "string"}, "reason": {"type": "string"}},
                "required": ["field", "reason"],
            },
        },
        "sourceStatus": {"type": "string", "description": "The council's own wording"},
    },
    "required": ["council", "approved", "edited", "flagged"],
}


def _is_metadata(node: dict) -> bool:
    props = node.get("properties")
    return (isinstance(props, dict) and "generatedAt" in props and "organisation" in props
            and node.get("additionalProperties") is False)


def extend(schema: Any) -> Any:
    """A copy of the schema whose metadata objects also accept a `pipeline` property."""
    schema = copy.deepcopy(schema)

    def walk(node: Any) -> None:
        if isinstance(node, dict):
            if _is_metadata(node):
                node["properties"]["pipeline"] = copy.deepcopy(PIPELINE)
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(schema)
    return schema


def pipeline_metadata(*, council: str, approved: bool, approved_at, approved_by, edited: bool,
                      updated_at, updated_by, flagged: bool, issues: list[tuple[str, str]],
                      source_status: str | None) -> dict:
    """The metadata.pipeline block for one record, leaving out what is empty."""
    block: dict = {"council": council, "approved": bool(approved), "edited": bool(edited),
                   "flagged": bool(flagged)}
    for key, value in (("approvedAt", approved_at), ("approvedBy", approved_by),
                       ("updatedAt", updated_at), ("updatedBy", updated_by),
                       ("sourceStatus", source_status)):
        if value:
            block[key] = value.isoformat() if hasattr(value, "isoformat") else str(value)
    if issues:
        block["issues"] = [{"field": field, "reason": reason or ""} for field, reason in issues]
    return block
