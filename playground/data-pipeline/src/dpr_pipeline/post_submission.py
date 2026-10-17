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
import re

from . import expiry, geo

SCHEMA_URL = (
    "https://theopensystemslab.github.io/digital-planning-data-schemas/"
    "@next/schemas/postSubmissionPublishedApplication.json"
)

#: The standard allows four characters, so councils get a short code rather than their name.
ORGANISATION_CODES = {"camden": "CMDN", "barnet": "BNT"}

#: What the standard accepts for an application's stage and status.
STAGES = ("submission", "validation", "consultation", "assessment", "appeal", "highCourtAppeal")
STATUSES = ("returned", "withdrawn", "determined", "undetermined")
DETERMINED = "determined"
UNDETERMINED = "undetermined"
RETURNED = "returned"
WITHDRAWN = "withdrawn"

#: What the standard accepts for a decision or recommendation, and an appeal decision.
DECISIONS = ("granted", "refused")
APPEAL_DECISIONS = ("allowed", "dismissed", "splitDecision", "withdrawn")

#: Council wording that means each outcome. Matched as lower case fragments, so "Granted",
#: "Grant with conditions" and "Permitted" all land on granted. Anything not matched is left
#: out and reported rather than guessed.
_DECISION_WORDS = (
    ("refused", ("refus", "reject", "dismiss")),
    ("granted", ("grant", "permit", "approv", "no objection", "no further action")),
)


def clean_reference(reference: str) -> str:
    """A reference using only a-z, A-Z, 0-9 and the hyphen, which is all the standard's routes take.

    Council references are full of slashes and spaces (2018/2267/P), so each run of anything else
    becomes one hyphen: 2018-2267-P. The original stays in bronze, untouched.
    """
    return re.sub(r"[^A-Za-z0-9]+", "-", reference or "").strip("-")


def normalise_decision(text: str | None) -> str | None:
    """A council's decision wording as the standard's granted or refused, or None if unclear."""
    lowered = (text or "").strip().lower()
    if not lowered or "withdraw" in lowered or "split" in lowered:
        return None
    for outcome, fragments in _DECISION_WORDS:
        if any(fragment in lowered for fragment in fragments):
            return outcome
    return None


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
    is_valid: bool | None = None,
    decision: str | None = None,
    expiry_date: dt.date | None = None,
    decision_notice_url: str | None = None,
    recommendation: str | None = None,
    committee_sent_at: dt.date | None = None,
    committee_decision: str | None = None,
    committee_decided_at: dt.date | None = None,
    consultation: dict | None = None,
    appeal: dict | None = None,
    withdrawn_at: dt.date | None = None,
    withdrawn_reason: str | None = None,
    applicant_name: str | None = None,
    address: str | None = None,
    description: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
    boundary: dict | None = None,
    easting: float | None = None,
    northing: float | None = None,
    estimate_expiry: bool = False,
) -> dict:
    """A post submission published record, with only what the source can honestly fill.

    The first block of arguments is what a legacy export always has. Everything after
    generated_at is optional, so a source that has more (a committee date, an appeal) passes it and
    one that has less simply leaves it out.

    decision and recommendation are the standard's own words, granted or refused. Use
    normalise_decision to get there from a council's wording.
    appeal takes lodged, reason, validated, started, decided and decision.
    consultation takes start, end and site_notice.
    applicant_name, address, description, the coordinates, easting and northing and boundary fill the submission block,
    which holds only those three parts of the original application (see _submission).
    """
    generated_at = generated_at or dt.datetime.now(dt.timezone.utc)
    reference = clean_reference(reference)

    assessment = _assessment(
        decided_at, decision, expiry_date, decision_notice_url, recommendation,
        committee_sent_at, committee_decision, committee_decided_at,
    )
    if assessment and "expiryDate" not in assessment and estimate_expiry:
        # A temporary stand in, see expiry.py. Only where an assessment exists already, so it
        # never turns a validated application into one being assessed.
        estimated = expiry.estimate(application_type, received_at or validated_at)
        if estimated:
            assessment["expiryDate"] = _day(estimated)
    decided = decided_at is not None or bool(decision or committee_decision)

    withdrawn = bool(withdrawn_at or withdrawn_reason)

    if is_valid is False:
        stage, status = "validation", RETURNED
    elif appeal and appeal.get("lodged"):
        # An appeal is against a decision, so the application is determined whatever the appeal
        # itself says.
        stage, status = "appeal", DETERMINED
    elif decided:
        stage, status = "assessment", DETERMINED
    elif assessment:
        stage, status = "assessment", UNDETERMINED
    else:
        stage, status = "validation", UNDETERMINED

    if withdrawn:
        # Withdrawn can happen at any stage before a decision, so the stage stays where it got to
        # and only the status says the application is over.
        status = WITHDRAWN

    application = {
        "reference": reference,
        "stage": stage,
        "status": status,
        "publishedAt": _stamp(decided_at or validated_at or received_at, generated_at),
    }
    if withdrawn:
        application["withdrawnAt"] = _stamp(withdrawn_at, generated_at)
        if withdrawn_reason:
            application["withdrawnReason"] = withdrawn_reason

    data: dict = {
        "application": application,
        "localPlanningAuthority": {
            # Historic records are closed, so comments are not being taken on them.
            "publicCommentsAcceptedUntilDecision": False,
        },
        "submission": {"submittedAt": _stamp(received_at, generated_at)},
        "validation": {
            "receivedAt": _stamp(received_at, generated_at),
            "validatedAt": _stamp(validated_at or received_at, generated_at),
            "isValid": (validated_at is not None) if is_valid is None else is_valid,
        },
        "caseOfficer": {"name": officer_name or "Not recorded"},
    }
    if consultation and consultation.get("start") and consultation.get("end"):
        data["consultation"] = {
            "startDate": _day(consultation["start"]),
            "endDate": _day(consultation["end"]),
            "siteNotice": bool(consultation.get("site_notice", False)),
        }
    if assessment and stage in ("assessment", "appeal"):
        data["assessment"] = assessment
    if appeal and appeal.get("lodged"):
        data["appeal"] = _appeal(appeal)

    return {
        "applicationType": application_type,
        "data": data,
        "submission": _submission(application_type, applicant_name, address, description,
                                  latitude, longitude, boundary, easting, northing),
        "metadata": {
            "organisation": ORGANISATION_CODES.get(council, council[:4].upper()),
            "id": reference,
            "submittedAt": _stamp(received_at, generated_at),
            "generatedAt": generated_at.isoformat().replace("+00:00", "Z"),
            "schema": SCHEMA_URL,
        },
    }


