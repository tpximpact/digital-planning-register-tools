"""Strange but true: things in a council's own data that cannot be right, or are hard to believe.

A register is built from whatever a council's case system holds, and that includes dates in the
wrong order, sites the size of a parking space, applicants called ".", and coordinates off the coast
of Africa. None of this is for this pipeline to fix, but all of it is worth knowing about before
anyone relies on the data, so it is counted and the worst examples are kept.

Each rule looks at one record, read through the council's own mapping so it works for any council
whose yaml names the field, and returns a sentence about it or None. The rules say nothing about
whose fault it is.

    scan(rows, mapping)              rows is (reference, source record); pure, no database
    scan_database(connection, name)  the same over a council's bronze layer
"""

from __future__ import annotations

import datetime as dt
import json
import re
from dataclasses import dataclass, field
from typing import Callable

from . import geo, post_submission

#: Greater London, roughly: south, west, north, east. Anything outside is somewhere else.
LONDON = (51.28, -0.52, 51.70, 0.34)

#: The Town and Country Planning Act, from which there are planning applications at all.
PLANNING_BEGINS = dt.date(1948, 7, 1)

PLACEHOLDERS = {"", ".", "-", "--", "n/a", "na", "none", "unknown", "tba", "tbc", "x", "xx", "test",
                "nil", "null"}

FOOTBALL_PITCH_HECTARES = 0.714
PARKING_SPACE_SQUARE_METRES = 12.0
LONG_WAIT_DAYS = 5 * 365
LONG_DESCRIPTION = 3000
GIANT_SITE_HECTARES = 10
TINY_SITE_SQUARE_METRES = 6
LOST_POINT_METRES = 100


@dataclass
class Facts:
    """One record, read through its council's mapping."""

    reference: str
    received: dt.date | None = None
    registered: dt.date | None = None
    validated: dt.date | None = None
    decided: dt.date | None = None
    expiry: dt.date | None = None
    latitude: float | None = None
    longitude: float | None = None
    geometry: dict | None = None
    applicant: str = ""
    description: str = ""
    decision: str = ""
    today: dt.date = field(default_factory=dt.date.today)

    @property
    def area(self) -> float | None:
        return geo.area_square_metres(self.geometry) if self.geometry else None


@dataclass
class Finding:
    fact: str
    size: float = 0.0      # how extreme, so the worst can be shown first


@dataclass
class Rule:
    id: str
    group: str
    title: str
    blurb: str
    check: Callable[[Facts], "Finding | None"]


def _days(later: dt.date, earlier: dt.date) -> int:
    return (later - earlier).days


def _n(count: float, one: str, many: str | None = None) -> str:
    whole = int(count)
    return f"{whole:,} {one if whole == 1 else (many or one + 's')}"


def _before(early_name: str, late_name: str, verb: str) -> Callable[[Facts], "Finding | None"]:
    def check(f: Facts) -> "Finding | None":
        early, late = getattr(f, early_name), getattr(f, late_name)
        if early and late and early < late:
            gap = _days(late, early)
            return Finding(f"{verb} {_n(gap, 'day')} before it was received "
                           f"({early.isoformat()} against {late.isoformat()})", gap)
        return None
    return check


def _from_the_future(f: Facts) -> "Finding | None":
    worst = None
    for name in ("received", "registered", "validated", "decided", "expiry"):
        value = getattr(f, name)
        if value and value > f.today:
            gap = _days(value, f.today)
            if worst is None or gap > worst.size:
                worst = Finding(f"the {name} date is {value.isoformat()}, "
                                f"{_n(gap, 'day')} from now", gap)
    return worst


def _older_than_planning(f: Facts) -> "Finding | None":
    worst = None
    for name in ("received", "registered", "validated", "decided"):
        value = getattr(f, name)
        if value and value < PLANNING_BEGINS:
            age = _days(PLANNING_BEGINS, value)
            if worst is None or age > worst.size:
                worst = Finding(f"the {name} date is {value.isoformat()}, "
                                f"{_n(age / 365.25, 'year')} before planning permission existed", age)
    return worst


def _decided_but_nothing_decided(f: Facts) -> "Finding | None":
    if f.decided and not f.decision:
        return Finding(f"has a decision date of {f.decided.isoformat()} and no decision", 1)
    return None


def _decision_with_no_date(f: Facts) -> "Finding | None":
    if f.decision and not f.decided and "withdraw" not in f.decision.lower():
        return Finding(f"was decided as “{f.decision}” on no recorded date", 1)
    return None


