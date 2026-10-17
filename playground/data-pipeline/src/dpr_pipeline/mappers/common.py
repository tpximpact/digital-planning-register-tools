"""What every council's mapper shares, so a new council is a mapping file and a few hooks.

A council's mapper used to be a whole module: the reading of its fields, the upsert into silver,
the rewriting of the issues table. Only the first part differs between councils. This holds the
rest, and reads the field layout from a yaml file in dpr_pipeline/mappings.

    camden.py   the hooks that are Camden's alone: which rows to leave out, how a type resolves
    camden.yaml where each value lives in Camden's record
"""

from __future__ import annotations

import datetime as dt
import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Callable

import yaml

from .. import post_submission

MAPPINGS = Path(__file__).resolve().parent.parent / "mappings"

Issue = tuple[str, "str | None", str]
MapResult = tuple[dict, list[Issue], dict]


class Mapping:
    """A council's field layout, loaded from yaml, applied to one source record."""

    def __init__(self, definition: dict):
        self.council: str = definition["council"]
        self.fields: dict[str, dict] = definition.get("fields") or {}
        self.lookups: dict[str, dict[str, str]] = definition.get("lookups") or {}

    @classmethod
    @lru_cache(maxsize=None)
    def load(cls, council: str) -> "Mapping":
        text = (MAPPINGS / f"{council}.yaml").read_text(encoding="utf-8")
        return cls(yaml.safe_load(text))

    def has(self, name: str) -> bool:
        return name in self.fields

    def raw(self, source: dict, name: str) -> str:
        """The value as the council wrote it, tidied but not translated. Empty if not present."""
        spec = self.fields.get(name)
        if spec is None:
            return ""
        paths = spec["from"] if isinstance(spec["from"], list) else [spec["from"]]
        parts = [_text(_dig(source, path)) for path in paths]
        if spec.get("first"):
            # The same value can live in more than one place, so take the first that is there.
            parts = [next((part for part in parts if part), "")]
        text = spec.get("join", " ").join(part for part in parts if part)
        return text.upper() if spec.get("upper") else text

    def get(self, source: dict, name: str) -> Any:
        """The value ready to use: a date if the spec says so, otherwise tidy text."""
        text = self.raw(source, name)
        if self.fields.get(name, {}).get("as") == "date":
            return as_date(text)
        return text

    def wording(self, source: dict, name: str) -> str:
        """The council's own wording: the value, run through its lookup table if it has one."""
        text = self.raw(source, name)
        table = self.fields.get(name, {}).get("lookup")
        return self.translate(table, text) if table else text

    def translate(self, table: str, code: str) -> str:
        """A code into the council's wording, or the code itself when it is not in the table."""
        return self.lookups.get(table, {}).get(code, code)

    def knows(self, table: str, code: str) -> bool:
        return code in self.lookups.get(table, {})


def _dig(source: Any, path: str) -> Any:
    for part in path.split("."):
        if isinstance(source, list) and part.isdigit():
            source = source[int(part)] if int(part) < len(source) else None
        elif isinstance(source, dict):
            source = source.get(part)
        else:
            return None
    return source


def _text(value: Any) -> str:
    return "" if value is None else str(value).strip()


def as_date(value: str | None) -> dt.date | None:
    """Dates arrive as ISO with or without a time, or as day/month/year."""
    if not value:
        return None
    text = str(value).strip().replace("Z", "")
    for pattern in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return dt.datetime.strptime(text, pattern).date()
        except ValueError:
            continue
    return None


def standard_fields(mapping: Mapping, source: dict, issues: list[Issue]) -> dict:
    """The optional parts of the standard, filled only where the mapping names a source for them.

    Works for any council: it reads whatever opt_ entries the yaml declares and reports wording
    it cannot turn into the standard's granted or refused.
    """
    extra: dict[str, Any] = {}

    wording = mapping.wording(source, "decision")
    outcome = post_submission.normalise_decision(wording)
    if wording and outcome is None and "withdraw" not in wording.lower() \
            and "split" not in wording.lower():
        issues.append(("decision", wording, "council wording not recognised as granted or refused"))
    extra["decision"] = outcome

    if mapping.has("opt_expiry"):
        extra["expiry_date"] = mapping.get(source, "opt_expiry")
    if mapping.has("opt_recommendation"):
        extra["recommendation"] = post_submission.normalise_decision(
            mapping.raw(source, "opt_recommendation"))
    if mapping.has("opt_committee_sent"):
        extra["committee_sent_at"] = mapping.get(source, "opt_committee_sent")
    if mapping.has("opt_notice_url"):
        extra["decision_notice_url"] = mapping.raw(source, "opt_notice_url") or None
    if mapping.has("opt_withdrawn_reason"):
        extra["withdrawn_reason"] = mapping.raw(source, "opt_withdrawn_reason") or None

    # A withdrawn application was never decided, so its date is when it was withdrawn.
    if "withdraw" in wording.lower():
        extra["withdrawn_at"] = mapping.get(source, "decided")
    return extra


