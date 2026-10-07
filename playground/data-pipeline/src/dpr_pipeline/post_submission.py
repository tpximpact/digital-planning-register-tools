"""Building a record in the shape the standard actually expects.

Both mappers end here, which is why the two councils come out identical.

One thing is worth stating plainly, because it shapes everything else. The post submission
published standard expects a `submission` block: the original application as it was submitted,
which in practice means a PlanX submission. Legacy records do not have one. Barnet never had it,
and Camden's open data does not carry it either. So a council's historic data can satisfy the
published shape but not the submission inside it, and that gap is recorded per record rather than
filled with something invented.

The descriptive fields a council does have, the address, the description, the applicant and the
officer, are kept in columns beside the record, so nothing useful is lost and nothing is smuggled
into a schema that does not have a place for it.
"""

from __future__ import annotations

import datetime as dt

SCHEMA_URL = (
    "https://theopensystemslab.github.io/digital-planning-data-schemas/"
    "@next/schemas/postSubmissionPublishedApplication.json"
)

#: The standard allows four characters, so councils get a short code rather than their name.
ORGANISATION_CODES = {"camden": "CMDN", "barnet": "BNT"}

#: What the standard accepts for an application's stage and status.
STAGES = ("submission", "validation", "consultation", "assessment", "appeal")
DETERMINED = "determined"
UNDETERMINED = "undetermined"


def build(
    *,
    council: str,
    application_type: str,
    reference: str,
    received_at: dt.date | None,
    validated_at: dt.date | None,
    decided_at: dt.date | None,
    officer_name: str,
    generated_at: dt.datetime | None = None,
) -> dict:
    """A post submission published record, with only what a legacy export can honestly fill."""
    generated_at = generated_at or dt.datetime.now(dt.timezone.utc)
    decided = decided_at is not None

    return {
        "applicationType": application_type,
        "data": {
            "application": {
                "reference": reference,
                "stage": "assessment" if decided else "validation",
                "status": DETERMINED if decided else UNDETERMINED,
                "publishedAt": _stamp(decided_at or validated_at or received_at, generated_at),
            },
            "localPlanningAuthority": {
                # Historic records are closed, so comments are not being taken on them.
                "publicCommentsAcceptedUntilDecision": False,
            },
            "submission": {"submittedAt": _stamp(received_at, generated_at)},
            "validation": {
                "receivedAt": _stamp(received_at, generated_at),
                "validatedAt": _stamp(validated_at or received_at, generated_at),
                "isValid": validated_at is not None,
            },
            "caseOfficer": {"name": officer_name or "Not recorded"},
        },
        "metadata": {
            "organisation": ORGANISATION_CODES.get(council, council[:4].upper()),
            "id": reference,
            "submittedAt": _stamp(received_at, generated_at),
            "generatedAt": generated_at.isoformat().replace("+00:00", "Z"),
            "schema": SCHEMA_URL,
        },
    }


def _stamp(date: dt.date | None, fallback: dt.datetime) -> str:
    """The standard wants a date and time, a legacy export usually has only a date."""
    if date is None:
        return fallback.isoformat().replace("+00:00", "Z")
    return dt.datetime(date.year, date.month, date.day, tzinfo=dt.timezone.utc).isoformat().replace(
        "+00:00", "Z"
    )
