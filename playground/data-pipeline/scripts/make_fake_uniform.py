"""Make a stand in for an Idox Uniform export, as CSV, one file per table.

    python scripts/make_fake_uniform.py data/fake-barnet 250

Barnet have no approval to share their data and there is no contract, so a real export cannot be
accepted. Agreed on 22 September: build the Barnet side against made up rows in the right shape,
and swap in a real export the day one is allowed.

The table and column names follow what is known of Uniform from an existing integration and
from earlier reverse engineering. They are the part that matters, because the mapper reads names,
not data. When the real schema arrives, correct the names here and nothing else changes.
"""

import csv
import datetime as dt
import random
import sys
from pathlib import Path

WARDS = ["Colindale", "Hendon", "Finchley Church End", "East Barnet", "Burnt Oak"]
STREETS = ["High Road", "Station Road", "Church Lane", "The Avenue", "Park Road"]

APPLICATION_TYPES = [
    "FUL", "HSE", "LBC", "CAC", "OUT", "RES", "ADV", "CLE", "CLP", "PNH", "TPO", "NMA",
]

DECISIONS = [
    "GTD", "REF", "WDN", "SPL", "PER", "NOB",
]

STATUSES = ["DC", "PEN", "REG", "INV"]


def make(rows: int, seed: int = 7):
    random.seed(seed)
    start = dt.date(2015, 1, 1)

    applications, proposals, addresses = [], [], []
    for number in range(1, rows + 1):
        reference = f"{random.randint(15, 25)}/{number:04d}/{random.choice(['FUL', 'HSE', 'LBC'])}"
        received = start + dt.timedelta(days=random.randint(0, 3600))
        valid = received + dt.timedelta(days=random.randint(0, 21))
        decided = valid + dt.timedelta(days=random.randint(21, 120))
        key = f"{number:08d}"

        applications.append({
            "KEYVAL": key,
            "REFVAL": reference,
            "APPTYPE": random.choice(APPLICATION_TYPES),
            "RECEIVEDDATE": received.isoformat(),
            "VALIDDATE": valid.isoformat(),
            "DECISIONDATE": decided.isoformat(),
            "DECISION": random.choice(DECISIONS),
            "STATUS": random.choice(STATUSES),
            "CASEOFFICER": random.choice(["A Patel", "J Smith", "R Okafor", "L Nowak"]),
            "WARD": random.choice(WARDS),
            "APPLICANTNAME": random.choice(["Mr A Owner", "Barnet Homes", "A N Other Ltd"]),
        })
        proposals.append({
            "KEYVAL": key,
            "PROPOSAL": random.choice([
                "Single storey rear extension",
                "Change of use from office to residential",
                "Demolition of existing garage and erection of a two storey dwelling",
                "Works to trees covered by a tree preservation order",
                "Installation of shopfront and associated signage",
            ]),
        })
        addresses.append({
            "KEYVAL": key,
            "HOUSENUMBER": str(random.randint(1, 240)),
            "STREET": random.choice(STREETS),
            "TOWN": "London",
            "POSTCODE": f"N{random.randint(1, 22)} {random.randint(1, 9)}{random.choice('ABDEFG')}"
                        f"{random.choice('ABDEFG')}",
            "EASTING": str(random.randint(519000, 526000)),
            "NORTHING": str(random.randint(188000, 196000)),
        })

    return {"APPLICATIONS": applications, "PROPOSALS": proposals, "ADDRESSES": addresses}


def main(argv):
    target = Path(argv[1] if len(argv) > 1 else "data/fake-barnet")
    rows = int(argv[2]) if len(argv) > 2 else 250

    target.mkdir(parents=True, exist_ok=True)
    for table, records in make(rows).items():
        path = target / f"{table}.csv"
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(records[0]))
            writer.writeheader()
            writer.writerows(records)
        print(f"{len(records):>5} rows  {path}")

    print("\nMade up data, in the shape of a Uniform export. Not Barnet's records.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
