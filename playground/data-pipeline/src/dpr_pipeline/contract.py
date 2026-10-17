"""Checking what the API sends against the standard's own OpenAPI spec.

Download the latest openapi.json (or openapi.yaml) from the digital-planning-data-schemas
repository and point at it, with DPR_OPENAPI or `openapi: path:` in the config. The default is
data/openapi.json.

The spec is large, because it writes every application type out in full, so it is read once and the
validators built from it are kept. Nothing here is needed to run the API: with no spec the checks
simply say so.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from . import extension, validate

DEFAULT_PATH = "data/openapi.json"


class NoSpec(Exception):
    """There is no spec file to check against."""


@lru_cache(maxsize=2)
def load(path: str) -> dict:
    file = Path(path)
    if not file.is_file():
        raise NoSpec(f"no OpenAPI file at {path}. Download openapi.json from the schemas repository.")
    text = file.read_text(encoding="utf-8")
    if file.suffix in (".yaml", ".yml"):
        import yaml

        return extension.extend(yaml.safe_load(text))
    return extension.extend(json.loads(text))


def describe(path: str) -> dict:
    """What is loaded, for an admin page to show."""
    try:
        spec = load(path)
    except NoSpec as error:
        return {"loaded": False, "path": path, "reason": str(error)}
    return {
        "loaded": True,
        "path": path,
        "openapi": spec.get("openapi"),
        "title": (spec.get("info") or {}).get("title"),
        "version": (spec.get("info") or {}).get("version"),
        "operations": len(operations(spec)),
    }


def operations(spec: dict) -> list[tuple[str, str]]:
    """Every (method, path template) the spec defines."""
    return [(method.upper(), template) for template, item in spec["paths"].items()
            for method in item if method in ("get", "post", "put", "patch", "delete")]


def _pattern(template: str) -> re.Pattern:
    """A path template as a regex. References contain slashes, so a parameter may span them."""
    parts = re.split(r"(\{[^}]+\})", template)
    body = "".join(".+?" if part.startswith("{") else re.escape(part) for part in parts)
    return re.compile(f"^{body}$")


def find_operation(spec: dict, method: str, path: str) -> tuple[str, dict] | None:
    """The template and operation a concrete path belongs to. The most literal template wins."""
    matches = []
    for template, item in spec["paths"].items():
        operation = item.get(method.lower())
        if operation and _pattern(template).match(path):
            literal = len(re.sub(r"\{[^}]+\}", "", template))
            matches.append((literal, template, operation))
    if not matches:
        return None
    _, template, operation = max(matches, key=lambda m: m[0])
    return template, operation


def _without_ids(node: Any) -> Any:
    """The spec gives each schema an $id that is only a fragment, which a validator rejects."""
    if isinstance(node, dict):
        return {k: _without_ids(v) for k, v in node.items() if k != "$id"}
    if isinstance(node, list):
        return [_without_ids(v) for v in node]
    return node


def _resolve(spec: dict, node: dict) -> dict:
    while isinstance(node, dict) and "$ref" in node:
        target: Any = spec
        for part in node["$ref"].lstrip("#/").split("/"):
            target = target[part]
        node = target
    return node


@lru_cache(maxsize=64)
def _validator(path: str, template: str, method: str, status: str):
    from jsonschema import Draft202012Validator

    spec = load(path)
    operation = spec["paths"][template][method.lower()]
    response = operation["responses"].get(status)
    if response is None:
        return None
    schema = (((response.get("content") or {}).get("application/json")) or {}).get("schema")
    if schema is None:
        return None
    return Draft202012Validator(_without_ids(_resolve(spec, schema)))


def check(path: str, method: str, request_path: str, status: int | str, body: Any) -> dict:
    """Validate one response body. Returns {valid, operation, errors}.

    request_path is the path as called, without the query string, for example
    /api/@next/public/applications/24-0001-FUL.
    """
    spec = load(path)
    found = find_operation(spec, method, request_path)
    if found is None:
        return {"valid": None, "operation": None,
                "errors": [f"{method} {request_path} is not in the spec"]}
    template, operation = found

    validator = _validator(path, template, method.upper(), str(status))
    if validator is None:
        return {"valid": None, "operation": operation.get("operationId"), "template": template,
                "errors": [f"the spec has no JSON response for status {status}"]}

    errors = []
    for error in validator.iter_errors(body):
        for real in validate._deepest(error):
            where = "/".join(str(part) for part in real.absolute_path) or "(root)"
            errors.append(f"{where}: {validate._shorten(real.message)}")
    # The same fault on every item of a list is reported once.
    unique = list(dict.fromkeys(re.sub(r"data/\d+/", "data/N/", e) for e in errors))
    return {"valid": not unique, "operation": operation.get("operationId"),
            "template": template, "errors": unique[:25]}
