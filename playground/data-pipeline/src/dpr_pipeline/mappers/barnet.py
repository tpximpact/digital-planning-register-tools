"""Barnet, bronze into silver.

Uniform spreads an application across several tables with short, coded column names, so this mapper
looks nothing like Camden's even though it produces exactly the same shape. That is the point of
the split: one module per council, everything around it shared.

The codes, and where each value sits in the tables, are in mappings/barnet.yaml. A real schema will
correct some of them, and when it does, only that file changes.
"""

from __future__ import annotations

from .. import application_types
from . import common

COUNCIL = "barnet"
MAPPING = common.Mapping.load(COUNCIL)

# The code tables live in the yaml. These names stay for anything that imported them.
TYPE_CODES = MAPPING.lookups["type"]
DECISION_CODES = MAPPING.lookups["decision"]
STATUS_CODES = MAPPING.lookups["status"]

_as_date = common.as_date


def map_all(connection) -> tuple[int, int]:
    """Convert every bronze row for Barnet. Returns records written and issues found."""
    return common.map_all(connection, COUNCIL, map_record)


def map_record(source: dict) -> common.MapResult:
    """One Uniform application, spread across tables, into the standard."""
    issues: list[common.Issue] = []

    code = MAPPING.raw(source, "type")
    application_type = TYPE_CODES.get(code)
    if not application_type:
        application_type = application_types.LAST_RESORT
        issues.append(("APPTYPE", code, f"unknown Uniform code, put on {application_type}"))

    status_code = MAPPING.raw(source, "status")
    decision_code = MAPPING.raw(source, "decision")
    if status_code and not MAPPING.knows("status", status_code):
        issues.append(("STATUS", status_code, "unknown Uniform status code"))
    if decision_code and not MAPPING.knows("decision", decision_code):
        issues.append(("DECISION", decision_code, "unknown Uniform decision code"))
    if not source.get("PROPOSALS"):
        issues.append(("PROPOSALS", None, "no proposal row for this application"))
    if not source.get("ADDRESSES"):
        issues.append(("ADDRESSES", None, "no address row for this application"))

    issues.append(("submission", None,
                   "no original submission for a historic record, only the applicant, address and description"))
    issues.append(("boundary", None, "Uniform export holds a coordinate only, no site boundary"))

    # Uniform marks an application it found invalid in its status.
    record = common.build_record(
        COUNCIL, MAPPING, source, application_type, issues,
        is_valid=False if status_code == "INV" else None,
    )

    return record, issues, common.beside(
        MAPPING, source,
        status=MAPPING.wording(source, "status"),
        decision=MAPPING.wording(source, "decision"),
        source_application_type=code,
        mapped_by="code table",
        # Barnet cannot share real records yet, so this is a stand in. Never let it pass for
        # the real thing.
        made_up_data=True,
    )
