"""Schema checking for the silver layer.

Two levels. The cheap checks need nothing and catch the obvious: a record with no application type,
no reference or no date is not usable whatever the schema says. The full check validates against
the ODP post submission published schema, which lives in its own repository.

Point at a checkout with --schemas, or set DPR_SCHEMAS. The path is remembered in config, so the
check can run in CI without anyone passing it each time.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

SCHEMA_FILE = "schemas/postSubmissionPublishedApplication.json"


#: The one thing a legacy record can never have. The standard expects the original submission,
#: which means a PlanX submission, and historic applications predate it. Reported once rather than
#: on every record, because it is a known limit rather than a fault in the mapping.
LEGACY_GAP = "'submission' is a required property"


def basic_checks(connection, council: str | None = None) -> list[tuple[str, str]]:
    """Cheap checks that need no schema file. Returns (reference, problem) pairs."""
    where = "WHERE council = ?" if council else ""
    params = [council] if council else []
    rows = connection.execute(
        f"""
        SELECT reference, application_type, valid_from, decided_at, description, address
        FROM silver.applications {where}
        """,
        params,
    ).fetchall()

    problems: list[tuple[str, str]] = []
    for reference, application_type, valid_from, decided_at, description, address in rows:
        if not application_type:
            problems.append((reference, "no application type"))
        if not reference:
            problems.append((reference, "no reference"))
        if not valid_from and not decided_at:
            problems.append((reference, "no valid or decision date"))
        if not description:
            problems.append((reference, "no description"))
        if not address:
            problems.append((reference, "no address"))

    return problems


def find_schema(given: str | None = None) -> Path | None:
    """The post submission published schema, from the argument, the environment or nearby."""
    candidates = []
    if given:
        candidates.append(Path(given))
    if os.getenv("DPR_SCHEMAS"):
        candidates.append(Path(os.environ["DPR_SCHEMAS"]))
    # A checkout sitting beside this repo, which is how it is laid out locally.
    here = Path(__file__).resolve().parents[2]
    candidates.append(here.parent / "planning-register-data-logistics" / "repos"
                      / "digital-planning-data-schemas")

    for candidate in candidates:
        if candidate.is_file():
            return candidate
        schema = candidate / SCHEMA_FILE
        if schema.is_file():
            return schema
    return None


def load_schema(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def against_schema(connection, schema: dict, council: str | None = None,
                   strict: bool = False) -> list[tuple[str, str]]:
    """Validate silver against a json schema.

    The post submission schema is one long list of alternatives, one per application type, so a
    failure at the top only says "not valid under any of the given schemas" and buries the reason.
    _deepest walks into the alternative that got furthest and reports what actually went wrong
    there, which is the part someone can fix.
    """
    from jsonschema import Draft202012Validator

    validator = Draft202012Validator(schema)
    where = "WHERE council = ?" if council else ""
    params = [council] if council else []
    rows = connection.execute(
        f"SELECT reference, record FROM silver.applications {where}", params
    ).fetchall()

    problems: list[tuple[str, str]] = []
    for reference, raw in rows:
        record = json.loads(raw) if isinstance(raw, str) else raw
        for error in validator.iter_errors(record):
            for real in _deepest(error):
                if LEGACY_GAP in real.message and not strict:
                    continue
                location = "/".join(str(part) for part in real.absolute_path) or "(root)"
                problems.append((reference, f"{location}: {_shorten(real.message)}"))

    return problems


def _deepest(error, depth: int = 0):
    """The most specific errors inside a failed set of alternatives.

    An alternative that matched the application type but failed on one field is far more useful
    than fifty alternatives that failed because the type did not match.
    """
    if not error.context or depth > 4:
        return [error]

    by_branch: dict[int, list] = {}
    for child in error.context:
        by_branch.setdefault(child.schema_path[0] if child.schema_path else 0, []).append(child)

    # The branch that complained least is the one that nearly fitted.
    best = min(by_branch.values(), key=len)
    results = []
    for child in best:
        results.extend(_deepest(child, depth + 1))
    return results


def summarise(problems: list[tuple[str, str]], limit: int = 10) -> list[tuple[str, int]]:
    """The same problem usually affects every record, so report it once with a count."""
    counts: dict[str, int] = {}
    for _, problem in problems:
        counts[problem] = counts.get(problem, 0) + 1
    return sorted(counts.items(), key=lambda pair: -pair[1])[:limit]


def _shorten(message: str, limit: int = 160) -> str:
    """Schema messages quote the whole record back, which is unreadable in a terminal."""
    single_line = " ".join(message.split())
    return single_line if len(single_line) <= limit else single_line[: limit - 1] + "…"