def _mystery_applicant(f: Facts) -> "Finding | None":
    name = f.applicant.strip()
    if name.lower() in PLACEHOLDERS or not re.search(r"[A-Za-z0-9]", name):
        return Finding(f"the applicant is “{name}”" if name else "has no applicant", 1)
    return None


def _lost_at_sea(f: Facts) -> "Finding | None":
    lat, lng = f.latitude, f.longitude
    if lat is None or lng is None:
        return None
    south, west, north, east = LONDON
    if south <= lat <= north and west <= lng <= east:
        return None
    centre = ((south + north) / 2, (west + east) / 2)
    away = geo.distance_metres(lat, lng, *centre) / 1000
    where = " (the middle of the Atlantic, off the coast of Africa)" if (lat, lng) == (0, 0) else ""
    return Finding(f"sits at {lat}, {lng}{where}, {_n(away, 'km')} from the middle of London", away)


def _missed_its_own_site(f: Facts) -> "Finding | None":
    if f.latitude is None or f.longitude is None or not f.geometry:
        return None
    inside = geo.contains(f.geometry, f.latitude, f.longitude)
    middle = geo.centre(f.geometry)
    if inside is None or inside or middle is None:
        return None
    away = geo.distance_metres(f.latitude, f.longitude, *middle)
    if away < LOST_POINT_METRES:
        return None
    return Finding(f"the point is {_n(away, 'metre')} from the middle of its own site, "
                   "and not inside it", away)


def _giant_site(f: Facts) -> "Finding | None":
    area = f.area
    if area is None or area / 10_000 < GIANT_SITE_HECTARES:
        return None
    hectares = area / 10_000
    return Finding(f"the site covers {hectares:,.1f} hectares, about "
                   f"{_n(hectares / FOOTBALL_PITCH_HECTARES, 'football pitch', 'football pitches')}",
                   hectares)


def _tiny_site(f: Facts) -> "Finding | None":
    area = f.area
    if area is None or not 0 < area < TINY_SITE_SQUARE_METRES:
        return None
    return Finding(f"the site is {area:.1f} square metres, "
                   f"{PARKING_SPACE_SQUARE_METRES / area:.1f} times smaller than a parking space",
                   TINY_SITE_SQUARE_METRES - area)


def _long_wait(f: Facts) -> "Finding | None":
    if f.received and f.decided and "withdraw" not in f.decision.lower():
        wait = _days(f.decided, f.received)
        if wait > LONG_WAIT_DAYS:
            return Finding(f"took {_n(wait / 365.25, 'year')} from received "
                           f"({f.received.isoformat()}) to decision ({f.decided.isoformat()})", wait)
    return None


def _war_and_peace(f: Facts) -> "Finding | None":
    length = len(f.description)
    if length < LONG_DESCRIPTION:
        return None
    return Finding(f"the description runs to {length:,} characters, about "
                   f"{_n(len(f.description.split()), 'word')}", length)


RULES = (
    Rule("expired-before-received", "Dates", "Expired before it arrived",
         "The expiry date is earlier than the date the application was received.",
         _before("expiry", "received", "expired")),
    Rule("decided-before-received", "Dates", "Decided before it was asked",
         "The decision date is earlier than the date the application was received.",
         _before("decided", "received", "was decided")),
    Rule("validated-before-received", "Dates", "Valid before it existed",
         "The valid-from date is earlier than the date the application was received.",
         _before("validated", "received", "became valid")),
    Rule("registered-before-received", "Dates", "Registered before it was received",
         "The registered date is earlier than the date the application was received.",
         _before("registered", "received", "was registered")),
    Rule("from-the-future", "Dates", "Postcards from the future",
         "A date that has not happened yet, on a record that is supposed to be history.",
         _from_the_future),
    Rule("older-than-planning", "Dates", "Older than the planning system",
         "A date before 1 July 1948, when the Town and Country Planning Act began.",
         _older_than_planning),
    Rule("the-very-long-wait", "Dates", "The very long wait",
         "More than five years between being received and being decided.", _long_wait),
    Rule("decided-nothing", "Decisions", "Decided, but decided what?",
         "There is a decision date and no decision.", _decided_but_nothing_decided),
    Rule("undated-decision", "Decisions", "A decision with no date",
         "There is a decision and no date for it (withdrawals excepted).", _decision_with_no_date),
    Rule("lost-at-sea", "Places", "Lost at sea",
         "Coordinates outside Greater London, including the famous 0, 0.", _lost_at_sea),
    Rule("missed-its-own-site", "Places", "The point that missed its site",
         "The point is more than 100 metres from the middle of the site boundary and not inside it.",
         _missed_its_own_site),
    Rule("giant-site", "Places", "A site the size of a small town",
         "A site boundary of ten hectares or more.", _giant_site),
    Rule("tiny-site", "Places", "Smaller than a parking space",
         "A site boundary under six square metres.", _tiny_site),
    Rule("mystery-applicant", "People and words", "The mysterious applicant",
         "An applicant that is blank, or only punctuation or a placeholder such as “.”.",
         _mystery_applicant),
    Rule("war-and-peace", "People and words", "War and Peace",
         "A description of 3,000 characters or more.", _war_and_peace),
)

