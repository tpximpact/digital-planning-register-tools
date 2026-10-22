"""The folder of value mappers: tables that turn a source system's wording into the standard's.

    mappers/
      application_types/    MHCLG application types  ->  ODP application types
        mapping.csv           the table people fill in
        mhclg_types.json      every value the source offers
        mhclg_context.json    each one's name and description, to help whoever maps it
        odp_types.json        every value the standard accepts
      idox/
        idox_urls.txt         the Idox portals being mapped, one advanced search url per line
        odp_statuses.json     every status the standard accepts
        odp_decisions.json    every decision the standard accepts
        <portal domain>/
          idox_status.json, idox_decision.json, idox_caseType.json, idox_developmentType.json
          mapping_status.csv, mapping_decision.csv, mapping_caseType.csv

A table is one csv. Its source column lists the source's values, its odp_type column holds the
standard's value, and notes is free text. A note that starts with [check] marks a guess someone
wants a second opinion on.

Nothing in here is ever overwritten by a fetch: the csv files are written by people, so new source
values are added as blank rows and everything already filled in stays as it is.
"""

from __future__ import annotations

import csv
import json
import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

DEFAULT_ROOT = "mappers"
CHECK_MARK = "[check]"
NO_FIT_MARK = "[no fit]"   # an empty target on purpose: the standard has nothing for this value

#: Where each kind of target value is kept, relative to the mappers folder.
TARGET_FILES = {
    "application_type": "application_types/odp_types.json",
    "status": "idox/odp_statuses.json",
    "decision": "idox/odp_decisions.json",
}

#: The fields on an Idox advanced search page, and what each is called in the files.
IDOX_DROPDOWNS = {
    "status": "caseStatus",
    "decision": "caseDecision",
    "caseType": "caseType",
    "developmentType": "developmentType",
}


@dataclass(frozen=True)
class Table:
    """One csv, and what it needs to be checked."""

    id: str
    label: str
    group: str
    csv: Path
    source_json: Path
    source_key: str
    target: str
    required: bool
    has_text: bool
    portal: str | None = None

    @property
    def columns(self) -> list[str]:
        middle = [self.source_key] + (["idox_text"] if self.has_text else [])
        return middle + ["odp_type", "notes"]


def _read_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def root_from(settings=None) -> Path:
    """The mappers folder: DPR_MAPPERS, then the config file, then ./mappers."""
    return Path(os.getenv("DPR_MAPPERS") or getattr(settings, "mappers", None) or DEFAULT_ROOT)


