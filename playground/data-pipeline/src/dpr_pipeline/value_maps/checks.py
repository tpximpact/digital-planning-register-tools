"""Check a table of mappings. Pure functions, so the command line and the admin agree.

A source value can have more than one row (one source type sometimes fits two standard types), so
the unit of judgement is the value: unmapped if none of its rows has a target, invalid if any row
is wrong, otherwise mapped.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .library import CHECK_MARK, NO_FIT_MARK, Library, Table


@dataclass
class Check:
    table: Table
    total: int = 0
    mapped: int = 0
    unmapped: list[dict] = field(default_factory=list)   # {value, text}
    invalid: list[dict] = field(default_factory=list)    # {value, text, problem}
    review: int = 0                                       # values with a [check] note
    no_fit: list[dict] = field(default_factory=list)      # left empty on purpose, noted [no fit]
    unused: list[str] = field(default_factory=list)       # standard values nothing maps to

    @property
    def resolved(self) -> int:
        """Values that are finished: mapped, or deliberately left with no fit."""
        return self.mapped + len(self.no_fit)

    @property
    def ok(self) -> bool:
        return not self.unmapped and not self.invalid

    @property
    def blocking(self) -> bool:
        """Only the required tables fail a run. The others are reported and left to be finished."""
        return self.table.required and not self.ok

    def summary(self) -> dict:
        return {"id": self.table.id, "label": self.table.label, "group": self.table.group,
                "required": self.table.required, "total": self.total, "mapped": self.mapped,
                "noFit": len(self.no_fit), "resolved": self.resolved, "unmapped": len(self.unmapped), "invalid": len(self.invalid),
                "review": self.review, "unused": len(self.unused), "ok": self.ok}


def _problems(items: list[dict], allowed: set[str]) -> dict[int, str]:
    """Why individual rows are wrong, by their position in items."""
    problems, seen = {}, set()
    for position, item in enumerate(items):
        if not item["offered"]:
            problems[position] = "the source no longer offers this value"
        elif item["target"] and item["target"] not in allowed:
            problems[position] = f"'{item['target']}' is not a value the standard accepts"
        elif item["target"] and (item["value"], item["target"]) in seen:
            problems[position] = "the same mapping is listed twice"
        if item["target"]:
            seen.add((item["value"], item["target"]))
    return problems


def _no_fit(items: list[dict], positions: list[int]) -> bool:
    return any(items[p]["notes"].strip().startswith(NO_FIT_MARK) for p in positions)


def _groups(items: list[dict]) -> dict[str, list[int]]:
    groups: dict[str, list[int]] = {}
    for position, item in enumerate(items):
        groups.setdefault(item["value"], []).append(position)
    return groups


def _review(items: list[dict], positions: list[int]) -> bool:
    return any(items[p]["target"] and items[p]["notes"].strip().startswith(CHECK_MARK)
               for p in positions)


def check(library: Library, table: Table) -> Check:
    allowed = set(library.targets(table.target))
    items = library.merged(table)
    problems = _problems(items, allowed)
    result = Check(table=table)
    used: set[str] = set()

    for value, positions in _groups(items).items():
        first = items[positions[0]]
        if first["offered"]:
            result.total += 1
        wrong = [p for p in positions if p in problems]
        if wrong:
            result.invalid += [{"value": value, "text": items[p]["text"],
                                "problem": problems[p]} for p in wrong]
        elif not any(items[p]["target"] for p in positions):
            found = {"value": value, "text": first["text"]}
            (result.no_fit if _no_fit(items, positions) else result.unmapped).append(found)
        else:
            result.mapped += 1
            used.update(items[p]["target"] for p in positions if items[p]["target"])
            result.review += _review(items, positions)

    result.unused = sorted(allowed - used)
    return result


def view(library: Library, table: Table) -> dict:
    """Everything the admin page needs for one table. Every row carries the state of its value:
    invalid for the rows that are wrong, otherwise unmapped, nofit, review or mapped."""
    targets = library.targets(table.target)
    items = library.merged(table)
    problems = _problems(items, set(targets))
    rows = [None] * len(items)
    for value, positions in _groups(items).items():
        if any(p in problems for p in positions):
            group_state = None
        elif not any(items[p]["target"] for p in positions):
            group_state = "nofit" if _no_fit(items, positions) else "unmapped"
        else:
            group_state = "review" if _review(items, positions) else "mapped"
        for p in positions:
            rows[p] = {**items[p], "problem": problems.get(p),
                       "state": "invalid" if p in problems else (group_state or "mapped")}
    result = check(library, table)
    return {"table": {"id": table.id, "label": table.label, "group": table.group,
                      "required": table.required, "sourceKey": table.source_key,
                      "target": table.target},
            "rows": rows, "targets": targets, "unused": result.unused,
            "summary": result.summary()}
