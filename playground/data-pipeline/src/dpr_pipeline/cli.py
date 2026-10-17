"""The command line.

    dpr ingest camden      pull a council's data into bronze
    dpr map camden         convert bronze into silver
    dpr publish            copy silver into gold, keeping any edits
    dpr approve            approve records so they become public
    dpr validate           check the silver layer
    dpr status             row counts per layer
    dpr show REFERENCE     print one record, before and after
    dpr gaps               what the mapper could not place, grouped
    dpr sql "SELECT ..."   run any query against the database
    dpr values COLUMN      distinct values in silver, with counts
    dpr attach C REF FILE  store the files and comments from a record in the standard's shape
    dpr reset --yes        delete the database so the next run starts from nothing
"""

from __future__ import annotations

import argparse
import sys

from . import config, db, gold, validate
from .mappers import barnet as barnet_mapper
from .mappers import camden as camden_mapper
from .sources import barnet as barnet_source
from .sources import camden as camden_source
from .storage import Storage

SOURCES = {"barnet": barnet_source, "camden": camden_source}
MAPPERS = {"barnet": barnet_mapper, "camden": camden_mapper}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="dpr", description=__doc__)
    parser.add_argument("--config", help="path to a config file", default=None)
    commands = parser.add_subparsers(dest="command", required=True)

    ingest = commands.add_parser("ingest", help="pull a council into bronze")
    ingest.add_argument("council", choices=sorted(SOURCES))

    mapping = commands.add_parser("map", help="convert bronze into silver")
    mapping.add_argument("council", choices=sorted(MAPPERS))

    publishing = commands.add_parser("publish", help="copy silver into gold, keeping edits")
    publishing.add_argument("--council", default=None)
    publishing.add_argument("--no-refresh", action="store_true",
                            help="leave gold alone even where nothing has been edited")

    approving = commands.add_parser("approve", help="approve records so they become public")
    approving.add_argument("--council", default=None)
    approving.add_argument("--clean", action="store_true",
                           help="approve everything with nothing flagged against it")
    approving.add_argument("--by", default=None, help="who is approving, for the record")
    approving.add_argument("references", nargs="*", help="specific references to approve")

    checking = commands.add_parser("validate", help="check the silver layer")
    checking.add_argument("--council", default=None)
    checking.add_argument("--strict", action="store_true",
                          help="also report the missing submission block, which legacy data"
                               " cannot have")
    checking.add_argument("--schemas", default=None,
                          help="path to the ODP schema repository, or a single schema file")

    commands.add_parser("status", help="row counts per layer")

    showing = commands.add_parser("show", help="print one record, before and after")
    showing.add_argument("reference")

    gaps = commands.add_parser("gaps", help="what the mapper could not place")
    gaps.add_argument("--field", default="application_type")

    query = commands.add_parser("sql", help="run a query against the database")
    query.add_argument("statement")

    attaching = commands.add_parser(
        "attach", help="store the documents and comments from a standard shaped record")
    attaching.add_argument("council")
    attaching.add_argument("reference")
    attaching.add_argument("file", help="a json file with files and comments, like the examples")

    resetting = commands.add_parser(
        "reset", help="delete the database, and with --files the stored downloads too")
    resetting.add_argument("--yes", action="store_true", help="really do it")
    resetting.add_argument("--files", action="store_true",
                           help="also delete the bronze, silver and gold folders")

    values = commands.add_parser("values", help="distinct values in silver, with counts")
    values.add_argument("column", choices=["status", "decision", "application_type"])

    args = parser.parse_args(argv)
    settings = config.load(args.config)

    # Before the database is opened, because an open DuckDB file cannot be deleted.
    if args.command == "reset":
        return _reset(settings, args.yes, args.files)

    connection = db.connect(settings.database_path)

    if args.command == "ingest":
        source = settings.source(args.council)
        storage = Storage(settings.bronze)
        written = SOURCES[args.council].ingest(connection, source, storage)
        print(f"bronze: {written} records from {args.council}")

    elif args.command == "map":
        written, issues = MAPPERS[args.council].map_all(connection)
        print(f"silver: {written} records from {args.council}, {issues} things to look at")

    elif args.command == "publish":
        result = gold.publish(connection, args.council, refresh_unedited=not args.no_refresh)
        print("gold: " + ", ".join(f"{count} {label}" for label, count in result.items()))

    elif args.command == "approve":
        counts = gold.flagged_counts(connection, args.council)
        print(f"{counts['approved']} approved, {counts['clean']} clean and waiting, "
              f"{counts['flagged']} flagged for a look")

        if not args.clean and not args.references:
            print()
            print("Nothing approved. Pass --clean, or name the references to approve.")
            return 0

        editor = args.by or "command line"
        if args.clean:
            if not args.council:
                print()
                print("Pass --council when approving everything clean.")
                return 1
            references = [r for _, r in gold.clean_references(connection, args.council)]
        else:
            references = args.references

        done = gold.approve(connection, args.council, references, editor)
        print()
        print(f"approved {done} records")

    elif args.command == "validate":
        problems = validate.basic_checks(connection, args.council)

        schema_path = validate.find_schema(args.schemas)
        if schema_path:
            print(f"checking against {schema_path.name}")
            problems += validate.against_schema(
                connection, validate.load_schema(schema_path), args.council, strict=args.strict
            )
            if not args.strict:
                print("the submission block is not counted below: historic records only have the"
                      " applicant, address and description. Use --strict to include it.")
        else:
            print("no ODP schema found, so only the basic checks ran."
                  " Pass --schemas or set DPR_SCHEMAS for the full check.")
        if not problems:
            print("no problems found")
        else:
            total = connection.execute("SELECT count(*) FROM silver.applications").fetchone()[0]
            print()
            print(f"{len(problems)} problems across {total} records")
            print()
            for problem, count in validate.summarise(problems):
                print(f"  {count:>5}  {problem}")
            print()
            print("One example of each:")
            seen = set()
            for reference, problem in problems:
                if problem in seen:
                    continue
                seen.add(problem)
                print(f"  {reference}")
                if len(seen) >= 5:
                    break
        return 1 if problems else 0

    elif args.command == "show":
        import json

        rows = connection.execute(
            """
            SELECT b.record, s.record
            FROM bronze.applications b
            LEFT JOIN silver.applications s
                ON s.council = b.council AND s.source_reference = b.reference
            WHERE b.reference = ? OR s.reference = ?
            """,
            [args.reference, args.reference],
        ).fetchall()
        if not rows:
            print(f"nothing here with reference {args.reference}")
            return 1
        source, mapped = rows[0]
        print("--- as the council published it -------------------------------")
        print(json.dumps(json.loads(source), indent=2, ensure_ascii=False))
        print()
        print("--- in the standard shape -------------------------------------")
        print(json.dumps(json.loads(mapped), indent=2, ensure_ascii=False) if mapped
              else "not mapped yet, run: dpr map <council>")

    elif args.command == "attach":
        import json
        from pathlib import Path

        from . import items

        record = json.loads(Path(args.file).read_text(encoding="utf-8"))
        found = items.attach_record(connection, args.council, args.reference, record)
        print("stored " + ", ".join(f"{count} {kind}" for kind, count in found.items()))

    elif args.command == "gaps":
        rows = connection.execute(
            """
            SELECT value, count(*) AS records
            FROM silver.mapping_issues
            WHERE field = ?
            GROUP BY value
            ORDER BY records DESC
            """,
            [args.field],
        ).fetchall()
        total = connection.execute("SELECT count(*) FROM silver.applications").fetchone()[0]
        affected = sum(count for _, count in rows)
        print(f"{args.field}: {affected} of {total} records have a gap")
        print()
        for value, count in rows[:15]:
            print(f"  {count:>5}  {value or '(empty)'}")

    elif args.command == "sql":
        result = connection.execute(args.statement)
        columns = [d[0] for d in result.description]
        rows = result.fetchall()
        widths = [max(len(c), *(len(str(r[i])) for r in rows)) if rows else len(c)
                  for i, c in enumerate(columns)]
        print("  ".join(c.ljust(w) for c, w in zip(columns, widths)))
        print("  ".join("-" * w for w in widths))
        for row in rows:
            print("  ".join(str(v).ljust(w) for v, w in zip(row, widths)))
        print()
        print(f"{len(rows)} rows")

    elif args.command == "values":
        rows = connection.execute(
            f"""
            SELECT {args.column} AS value, count(*) AS records
            FROM silver.applications
            GROUP BY 1
            ORDER BY 2 DESC
            """
        ).fetchall()
        print(f"{len(rows)} distinct values of {args.column}")
        print()
        for value, count in rows:
            print(f"  {count:>5}  {value or '(empty)'}")

    elif args.command == "status":
        for table, count in db.counts(connection).items():
            print(f"{table:28} {count}")

    return 0




def _reset(settings, confirmed: bool, files: bool) -> int:
    """Delete the database so the next run starts from nothing.

    Everything in it is rebuilt by ingest, map and publish, except what people did by hand: edits,
    approvals and their history. Those go too, which is why this asks first.
    """
    import shutil
    from pathlib import Path

    remote = ("s3://", "abfs://")
    targets = [Path(settings.database_path), Path(settings.database_path + ".wal")]
    if files:
        targets += [Path(folder) for folder in (settings.bronze, settings.silver, settings.gold)
                    if not folder.startswith(remote)]

    if settings.database_path.startswith(remote):
        print("The database is remote, so it has to be cleared where it lives.")
        return 1

    present = [path for path in targets if path.exists()]
    if not present:
        print("nothing to delete")
        return 0

    for path in present:
        print(f"  {path}")
    if not confirmed:
        print()
        print("That is what would be deleted, including every edit and approval. "
              "Run again with --yes to do it.")
        return 1

    for path in present:
        shutil.rmtree(path) if path.is_dir() else path.unlink()
    print()
    print("deleted. Start again with: ingest, map, publish, approve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
