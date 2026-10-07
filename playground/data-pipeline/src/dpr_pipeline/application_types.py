"""The valid application types in the standard, and how Camden's wording reaches them.

Two kinds of mapping live here, kept apart on purpose:

  AGREED    a Camden type that has a clear equivalent in the standard
  FALLBACK  a Camden type put on the nearest valid type so the record is usable

A record with no application type fails the schema, so an empty value is not an option. A guessed
value that looks agreed is worse than a visible guess, so every fallback is recorded as a mapping
issue and Camden's own wording is kept beside it in the record.

Accuracy is not the goal at this stage: the point is a valid record the register can display.
The standard supports all 95 types. An earlier converter only filled in ten, because the research
behind it had covered three application types.
"""

from __future__ import annotations

import json
from pathlib import Path

_DATA = Path(__file__).parent / "data" / "application_types.json"

#: Every application type the standard accepts. Refresh with scripts/refresh_application_types.py
VALID: frozenset[str] = frozenset(json.loads(_DATA.read_text(encoding="utf-8")))

#: Camden wording with a clear equivalent, taken from an earlier converter.
AGREED = {
    "Advertisement Consent": "advertConsent",
    "Application for Works to Tree(s) covered by a TPO": "wtt.consent",
    "Approval of Details": "approval.conditions",
    "Approval of Details (Conservation Area Consent)": "approval.conditions",
    "Approval of Details (Listed Building)": "approval.conditions",
    "Approval of Reserved Matters": "approval.reservedMatters",
    "Certificate of Lawfulness (Existing)": "ldc.existing",
    "Certificate of Lawfulness of Proposed Works to a Listed Building": "ldc.listedBuildingWorks",
    "Certificate of Lawfulness (Proposed)": "ldc.proposed",
    "Full Planning Permission": "pp.full.minor",
}

#: Camden wording put on the nearest valid type. Each one is a judgement, not an agreement.
FALLBACK = {
    "Householder Application": "pp.full.householder",
    "Listed Building Consent": "listed",
    "Listed Building Consent (Demolition)": "listed",
    "Councils Own Listed Building Consent": "listed",
    "Renewal of Listed Building Consent": "listed",
    "Listed Building Heritage Partnership Agreement": "listed",
    "Conservation Area Consent": "listed",
    "Councils Own Conservation Area Consent": "listed",
    "Renewal of Conservation Area Consent": "listed",
    "Outline Planning Permission": "pp.outline",
    "Permission in Principle": "pp.pip",
    "Non Material Amendments": "amendment.nonMaterial",
    "Variation or Removal of Condition(s)": "amendment.minorMaterial",
    "Renewal of Full Planning Permission": "pp.full.minor",
    "Resubmission of Full Planning Permission": "pp.full.minor",
    "Councils Own Permission Under Regulation 3": "pp.full.minor",
    "Councils Own Permission Under Regulation 4": "pp.full.minor",
    "Councils Own Approval of Details": "approval.conditions",
    "Councils Own Approval of Details (Listed Building)": "approval.conditions",
    "Notification of Intended Works to Tree(s) in a Conservation Area": "wtt.notice",
    "(CA) Notification of Emergency Works to Dead/Dangerous Tree(s)": "wtt.notice",
    "Certificate of Appropriate Alternative Development": "ldc.proposed",
    "Request for Scoping Opinion": "environmentalImpact.scoping",
    "Request for Screening Opinion": "environmentalImpact.screening",
    "Development Consent Order": "pp.full.major",
    "GPDO Prior Approval Class A Householder extensions": "pa.part1.classA",
    "GPDO Prior Approval Class D Commercial 2 year change of use": "pa.part3.classT",
    "GPDO Prior Approval Class IA change of use of A1/A2 to C3": "pa.part3.classMA",
    "GPDO Prior Approval Class M change of use of A1/A2 to C3": "pa.part3.classM",
    "GPDO Prior Approval Class J Change of use of A1 to D2": "pa.part3.classM",
    "GPDO Prior Approval Class K change of use of B1/C1/C2/C2A/D2 to registered nursery":
        "pa.part3.classS",
    "GPDO Prior Approval Class O Change of use B1 to C3": "pa.part3.classMA",
    "GPDO Prior Approval Class PA Change of use B1 to C3": "pa.part3.classMA",
    "GPDO Prior Approval Class P Change of use of B8 to C3": "pa.part3.classM",
    "GPDO Prior Approval Class T Change of use of B1/C1/C2/C2A/C2 to state-funded school or nursery (D1)":
        "pa.part3.classT",
    "GPDO notification Class DA temporary change of use A3/A4 to A5": "pa.part4.classE",
    "GPDO Prior Approval of Demolition": "pa.part11.classB",
    "GPDO Prior Approval Determination": "pa.part1.classA",
    "GPDO Notification": "pa.part1.classA",
}

#: Camden types that are not planning applications at all, so they are skipped rather than mapped.
NOT_AN_APPLICATION = {
    "Asset of Community Value Written Request",
    "Construction Management Plan Consultation",
    "DC Forum (Open)",
    "High Hedge Mediation",
    "Request for Observations to Adjoining Borough",
    "S106 Deed of Variation",
}

#: Used when nothing above matches. There is no bare "pp.full" in the standard, only the sized
#: variants, so the minor one stands in as the ordinary case. The earlier converter used "pp.full",
#: which is not a valid value and would have failed the schema.
LAST_RESORT = "pp.full.minor"


def resolve(camden_type: str) -> tuple[str, str]:
    """Return an application type and how it was reached.

    The second value is one of: agreed, fallback, last resort, not an application.
    """
    wording = (camden_type or "").strip()

    if not wording:
        return LAST_RESORT, "last resort"
    if wording in AGREED:
        return AGREED[wording], "agreed"
    if wording in NOT_AN_APPLICATION:
        return LAST_RESORT, "not an application"
    if wording in FALLBACK:
        return FALLBACK[wording], "fallback"
    return LAST_RESORT, "last resort"


def unknown_targets() -> set[str]:
    """Any mapping target that is not in the standard. Should always be empty."""
    targets = set(AGREED.values()) | set(FALLBACK.values()) | {LAST_RESORT}
    return targets - VALID
