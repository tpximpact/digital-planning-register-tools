"""What kind of problem a mapping issue actually is.

"Gap" was one word doing three jobs, and the three need different work from different people:

    missing     the council's export does not hold the value at all. No amount of reading the
                record produces one, so this is a question for the source system or the standard
    mismatch    the council holds a value and it does not agree with the standard. Somebody who
                knows planning has to say what their wording means
    excluded    the row is not a planning application, so it was deliberately left out of silver

The distinction matters because only `mismatch` can be resolved by a person reading records, which
is what the approval split is built on.

The kind is worked out from the reason the mapper recorded, in one place, so a mapper only has to
say what went wrong in plain words and does not have to classify it as well.
"""

from __future__ import annotations

MISSING = "missing"
MISMATCH = "mismatch"
EXCLUDED = "excluded"

KINDS = (MISSING, MISMATCH, EXCLUDED)

#: Fields that are missing by nature of a legacy export rather than by fault of one record.
_ALWAYS_MISSING = ("submission", "boundary", "location")


def classify(field: str, reason: str) -> str:
    """One of KINDS, from the field and the reason the mapper gave."""
    lowered = (reason or "").lower()

    if "left out of silver" in lowered or "not a planning application" in lowered:
        return EXCLUDED
    if field in _ALWAYS_MISSING:
        return MISSING
    if "no " in lowered and "fallback" not in lowered:
        # "no coordinates in the source record", "no original submission ..."
        return MISSING
    return MISMATCH
