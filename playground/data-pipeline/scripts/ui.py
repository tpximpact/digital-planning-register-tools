"""Open the DuckDB web interface on this project's database.

    python scripts/ui.py
    uv run --with duckdb scripts/ui.py

Opens a browser with the three layers as browsable tables, so the data can be shown
without anyone reading SQL off a terminal. Ctrl+C to stop.
"""

import sys
import time

import duckdb

from dpr_pipeline import config


def main() -> int:
    settings = config.load()
    connection = duckdb.connect(settings.database_path)
    connection.execute("INSTALL ui")
    connection.execute("LOAD ui")
    connection.execute("CALL start_ui()")
    print(f"DuckDB UI running on http://localhost:4213  ({settings.database_path})")
    print("Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nstopped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
