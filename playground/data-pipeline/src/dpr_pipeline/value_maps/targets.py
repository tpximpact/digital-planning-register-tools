"""What the standard accepts, read from its JSON schemas.

The lists come from the schemas rather than the TypeScript source so there is one place the truth
lives. An application type is any value an `applicationType` is allowed to be; a status or a
decision is the enum behind ApplicationStatus or AssessmentDecision.

The earlier scripts picked every quoted string out of the TypeScript, which also caught the
parent names of the types (pp, pp.full, ldc, pa and so on). Those are not valid values, so a
mapping to one passed the check and then failed the schema.
"""

from __future__ import annotations

import json
from pathlib import Path

from .. import validate

SCHEMA_NAMES = {"private": "postSubmissionApplication.json",
                "public": "postSubmissionPublishedApplication.json"}

RAW = "https://raw.githubusercontent.com/theopensystemslab/digital-planning-data-schemas/main/schemas/"


def enum_values(schema: dict, name: str) -> list[str]:
    """Every value a named definition allows, whether it is written as const, enum or anyOf."""
    found: set[str] = set()

    def walk(node) -> None:
        if not isinstance(node, dict):
            return
        if "const" in node:
            found.add(node["const"])
        found.update(node.get("enum", []))
        for key in ("anyOf", "oneOf"):
            for sub in node.get(key, []):
                walk(sub)

    walk((schema.get("definitions") or {}).get(name, {}))
    return sorted(found)


def application_types(schema: dict) -> list[str]:
    """Every value an applicationType property can take, anywhere in the schema."""
    found: set[str] = set()

    def walk(node) -> None:
        if isinstance(node, dict):
            properties = node.get("properties") or {}
            if node.get("type") == "object" and "applicationType" in properties:
                spec = properties["applicationType"]
                if "const" in spec:
                    found.add(spec["const"])
                found.update(spec.get("enum", []))
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(schema)
    return sorted(found)


def from_schemas(private: dict, public: dict) -> dict[str, list[str]]:
    return {
        "application_type": application_types(public),
        "status": enum_values(private, "ApplicationStatus"),
        "decision": enum_values(private, "AssessmentDecision"),
    }


def from_bundled_schemas() -> dict[str, list[str]]:
    load = lambda name: json.loads((validate.BUNDLED / name).read_text(encoding="utf-8"))  # noqa: E731
    return from_schemas(load(SCHEMA_NAMES["private"]), load(SCHEMA_NAMES["public"]))


def from_folder(folder: str | Path) -> dict[str, list[str]]:
    """From a checkout of the schemas repository (it has a schemas/ folder), or the folder itself."""
    base = Path(folder)
    base = base / "schemas" if (base / "schemas").is_dir() else base
    load = lambda name: json.loads((base / name).read_text(encoding="utf-8"))  # noqa: E731
    return from_schemas(load(SCHEMA_NAMES["private"]), load(SCHEMA_NAMES["public"]))


def from_github(get) -> dict[str, list[str]]:
    def load(name):
        response = get(RAW + name, timeout=30)
        response.raise_for_status()
        return json.loads(response.text)

    return from_schemas(load(SCHEMA_NAMES["private"]), load(SCHEMA_NAMES["public"]))
