"""Pull the source options and the standard's values into the mappers folder.

Everything that touches the network takes a `get` function (requests.get by default), so the logic
can be tested with canned pages.
"""

from __future__ import annotations

import csv
import ipaddress
import os
from html.parser import HTMLParser
from urllib.parse import urlparse

import requests

from . import targets
from .library import IDOX_DROPDOWNS, TARGET_FILES, Library, Table, write_json

MHCLG_URL = ("https://raw.githubusercontent.com/digital-land/planning-application-data-"
             "specification/main/data/planning-application-type.csv")
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


class FetchError(Exception):
    pass


# --- Idox pages ---------------------------------------------------------------------------------

class _Selects(HTMLParser):
    """Collects the options of the <select> elements whose id is wanted."""

    def __init__(self, wanted: set[str]):
        super().__init__(convert_charrefs=True)
        self.wanted = wanted
        self.found: dict[str, list[dict]] = {}
        self._select: str | None = None
        self._option: dict | None = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "select" and attrs.get("id") in self.wanted:
            self._select = attrs["id"]
            self.found.setdefault(self._select, [])
        elif tag == "option" and self._select:
            self._option = {"value": (attrs.get("value") or "").strip(), "text": ""}

    def handle_data(self, data):
        if self._option is not None:
            self._option["text"] += data

    def _close_option(self):
        if self._option is not None and self._select and self._option["value"]:
            self.found[self._select].append(
                {"value": self._option["value"], "text": " ".join(self._option["text"].split())})
        self._option = None

    def handle_endtag(self, tag):
        if tag == "option":
            self._close_option()
        elif tag == "select":
            self._close_option()
            self._select = None


def parse_idox_dropdowns(html: str) -> dict[str, list[dict]]:
    """{status, decision, caseType, developmentType}: each a list of {value, text}, by value.

    A dropdown the page does not have comes back empty.
    """
    parser = _Selects(set(IDOX_DROPDOWNS.values()))
    parser.feed(html)
    return {key: sorted(parser.found.get(html_id, []), key=lambda o: o["value"])
            for key, html_id in IDOX_DROPDOWNS.items()}


def check_portal_url(url: str) -> str:
    """The domain, or FetchError. Stops the admin being used to fetch from the inside of a network."""
    parsed = urlparse(url)
    host = parsed.hostname or ""
    if parsed.scheme not in ("http", "https") or "." not in host or host.endswith(".local"):
        raise FetchError("That is not a web address for an Idox portal.")
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return parsed.netloc
    raise FetchError(f"Use the portal's domain name rather than the address {ip}.")


def fetch_page(url: str, get=requests.get) -> str:
    """The page's html. Council sites often have broken certificates, so a certificate error is
    retried without checking one, and it is only the public search page being read."""
    try:
        response = get(url, headers=HEADERS, timeout=20)
    except requests.exceptions.SSLError:
        response = get(url, headers=HEADERS, timeout=20, verify=False)
    try:
        response.raise_for_status()
    except requests.exceptions.RequestException as problem:
        raise FetchError(f"{url} answered with an error: {problem}") from problem
    return response.text


# --- the pieces ---------------------------------------------------------------------------------

def sync(library: Library, table: Table) -> tuple[bool, int]:
    """Make the csv exist and hold a row for every source value. Returns (created, rows added).

    Rows already there are never touched: they are somebody's decisions.
    """
    created = not table.csv.exists()
    existing = library.read_rows(table)
    have = {r.get(table.source_key, "").strip() for r in existing}
    added = [{table.source_key: o["value"], "idox_text": o["text"], "odp_type": "", "notes": ""}
             for o in library.source_options(table) if o["value"] not in have]
    if created or added:
        library.write_rows(table, existing + added)
    return created, len(added)


def refresh_targets(library: Library, schemas: str | None = None, get=requests.get) -> dict:
    """Write the standard's values.

    From a schemas folder if one is named, which fails if it can't be read. From DPR_SCHEMAS if
    that is set and readable, since Docker sets it even when nothing is mounted there. Otherwise
    from GitHub.
    """
    try:
        values = None
        if schemas:
            values = targets.from_folder(schemas)
        elif os.getenv("DPR_SCHEMAS"):
            try:
                values = targets.from_folder(os.environ["DPR_SCHEMAS"])
            except OSError:
                values = None
        if values is None:
            values = targets.from_github(get)
    except (OSError, requests.exceptions.RequestException, ValueError) as problem:
        raise FetchError(f"Could not read the schemas: {problem}") from problem
    for kind, listed in values.items():
        write_json(library.root / TARGET_FILES[kind], listed)
    return {kind: len(listed) for kind, listed in values.items()}


def refresh_mhclg(library: Library, get=requests.get) -> int:
    """MHCLG's application types, with each one's name and description kept for the mapper."""
    try:
        response = get(MHCLG_URL, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as problem:
        raise FetchError(f"Could not fetch the MHCLG list: {problem}") from problem
    reader = csv.DictReader(response.text.splitlines())
    key = reader.fieldnames[0]
    context = {row[key]: {"name": row.get("name", ""), "description": row.get("description", "")}
               for row in reader if row.get(key)}
    folder = library.root / "application_types"
    write_json(folder / "mhclg_types.json", sorted(context))
    write_json(folder / "mhclg_context.json", dict(sorted(context.items())))
    return len(context)


def refresh_portal(library: Library, url: str, get=requests.get) -> dict:
    """Read one portal's dropdowns and add any new values to its mapping files."""
    domain = check_portal_url(url)
    dropdowns = parse_idox_dropdowns(fetch_page(url, get))
    if not any(dropdowns.values()):
        raise FetchError(f"{domain} has none of the expected dropdowns. Is that the advanced "
                         "search page (search.do?action=advanced)?")
    folder = library.root / "idox" / domain
    for key, options in dropdowns.items():
        write_json(folder / f"idox_{key}.json", options)
    report = {"domain": domain, "values": {k: len(v) for k, v in dropdowns.items()}, "added": {}}
    for table in library.portal_tables(domain):
        _, added = sync(library, table)
        report["added"][table.id] = added
    return report


def sync_everything(library: Library) -> list[tuple[str, bool, int]]:
    """Create or extend every csv from the source lists already on disk, with no network."""
    return [(t.id, *sync(library, t)) for t in library.tables()]
