"""dpr mappers: manage the value mapper files.

    dpr mappers status                  how finished each table is
    dpr mappers validate [TABLE ...]    what is unmapped or wrong (exit 1 if a required table is)
    dpr mappers fetch [--force]         refresh the standard's values, the MHCLG list and portals
    dpr mappers add-portal URL          start mapping another Idox portal
    dpr mappers show TABLE              every row of one table

A TABLE is an id from `status`, or the start of one: `idox` is every Idox table.
"""

from __future__ import annotations

import sys

from . import checks, fetch
from .library import Library


def add_arguments(parser) -> None:
    commands = parser.add_subparsers(dest="mappers_command", required=True)
    commands.add_parser("status", help="how finished each table is")

    validating = commands.add_parser("validate", help="what is unmapped or wrong")
    validating.add_argument("tables", nargs="*", help="table ids, or the start of them")
    validating.add_argument("--all", action="store_true", help="list every item, not the first 15")

    fetching = commands.add_parser("fetch", help="refresh the values from their sources")
    fetching.add_argument("--force", action="store_true",
                          help="fetch portals again even if they have data")
    fetching.add_argument("--schemas", default=None,
                          help="a checkout of the ODP schemas to read, instead of GitHub")
    fetching.add_argument("--offline", action="store_true",
                          help="only create or extend mapping files from what is on disk")

    adding = commands.add_parser("add-portal", help="start mapping another Idox portal")
    adding.add_argument("url", help="the portal's advanced search address")

    showing = commands.add_parser("show", help="every row of one table")
    showing.add_argument("table")


def run(args, library: Library, out=print) -> int:
    handler = {"status": _status, "validate": _validate, "fetch": _fetch,
               "add-portal": _add_portal, "show": _show}[args.mappers_command]
    return handler(args, library, out)


def _bar(done: int, total: int, width: int = 20) -> str:
    filled = round(width * done / total) if total else 0
    return "#" * filled + "." * (width - filled)


def _status(_args, library, out) -> int:
    tables = library.tables()
    if not tables:
        out(f"No mapper tables under {library.root}. Run: dpr mappers fetch")
        return 1
    width = max(len(t.id) for t in tables)
    for table in tables:
        c = checks.check(library, table)
        flags = [f"{len(c.unmapped)} unmapped"] if c.unmapped else []
        flags += [f"{len(c.no_fit)} no fit"] if c.no_fit else []
        flags += [f"{len(c.invalid)} invalid"] if c.invalid else []
        flags += [f"{c.review} to check"] if c.review else []
        optional = "" if table.required else "  (optional)"
        out(f"{table.id:<{width}}  {_bar(c.resolved, c.total)} {c.resolved:>3}/{c.total:<3} "
            f"{', '.join(flags) or 'complete'}{optional}")
    return 0


def _validate(args, library, out) -> int:
    tables = library.matching(args.tables)
    if not tables:
        out("No table matches. Run `dpr mappers status` to see the ids.")
        return 1
    limit = None if args.all else 15
    failed = 0
    for table in tables:
        c = checks.check(library, table)
        out("")
        out(f"{table.id}  ({c.resolved} of {c.total} done"
            f"{f', {len(c.no_fit)} with no fit' if c.no_fit else ''})")
        if c.ok:
            out("  complete and valid")
        for item in c.invalid[:limit]:
            out(f"  invalid   {item['value']!r}: {item['problem']}")
        if limit and len(c.invalid) > limit:
            out(f"  ... {len(c.invalid) - limit} more invalid, use --all")
        for item in c.unmapped[:limit]:
            label = f"  ({item['text']})" if item["text"] and item["text"] != item["value"] else ""
            out(f"  unmapped  {item['value']!r}{label}")
        if limit and len(c.unmapped) > limit:
            out(f"  ... {len(c.unmapped) - limit} more unmapped, use --all")
        if not c.ok and not table.required:
            out("  (optional table: reported, does not fail the run)")
        failed += c.blocking
    out("")
    out(f"{failed} required table(s) to finish" if failed else "every required table is complete")
    return 1 if failed else 0


def _fetch(args, library, out) -> int:
    problems = 0
    if args.offline:
        for table_id, created, added in fetch.sync_everything(library):
            out(f"{table_id}: {'created, ' if created else ''}{added} rows added")
        return 0

    def attempt(label: str, action):
        nonlocal problems
        try:
            result = action()
            out(f"{label}: {result}")
        except fetch.FetchError as problem:
            problems += 1
            out(f"{label}: {problem}")

    attempt("standard", lambda: ", ".join(
        f"{n} {k.replace('_', ' ')}s" for k, n in fetch.refresh_targets(library, args.schemas).items()))
    attempt("MHCLG types", lambda: f"{fetch.refresh_mhclg(library)} types")

    for url in library.portal_urls():
        domain = url.split("/")[2] if "//" in url else url
        if (library.root / "idox" / domain).is_dir() and not args.force:
            out(f"{domain}: skipped, it has data already (use --force to refresh it)")
            continue
        attempt(domain, lambda url=url: _describe(fetch.refresh_portal(library, url)))

    for table_id, created, added in fetch.sync_everything(library):
        if created or added:
            out(f"{table_id}: {'created, ' if created else ''}{added} rows added")
    return 1 if problems else 0


def _describe(report: dict) -> str:
    values = ", ".join(f"{n} {k}" for k, n in report["values"].items())
    added = sum(report["added"].values())
    return f"{values}; {added} new rows to map"


def _add_portal(args, library, out) -> int:
    try:
        fetch.check_portal_url(args.url)
        fresh = library.add_portal_url(args.url)
        out("added to idox_urls.txt" if fresh else "already in idox_urls.txt")
        out(_describe(fetch.refresh_portal(library, args.url)))
    except fetch.FetchError as problem:
        out(str(problem))
        return 1
    return 0


def _show(args, library, out) -> int:
    matches = library.matching([args.table])
    if len(matches) != 1:
        out("Name one table. Run `dpr mappers status` to see the ids.")
        return 1
    view = checks.view(library, matches[0])
    width = max((len(r["value"]) for r in view["rows"]), default=5)
    for row in view["rows"]:
        out(f"{row['state']:<9} {row['value']:<{width}}  ->  {row['target'] or '-'}"
            f"{'   ' + row['notes'] if row['notes'] else ''}")
    return 0


def main(argv=None) -> int:  # pragma: no cover, for running this file on its own
    import argparse
    parser = argparse.ArgumentParser(prog="dpr mappers")
    add_arguments(parser)
    args = parser.parse_args(argv)
    return run(args, Library())


if __name__ == "__main__":
    sys.exit(main())
