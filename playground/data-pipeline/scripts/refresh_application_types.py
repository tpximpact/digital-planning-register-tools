"""Refresh the list of valid ODP application types from the schema repository.

    python scripts/refresh_application_types.py ../planning-register-data-logistics/repos/digital-planning-data-schemas

The list is vendored into the package so the pipeline runs without a checkout of the schemas.
Re-run this when the standard changes.
"""

import json
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "dpr_pipeline" / "data" / "application_types.json"


def collect(node, found):
    if isinstance(node, dict):
        properties = node.get("properties") or {}
        if node.get("type") == "object" and "applicationType" in properties:
            spec = properties["applicationType"]
            if "const" in spec:
                found.add(spec["const"])
            found.update(spec.get("enum", []))
        for value in node.values():
            collect(value, found)
    elif isinstance(node, list):
        for value in node:
            collect(value, found)


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 1

    schema = Path(argv[1]) / "schemas" / "postSubmissionPublishedApplication.json"
    found = set()
    collect(json.loads(schema.read_text(encoding="utf-8")), found)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(sorted(found), indent=2) + "\n", encoding="utf-8")
    print(f"{len(found)} application types written to {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
