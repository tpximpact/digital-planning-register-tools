"""The database. One DuckDB file with three schemas, one per layer.

DuckDB was chosen because it is a single file with no server to install, so anyone can try the
pipeline on a laptop. It is ordinary SQL, so moving to Postgres later changes very little.

Bronze keeps each council's records in the shape they arrived in, as raw json. Silver and gold hold
the standard shape and are the same for every council.
"""

from __future__ import annotations

from pathlib import Path

import duckdb

SCHEMAS = ("bronze", "silver", "gold")


def connect(database_path: str) -> duckdb.DuckDBPyConnection:
    """Open the database, creating the file and the schemas if they are not there yet."""
    if not database_path.startswith(("s3://", "abfs://", ":memory:")):
        Path(database_path).parent.mkdir(parents=True, exist_ok=True)

    connection = duckdb.connect(database_path)
    for schema in SCHEMAS:
        connection.execute(f"CREATE SCHEMA IF NOT EXISTS {schema}")
    _create_tables(connection)
    _add_missing_columns(connection)
    return connection


#: Columns added after the first version. A database made earlier is brought up to date rather
#: than rebuilt, because bronze is expensive to fetch again.
LATER_COLUMNS = {
    "silver.applications": {
        "description": "VARCHAR",
        "applicant": "VARCHAR",
        "officer": "VARCHAR",
    },
    "gold.applications": {
        "updated_at": "TIMESTAMP",
        "updated_by": "VARCHAR",
        # DuckDB cannot add a column with a constraint, so this one is filled in below instead.
        "edited": "BOOLEAN",
    },
}


def _add_missing_columns(connection: duckdb.DuckDBPyConnection) -> None:
    for table, columns in LATER_COLUMNS.items():
        schema, name = table.split(".")
        present = {
            row[0]
            for row in connection.execute(
                """
                SELECT column_name FROM information_schema.columns
                WHERE table_schema = ? AND table_name = ?
                """,
                [schema, name],
            ).fetchall()
        }
        for column, definition in columns.items():
            if column not in present:
                connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
                if column == "edited":
                    connection.execute(f"UPDATE {table} SET edited = false WHERE edited IS NULL")


def _create_tables(connection: duckdb.DuckDBPyConnection) -> None:
    # Bronze is deliberately loose. We keep the whole record as json so that a change at the
    # council's end cannot break the load, and so we never have to ask them for a second export.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS bronze.applications (
            council      VARCHAR NOT NULL,
            reference    VARCHAR NOT NULL,
            pulled_at    TIMESTAMP NOT NULL,
            source_url   VARCHAR,
            record       JSON NOT NULL,
            PRIMARY KEY (council, reference)
        )
        """
    )

    # Silver is the standard shape. The json column holds the post submission record, and the
    # columns beside it are there so the layer can be queried without opening the json.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS silver.applications (
            council           VARCHAR NOT NULL,
            reference         VARCHAR NOT NULL,
            application_type  VARCHAR,
            status            VARCHAR,
            decision          VARCHAR,
            valid_from        DATE,
            decided_at        DATE,
            address           VARCHAR,
            description       VARCHAR,
            applicant         VARCHAR,
            officer           VARCHAR,
            mapped_at         TIMESTAMP NOT NULL,
            record            JSON NOT NULL,
            PRIMARY KEY (council, reference)
        )
        """
    )

    # Anything the mapper could not place. Kept rather than dropped, so the gaps are visible.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS silver.mapping_issues (
            council    VARCHAR NOT NULL,
            reference  VARCHAR NOT NULL,
            field      VARCHAR NOT NULL,
            value      VARCHAR,
            reason     VARCHAR NOT NULL,
            found_at   TIMESTAMP NOT NULL
        )
        """
    )

    # Gold starts as a copy of silver and is where editing happens. Silver is never touched, so
    # re-running the pipeline refreshes it without wiping anyone's work here.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS gold.applications (
            council        VARCHAR NOT NULL,
            reference      VARCHAR NOT NULL,
            published_at   TIMESTAMP NOT NULL,
            updated_at     TIMESTAMP,
            updated_by     VARCHAR,
            edited         BOOLEAN NOT NULL DEFAULT false,
            record         JSON NOT NULL,
            PRIMARY KEY (council, reference)
        )
        """
    )

    # Every change to gold, so the difference from what the council sent can always be shown.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS gold.edits (
            council    VARCHAR NOT NULL,
            reference  VARCHAR NOT NULL,
            action     VARCHAR NOT NULL,
            edited_by  VARCHAR NOT NULL,
            edited_at  TIMESTAMP NOT NULL,
            before     JSON,
            after      JSON
        )
        """
    )


def counts(connection: duckdb.DuckDBPyConnection) -> dict[str, int]:
    """Row counts per layer, for the status command."""
    result = {}
    for table in ("bronze.applications", "silver.applications", "gold.applications",
                  "silver.mapping_issues", "gold.edits"):
        result[table] = connection.execute(f"SELECT count(*) FROM {table}").fetchone()[0]
    return result