def _submission(application_type, applicant_name, address, description,
                latitude, longitude, boundary, easting=None, northing=None) -> dict:
    """The original submission, as far as a legacy export can rebuild it.

    A real submission is a whole PlanX application. What is wanted here is the part a register
    shows: who applied, where, and for what. Anything the source does not have is left out rather
    than filled in, so a council that holds a site boundary passes it and one that does not simply
    has no boundary key.
    """
    applicant: dict = {}
    if applicant_name:
        *first, last = applicant_name.split()
        applicant["name"] = {"first": " ".join(first), "last": last}

    prop: dict = {}
    if address:
        # singleLine is the order survey style, title the proposed style, so either reader finds it.
        place: dict = {"singleLine": address, "title": address}
        if latitude is not None and longitude is not None:
            place["latitude"], place["longitude"] = latitude, longitude
        if easting is not None and northing is not None:
            place["x"], place["y"] = easting, northing
        prop["address"] = place
    if not boundary and latitude is not None and longitude is not None:
        # Only a point is held, so the site is a small square around it (see geo.py).
        boundary = geo.site_boundary(latitude, longitude)
    if boundary:
        prop["boundary"] = boundary

    data: dict = {}
    if applicant:
        data["applicant"] = applicant
    if prop:
        data["property"] = prop
    if description:
        data["proposal"] = {"description": description}
    return {"applicationType": application_type, "data": data}


def _assessment(decided_at, decision, expiry_date, notice_url, recommendation,
                committee_sent_at, committee_decision, committee_decided_at) -> dict:
    block: dict = {}
    if expiry_date:
        block["expiryDate"] = _day(expiry_date)
    if recommendation in DECISIONS:
        block["planningOfficerRecommendation"] = recommendation
    if committee_sent_at:
        block["committeeSentDate"] = _day(committee_sent_at)
    if committee_decision in DECISIONS:
        block["committeeDecision"] = committee_decision
        if committee_decided_at or decided_at:
            block["committeeDecisionDate"] = _day(committee_decided_at or decided_at)
    elif decision in DECISIONS:
        block["planningOfficerDecision"] = decision
        if decided_at:
            block["planningOfficerDecisionDate"] = _day(decided_at)
    if notice_url and (decision in DECISIONS or committee_decision in DECISIONS):
        block["decisionNotice"] = {"url": notice_url}
    return block


def _appeal(appeal: dict) -> dict:
    block: dict = {
        "lodgedDate": _day(appeal["lodged"]),
        # The standard requires a reason, and a legacy export rarely has one.
        "reason": appeal.get("reason") or "Not recorded",
    }
    for key, field in (("validated", "validatedDate"), ("started", "startedDate"),
                       ("decided", "decisionDate")):
        if appeal.get(key):
            block[field] = _day(appeal[key])
    if appeal.get("decision") in APPEAL_DECISIONS:
        block["decision"] = appeal["decision"]
    return block


def _day(value: dt.date | str) -> str:
    """The standard's date, YYYY-MM-DD."""
    return value if isinstance(value, str) else value.isoformat()


def _stamp(date: dt.date | None, fallback: dt.datetime) -> str:
    """The standard wants a date and time, a legacy export usually has only a date."""
    if date is None:
        return fallback.isoformat().replace("+00:00", "Z")
    return dt.datetime(date.year, date.month, date.day, tzinfo=dt.timezone.utc).isoformat().replace(
        "+00:00", "Z"
    )
