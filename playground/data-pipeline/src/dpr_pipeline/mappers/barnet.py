"""Barnet, bronze into silver.

Uniform spreads an application across several tables with short, coded column names, so this mapper
looks nothing like Camden's even though it produces exactly the same shape. That is the point of
the split: one module per council, everything around it shared.

The codes below are the ones in common use in Uniform. A real schema will correct some of them,
and when it does, only this file changes.
"""

from __future__ import annotations

import datetime as dt
import json

from .. import application_types, post_submission

COUNCIL = "barnet"

#: Uniform application type codes. An existing integration covers the same ground.
TYPE_CODES = {
    "FUL": "pp.full.minor",
    "MAJ": "pp.full.major",
    "HSE": "pp.full.householder",
    "LBC": "listed",
    "CAC": "listed",
    "OUT": "pp.outline",
    "RES": "approval.reservedMatters",
    "ADV": "advertConsent",
    "CLE": "ldc.existing",
    "CLP": "ldc.proposed",
    "PNH": "pa.part1.classA",
    "TPO": "wtt.consent",
    "NMA": "amendment.nonMaterial",
}

#: Uniform decision codes, expanded into Barnet's own wording rather than the standard's.
DECISION_CODES = {
    "GTD": "Granted",
    "PER": "Permitted",
    "REF": "Refused",
    "WDN": "Withdrawn",
    "SPL": "Split decision",
    "NOB": "No objection",
}

STATUS_CODES = {
    "DC": "Decided",
    "PEN": "Pending",
    "REG": "Registered",
    "INV": "Invalid",
}


def map_all(connection) -> tuple[int, int]:
    """Convert every bronze row for Barnet. Returns records written and issues found."""
    rows = connection.execute(
        "SELECT reference, record FROM bronze.applications WHERE council = ?", [COUNCIL]
    ).fetchall()

    mapped_at = dt.datetime.now(dt.timezone.utc)
    records: list[tuple] = []
    issues: list[tuple] = []

    for reference, raw in rows:
        source = json.loads(raw) if isinstance(raw, str) else raw
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
    """One Uniform application, spread across tables, into the standard."""
    issues: list[tuple[str, str | None, str]] = []

    application = source.get("APPLICATIONS") or {}
    proposal = source.get("PROPOSALS") or {}
    address = source.get("ADDRESSES") or {}

    code = (application.get("APPTYPE") or "").strip().upper()
    application_type = TYPE_CODES.get(code)
    if not application_type:
        application_type = application_types.LAST_RESORT
        issues.append(("APPTYPE", code, f"unknown Uniform code, put on {application_type}"))

    reference = (application.get("REFVAL") or "").strip()
    status_code = (application.get("STATUS") or "").strip().upper()
    decision_code = (application.get("DECISION") or "").strip().upper()

    if status_code and status_code not in STATUS_CODES:
        issues.append(("STATUS", status_code, "unknown Uniform status code"))
    if decision_code and decision_code not in DECISION_CODES:
        issues.append(("DECISION", decision_code, "unknown Uniform decision code"))
    if not proposal:
        issues.append(("PROPOSALS", None, "no proposal row for this application"))
    if not address:
        issues.append(("ADDRESSES", None, "no address row for this application"))

    issues.append(("submission", None,
                   "no original submission for a historic record, only the dates it was received"))
    issues.append(("boundary", None, "Uniform export holds a coordinate only, no site boundary"))

    received = _as_date(application.get("RECEIVEDDATE"))
    validated = _as_date(application.get("VALIDDATE"))
    decided = _as_date(application.get("DECISIONDATE"))

    record = post_submission.build(
        council=COUNCIL,
        application_type=application_type,
        reference=reference,
        received_at=received,
        validated_at=validated,
        decided_at=decided,
        officer_name=(application.get("CASEOFFICER") or "").strip(),
    )

    beside = {
        "status": STATUS_CODES.get(status_code, status_code),
        "decision": DECISION_CODES.get(decision_code, decision_code),
        "valid_from": validated,
        "decided_at": decided,
        "address": _address(address),
        "description": (proposal.get("PROPOSAL") or "").strip(),
        "applicant": (application.get("APPLICANTNAME") or "").strip(),
        "officer": (application.get("CASEOFFICER") or "").strip(),
        "source_application_type": code,
        "mapped_by": "code table",
        # Barnet cannot share real records yet, so this is a stand in. Never let it pass for
        # the real thing.
        "made_up_data": True,
    }
    return record, issues, beside


def _address(address: dict) -> str:
    parts = [(address.get(field) or "").strip()
             for field in ("HOUSENUMBER", "STREET", "TOWN", "POSTCODE")]
    return " ".join(part for part in parts if part)


def _as_iso(value: str | None) -> str | None:
    date = _as_date(value)
    return date.isoformat() if date else None


def _as_date(value: str | None) -> dt.date | None:
    if not value:
        return None
    text = str(value).strip().replace("Z", "")
    for pattern in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return dt.datetime.strptime(text, pattern).date()
        except ValueError:
            continue
    return None
