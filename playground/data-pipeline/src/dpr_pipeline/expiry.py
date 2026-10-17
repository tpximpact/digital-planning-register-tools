"""A temporary stand in for the expiry date, which legacy exports do not carry.

The standard requires assessment.expiryDate. It is the date by which the council should have
decided, and councils hold it in their case system but do not publish it. Until a source supplies
the real date, this works one out: the submission date plus a number of days that depends on the
application type, using the usual statutory periods (8 weeks, 13 weeks for major, 16 weeks with an
environmental impact assessment).

It is an estimate. Every record that uses it is flagged in silver.mapping_issues as "estimated", so
it is easy to find and replace. A mapping that names a real source (opt_expiry) always wins.

Remove this module, and the call in mappers/common.py, once real dates arrive.
"""

from __future__ import annotations

import datetime as dt

#: Days after submission, matched against the start of the application type. Longest match wins.
PERIODS = (
    ("environmentalImpact", 112),
    ("pp.full.major", 91),
    ("pp.outline.major", 91),
    ("pp.mineralExtraction", 112),
    ("onshoreExtractionOilAndGas", 112),
    ("pa.part6", 56),
    ("pa", 56),
    ("ldc", 56),
    ("listed", 56),
    ("pp", 56),
)

#: Used when the type matches nothing above. Eight weeks is the usual period.
DEFAULT_DAYS = 56


def days_for(application_type: str) -> int:
    matches = [(len(prefix), days) for prefix, days in PERIODS
               if application_type == prefix or application_type.startswith(prefix)]
    return max(matches)[1] if matches else DEFAULT_DAYS


def estimate(application_type: str, submitted: dt.date | None) -> dt.date | None:
    """The submission date plus the period for the type, or None with no submission date."""
    if submitted is None:
        return None
    return submitted + dt.timedelta(days=days_for(application_type))
