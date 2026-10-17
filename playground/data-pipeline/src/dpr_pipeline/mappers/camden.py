"""Camden, bronze into silver.

The field names come from an earlier converter written for the register's open data handler. That one targets the register's old DprPlanningApplication type rather than the
post submission standard, so the source fields carry over but the shape here is different.

Application types are resolved in application_types.py, which also records whether a type was an
agreed equivalent or a fallback.

Where each value lives in Camden's record is in mappings/camden.yaml. This file keeps only what is
Camden's alone: which rows are not applications, and how a type resolves.

Anything this mapper cannot place is written to silver.mapping_issues rather than dropped, so the
size of the gap stays visible instead of turning into silent nulls.
"""

from __future__ import annotations

from .. import application_types
from . import common

COUNCIL = "camden"
MAPPING = common.Mapping.load(COUNCIL)

# Kept so callers of the old module level helpers keep working.
_as_date = common.as_date


def map_all(connection) -> tuple[int, int]:
    """Convert every bronze row for Camden. Returns records written and issues found."""
    return common.map_all(connection, COUNCIL, map_record, skip=_skip)


def _skip(source: dict):
    # Some Camden rows are not planning applications at all, for example a request for
    # observations from a neighbouring borough. Publishing those as permissions would be wrong,
    # so they are left out of silver and recorded instead.
    camden_type = MAPPING.raw(source, "type")
    if camden_type in application_types.NOT_AN_APPLICATION:
        return ("application_type", camden_type, "not a planning application, left out of silver")
    return None


def map_record(source: dict) -> common.MapResult:
    """One Camden record into the standard, plus the gaps and the fields kept beside it."""
    issues: list[common.Issue] = []

    camden_type = MAPPING.raw(source, "type")
    application_type, how = application_types.resolve(camden_type)
    if how != "agreed":
        issues.append(("application_type", camden_type,
                       f"put on {application_type} by {how}, not an agreed equivalent"))

    status = MAPPING.raw(source, "status")
    if status:
        issues.append(("system_status", status, "council wording, not yet mapped to ODP status"))

    record = common.build_record(COUNCIL, MAPPING, source, application_type, issues)

    # The standard wants the original submission, which legacy data does not have.
    issues.append(("submission", None,
                   "no original submission for a historic record, only the applicant, address and description"))
    if not MAPPING.raw(source, "latitude"):
        issues.append(("location", None, "no coordinates in the source record"))
    else:
        issues.append(("boundary", None, "source has a point only, so the site is a 10m square around it, not the real boundary"))

    return record, issues, common.beside(
        MAPPING, source,
        status=status,
        decision=MAPPING.raw(source, "decision"),
        source_application_type=camden_type,
        mapped_by=how,
    )

