"""Camden, bronze into silver.

The field names come from an earlier converter written for the register's open data handler. That one targets the register's old DprPlanningApplication type rather than the
post submission standard, so the source fields carry over but the shape here is different.

Application types are resolved in application_types.py, which also records whether a type was an
agreed equivalent or a fallback.

Anything this mapper cannot place is written to silver.mapping_issues rather than dropped, so the
size of the gap stays visible instead of turning into silent nulls.
"""

from __future__ import annotations

import datetime as dt
import json

from .. import application_types, post_submission

COUNCIL = "camden"


def map_all(connection) -> tuple[int, int]:
    """Convert every bronze row for Camden. Returns records written and issues found."""
    rows = connection.execute(
        "SELECT reference, record FROM bronze.applications WHERE council = ?", [COUNCIL]
    ).fetchall()

    mapped_at = dt.datetime.now(dt.timezone.utc)
    records: list[tuple] = []
    issues: list[tuple] = []

    for reference, raw in rows:
        source = json.loads(raw) if isinstance(raw, str) else raw

        # Some Camden rows are not planning applications at all, for example a request for
        # observations from a neighbouring borough. Publishing those as permissions would be wrong,
        # so they are left out of silver and recorded instead.
        camden_type = (source.get("application_type") or "").strip()
        if camden_type in application_types.NOT_AN_APPLICATION:
            issues.append((COUNCIL, reference, "application_type", camden_type,
                           "not a planning application, left out of silver", mapped_at))
            continue

        record, row_issues, beside = map_record(source)

        records.append((
            COUNCIL,
            reference,
            record["applicationType"],
            beside["status"],
            beside["decision"],
            beside["valid_from"],
            beside["decided_at"],
            beside["address"],
            beside["description"],
            beside["applicant"],
            beside["officer"],
            mapped_at,
            json.dumps(record, ensure_ascii=False),
        ))
        issues.extend(
            (COUNCIL, reference, field, value, reason, mapped_at)
            for field, value, reason in row_issues
        )

    if records:
        connection.executemany(
            """
            INSERT INTO silver.applications
                (council, reference, application_type, status, decision, valid_from,
                 decided_at, address, description, applicant, officer, mapped_at, record)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                mapped_at = excluded.mapped_at,
                record = excluded.record
            """,
            records,
        )

    connection.execute("DELETE FROM silver.mapping_issues WHERE council = ?", [COUNCIL])
    if issues:
        connection.executemany(
            """
            INSERT INTO silver.mapping_issues (council, reference, field, value, reason, found_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            issues,
        )

    return len(records), len(issues)


def map_record(source: dict) -> tuple[dict, list[tuple[str, str | None, str]], dict]:
    """One Camden record into the standard, plus the gaps and the fields kept beside it."""
    issues: list[tuple[str, str | None, str]] = []

    camden_type = (source.get("application_type") or "").strip()
    application_type, how = application_types.resolve(camden_type)
    if how != "agreed":
        issues.append(("application_type", camden_type,
                       f"put on {application_type} by {how}, not an agreed equivalent"))

    reference = str(source.get("application_number") or "").strip()
    status = (source.get("system_status") or "").strip()
    decision = (source.get("decision_type") or "").strip()
    if status:
        issues.append(("system_status", status, "council wording, not yet mapped to ODP status"))

    received = _as_date(source.get("registered_date"))
    validated = _as_date(source.get("valid_from_date"))
    decided = _as_date(source.get("decision_date"))

    record = post_submission.build(
        council=COUNCIL,
        application_type=application_type,
        reference=reference,
        received_at=received,
        validated_at=validated,
        decided_at=decided,
        officer_name=(source.get("case_officer") or "").strip(),
    )

    # The standard wants the original submission, which legacy data does not have.
    issues.append(("submission", None,
                   "no original submission for a historic record, only the dates it was received"))
    if not (source.get("location") or {}).get("latitude"):
        issues.append(("location", None, "no coordinates in the source record"))
    else:
        issues.append(("boundary", None, "source has a point only, no site boundary"))

    beside = {
        "status": status,
        "decision": decision,
        "valid_from": validated,
        "decided_at": decided,
        "address": (source.get("development_address") or "").strip(),
        "description": (source.get("development_description") or "").strip(),
        "applicant": (source.get("applicant_name") or "").strip(),
        "officer": (source.get("case_officer") or "").strip(),
        "source_application_type": camden_type,
        "mapped_by": how,
    }
    return record, issues, beside


def _as_iso(value: str | None) -> str | None:
    date = _as_date(value)
    return date.isoformat() if date else None


def _as_date(value: str | None) -> dt.date | None:
    if not value:
        return None
    text = str(value).strip().replace("Z", "")
    for pattern in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
        try:
            return dt.datetime.strptime(text, pattern).date()
        except ValueError:
            continue
    return None