TWINS = Rule("identical-twins", "Records", "Identical twins",
             "Different references that become the same one once spaces and slashes are tidied.",
             lambda f: None)


def facts_for(mapping, source: dict, reference: str, today: dt.date | None = None) -> Facts:
    """A record through the council's mapping: whatever the yaml names, and nothing it does not."""

    def number(name: str):
        try:
            return float(mapping.raw(source, name))
        except ValueError:
            return None

    def date(name: str):
        return mapping.get(source, name) if mapping.has(name) else None

    return Facts(
        reference=reference,
        received=date("received"), registered=date("registered"), validated=date("validated"),
        decided=date("decided"), expiry=date("opt_expiry"),
        latitude=number("latitude"), longitude=number("longitude"),
        geometry=mapping.object(source, "opt_boundary"),
        applicant=mapping.raw(source, "applicant"),
        description=mapping.raw(source, "description"),
        decision=mapping.wording(source, "decision"),
        today=today or dt.date.today(),
    )


def scan(rows, mapping, limit: int = 5, today: dt.date | None = None,
         rules: tuple[Rule, ...] = RULES) -> dict:
    """Run every rule over (reference, source record) pairs and report what turned up.

    Each oddity has its count and its most extreme examples first. Rules with nothing to report are
    listed under "clean" so a quiet dataset is visible as quiet.
    """
    today = today or dt.date.today()
    found: dict[str, list[tuple[float, str, str]]] = {rule.id: [] for rule in rules}
    cleaned: dict[str, list[str]] = {}
    scanned = unreadable = 0

    for reference, source in rows:
        scanned += 1
        cleaned.setdefault(post_submission.clean_reference(reference), []).append(reference)
        try:
            facts = facts_for(mapping, source, reference, today)
            findings = [(rule, rule.check(facts)) for rule in rules]
        except Exception:  # a record this strange is a finding of its own, but not a crash
            unreadable += 1
            continue
        for rule, finding in findings:
            if finding:
                found[rule.id].append((finding.size, reference, finding.fact))

    oddities = []
    for rule in rules:
        hits = sorted(found[rule.id], key=lambda hit: (-hit[0], hit[1]))
        oddities.append(_entry(rule, len(hits), [(ref, fact) for _, ref, fact in hits[:limit]]))

    twins = {clean: refs for clean, refs in cleaned.items() if len(set(refs)) > 1}
    oddities.append(_entry(TWINS, len(twins), [
        (clean, f"{_n(len(set(refs)), 'reference')} become this one: "
                + ", ".join(sorted(set(refs))[:4])) for clean, refs in sorted(twins.items())[:limit]]))

    return {
        "council": mapping.council,
        "scanned": scanned,
        "unreadable": unreadable,
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
        "oddities": [o for o in oddities if o["count"]],
        "clean": [o["title"] for o in oddities if not o["count"]],
    }


def _entry(rule: Rule, count: int, examples: list[tuple[str, str]]) -> dict:
    return {"id": rule.id, "group": rule.group, "title": rule.title, "blurb": rule.blurb,
            "count": count, "examples": [{"reference": r, "fact": f} for r, f in examples]}


def scan_database(connection, council: str, limit: int = 5, today: dt.date | None = None) -> dict:
    """Scan a council's bronze layer, the data exactly as the council sent it."""
    from .mappers.common import Mapping

    mapping = Mapping.load(council)
    cursor = connection.execute(
        "SELECT reference, record FROM bronze.applications WHERE council = ?", [council])
    rows = ((reference, json.loads(record) if isinstance(record, str) else record)
            for reference, record in cursor.fetchall())
    return scan(rows, mapping, limit=limit, today=today)