class Library:
    def __init__(self, root: str | Path = DEFAULT_ROOT):
        self.root = Path(root)

    # --- the tables ---------------------------------------------------------------------------

    def application_table(self) -> Table:
        folder = self.root / "application_types"
        return Table(
            id="application-types", label="MHCLG application type", group="Application types",
            csv=folder / "mapping.csv", source_json=folder / "mhclg_types.json",
            source_key="mhclg_type", target="application_type", required=True, has_text=False,
        )

    def portals(self) -> list[str]:
        """The domains with a folder under idox/, in order."""
        folder = self.root / "idox"
        if not folder.is_dir():
            return []
        return sorted(p.name for p in folder.iterdir() if p.is_dir())

    def portal_tables(self, domain: str) -> list[Table]:
        folder = self.root / "idox" / domain
        tables = []
        for key, label, target, required in (
            ("status", "Status", "status", True),
            ("decision", "Decision", "decision", True),
            ("caseType", "Case type", "application_type", False),
        ):
            source = folder / f"idox_{key}.json"
            if not source.exists():
                continue
            tables.append(Table(
                id=f"idox/{domain}/{key}", label=f"Idox {label.lower()}", group=domain,
                csv=folder / f"mapping_{key}.csv", source_json=source, source_key="idox_value",
                target=target, required=required, has_text=True, portal=domain,
            ))
        return tables

    def tables(self) -> list[Table]:
        found = []
        if (self.root / "application_types").is_dir():
            found.append(self.application_table())
        for domain in self.portals():
            found += self.portal_tables(domain)
        return found

    def table(self, table_id: str) -> Table:
        for table in self.tables():
            if table.id == table_id:
                return table
        raise KeyError(table_id)

    def matching(self, wanted: list[str]) -> list[Table]:
        """Tables whose id is, or starts with, any of the names given. No names means all."""
        tables = self.tables()
        if not wanted:
            return tables
        return [t for t in tables
                if any(t.id == w or t.id.startswith(w.rstrip("/") + "/") for w in wanted)]

    # --- the values on each side --------------------------------------------------------------

    def source_options(self, table: Table) -> list[dict]:
        """The source's values, each with a text and, where there is one, a description."""
        raw = _read_json(table.source_json, [])
        if table.has_text:
            return [{"value": o["value"], "text": o.get("text", ""), "description": ""}
                    for o in raw]
        context = _read_json(self.root / "application_types" / "mhclg_context.json", {})
        return [{"value": v, "text": (context.get(v) or {}).get("name", ""),
                 "description": (context.get(v) or {}).get("description", "")} for v in raw]

    def targets(self, kind: str) -> list[str]:
        """What the standard accepts. Falls back to the schemas bundled with the pipeline."""
        listed = _read_json(self.root / TARGET_FILES[kind], None)
        if listed is not None:
            return listed
        from . import targets
        return targets.from_bundled_schemas()[kind]

    # --- the csv ------------------------------------------------------------------------------

    def read_rows(self, table: Table) -> list[dict]:
        if not table.csv.exists():
            return []
        with open(table.csv, newline="", encoding="utf-8") as handle:
            return [{k: (v or "") for k, v in row.items() if k} for row in csv.DictReader(handle)]

    def write_rows(self, table: Table, rows: list[dict]) -> None:
        columns = list(table.columns)
        for row in rows:
            columns += [k for k in row if k not in columns]
        table.csv.parent.mkdir(parents=True, exist_ok=True)
        temporary = table.csv.with_suffix(".csv.tmp")
        with open(temporary, "w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
            writer.writeheader()
            writer.writerows({c: row.get(c, "") for c in columns} for row in rows)
        temporary.replace(table.csv)

    def merged(self, table: Table) -> list[dict]:
        """What a person works on: every source value in the source's order, with its rows, then
        any rows whose value the source no longer offers.

        A source value can have several rows, because one source type sometimes fits more than one
        standard type. Each item is {value, text, description, target, notes, slot, listed,
        offered}; slot counts the rows of one value from 0, and a value with no row gets a blank
        item with listed False.
        """
        options = self.source_options(table)
        by_value: dict[str, list[dict]] = {}
        for row in self.read_rows(table):
            by_value.setdefault(row.get(table.source_key, "").strip(), []).append(row)

        def item(option: dict, row: dict | None, slot: int, offered: bool) -> dict:
            return {**option, "target": (row or {}).get("odp_type", "").strip(),
                    "notes": (row or {}).get("notes", ""), "slot": slot,
                    "listed": row is not None, "offered": offered}

        items, seen = [], set()
        for option in options:
            seen.add(option["value"])
            rows = by_value.get(option["value"]) or [None]
            items += [item(option, row, slot, True) for slot, row in enumerate(rows)]
        for value, rows in by_value.items():
            if value and value not in seen:
                items += [item({"value": value, "text": row.get("idox_text", ""),
                                "description": ""}, row, slot, False)
                          for slot, row in enumerate(rows)]
        return items

    def save(self, table: Table, changes: list[dict]) -> list[dict]:
        """Replace the rows of the values named in changes, then write the csv.

        Each change is {value, entries: [{target, notes}]}: all the rows for that value, in order.
        Returns what was rejected, and writes nothing if anything was. A target has to be empty or
        something the standard accepts, so a typo can never be saved.
        """
        allowed = set(self.targets(table.target))
        rejected = [{"value": c.get("value"), "target": e.get("target"),
                     "problem": "not a value the standard accepts"}
                    for c in changes for e in c.get("entries", [])
                    if (e.get("target") or "").strip() not in allowed | {""}]
        if rejected:
            return rejected

        edits = {c["value"]: c.get("entries", []) for c in changes if c.get("value")}
        current = self.merged(table)
        existing: dict[str, list[dict]] = {}
        for row in self.read_rows(table):
            existing.setdefault(row.get(table.source_key, "").strip(), []).append(row)

        out, done = [], set()
        for it in current:
            value = it["value"]
            if value in edits:
                if value in done:
                    continue
                done.add(value)
                entries = [e for e in edits[value]
                           if (e.get("target") or "").strip() or (e.get("notes") or "").strip()]
                for slot, entry in enumerate(entries or [{}]):
                    rows = existing.get(value) or []
                    base = dict(rows[slot]) if slot < len(rows) else {}
                    base[table.source_key] = value
                    if table.has_text:
                        base["idox_text"] = it["text"] or base.get("idox_text", "")
                    base["odp_type"] = (entry.get("target") or "").strip()
                    base["notes"] = entry.get("notes") or ""
                    out.append(base)
            elif it["listed"]:
                base = dict(existing[value][it["slot"]])
                base[table.source_key] = value
                out.append(base)
        self.write_rows(table, out)
        return []

    # --- the portal list ----------------------------------------------------------------------

    @property
    def urls_file(self) -> Path:
        return self.root / "idox" / "idox_urls.txt"

    def portal_urls(self) -> list[str]:
        if not self.urls_file.exists():
            return []
        lines = (line.strip() for line in self.urls_file.read_text(encoding="utf-8").splitlines())
        return [line for line in lines if line and not line.startswith("#")]

    def add_portal_url(self, url: str) -> bool:
        """Add a portal to the list. False if its domain is already there."""
        domain = urlparse(url).netloc
        if domain in {urlparse(u).netloc for u in self.portal_urls()}:
            return False
        self.urls_file.parent.mkdir(parents=True, exist_ok=True)
        existing = (self.urls_file.read_text(encoding="utf-8")
                    if self.urls_file.exists() else "")
        separator = "" if not existing or existing.endswith("\n") else "\n"
        self.urls_file.write_text(existing + separator + url + "\n", encoding="utf-8")
        return True