def _number(text: str) -> float | None:
    try:
        return float(text)
    except ValueError:
        return None


def build_record(council: str, mapping: Mapping, source: dict, application_type: str,
                 issues: list[Issue], **overrides) -> dict:
    """The standard's record for one source row, from the mapping's fields."""
    extra = standard_fields(mapping, source, issues)
    extra.update(overrides)
    withdrawn = extra.get("withdrawn_at") is not None
    record = post_submission.build(
        easting=_number(mapping.raw(source, "easting")),
        northing=_number(mapping.raw(source, "northing")),
        applicant_name=mapping.raw(source, "applicant") or None,
        address=mapping.raw(source, "address") or None,
        description=mapping.raw(source, "description") or None,
        latitude=_number(mapping.raw(source, "latitude")),
        longitude=_number(mapping.raw(source, "longitude")),
        council=council,
        application_type=application_type,
        reference=mapping.raw(source, "reference"),
        received_at=mapping.get(source, "received"),
        validated_at=mapping.get(source, "validated"),
        decided_at=None if withdrawn else mapping.get(source, "decided"),
        officer_name=mapping.raw(source, "officer"),
        estimate_expiry=extra.get("expiry_date") is None,
        **extra,
    )
    assessment = record["data"].get("assessment")
    if assessment and extra.get("expiry_date") is None:
        estimated = assessment.get("expiryDate")
        issues.append(("expiryDate", estimated,
                       "estimated from the submission date and application type (see expiry.py), "
                       "not in the source" if estimated else
                       "not in the source, and no submission date to estimate from"))
    return record


def beside(mapping: Mapping, source: dict, *, status: str, decision: str,
           source_application_type: str, mapped_by: str, **more) -> dict:
    """The columns kept beside the record, because the standard has no place for them."""
    return {
        "status": status,
        "decision": decision,
        "valid_from": mapping.get(source, "validated"),
        "decided_at": mapping.get(source, "decided"),
        "address": mapping.raw(source, "address"),
        "description": mapping.raw(source, "description"),
        "applicant": mapping.raw(source, "applicant"),
        "officer": mapping.raw(source, "officer"),
        "source_application_type": source_application_type,
        "mapped_by": mapped_by,
        **more,
    }


def map_all(connection, council: str, map_record: Callable[[dict], MapResult],
            skip: Callable[[dict], "tuple[str, str, str] | None"] | None = None) -> tuple[int, int]:
    """Convert every bronze row for a council into silver. Returns records and issues written.

    skip returns (field, value, reason) for a row that should be left out of silver and recorded
    instead, or None to carry on.
    """
    rows = connection.execute(
        "SELECT reference, record FROM bronze.applications WHERE council = ?", [council]
    ).fetchall()

    mapped_at = dt.datetime.now(dt.timezone.utc)
    records: list[tuple] = []
    issues: list[tuple] = []

    for reference, raw in rows:
        source = json.loads(raw) if isinstance(raw, str) else raw

        skipped = skip(source) if skip else None
        if skipped:
            issues.append((council, reference, *skipped, mapped_at))
            continue

        record, row_issues, extra = map_record(source)
        # Silver is keyed by the standard's reference, which is the cleaned one; bronze keeps the
        # council's own.
        source_reference = reference
        reference = record["data"]["application"]["reference"]
        records.append((
            council, reference, record["applicationType"],
            extra["status"], extra["decision"], extra["valid_from"], extra["decided_at"],
            extra["address"], extra["description"], extra["applicant"], extra["officer"],
            source_reference, mapped_at, json.dumps(record, ensure_ascii=False),
        ))
        issues.extend((council, reference, field, value, reason, mapped_at)
                      for field, value, reason in row_issues)

    if records:
        connection.executemany(
            """
            INSERT INTO silver.applications
                (council, reference, application_type, status, decision, valid_from,
                 decided_at, address, description, applicant, officer, source_reference,
                 mapped_at, record)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (council, reference) DO UPDATE SET
                application_type = excluded.application_type,
                status = excluded.status,
                decision = excluded.decision,
                valid_from = excluded.valid_from,
                decided_at = excluded.decided_at,
                address = excluded.address,
                description = excluded.description,
                applicant = excluded.applicant,
                officer = excluded.officer,
                source_reference = excluded.source_reference,
                mapped_at = excluded.mapped_at,
                record = excluded.record
            """,
            records,
        )

    connection.execute("DELETE FROM silver.mapping_issues WHERE council = ?", [council])
    if issues:
        connection.executemany(
            """
            INSERT INTO silver.mapping_issues (council, reference, field, value, reason, found_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            issues,
        )

    return len(records), len(issues)
