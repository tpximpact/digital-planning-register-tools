"""The MHCLG national public view, built from a record in the ODP shape.

The two standards are shaped differently, and that is the whole job.

ODP emits one nested object per application: the application, its dates, its decision, its
documents, all hanging off a single record. The national public view defines eight datasets with
references between them. A condition belongs to a decision notice, which belongs to an
application. A site is a thing with its own identity that applications point at.

So this is not a rename exercise. Three things have to happen:

  1. One nested record is split into rows across eight datasets.
  2. References that do not exist in ODP have to be created, because the national model is
     relational and a nested document has nothing to join on. They are built from the application
     reference so they are stable across runs and readable by a person.
  3. Dates held as named fields become typed events against the national event vocabulary.

Of the 52 national fields, 30 have no source in ODP at all. Four whole datasets are empty:
planning conditions, decision conditions and section 106 agreements are not modelled by ODP in any
form. Those are written to national.translation_issues once per record rather than filled with
something invented, which is the same rule the mappers follow.

The field by field basis for all of this is docs/national-fields.md.
"""

from __future__ import annotations

import datetime as dt
import json
import re
from pathlib import Path

_DATA = Path(__file__).parent / "data" / "national_public_view.json"

SPEC: dict = json.loads(_DATA.read_text(encoding="utf-8"))
DATASETS: dict = SPEC["datasets"]

#: The national vocabulary of process events. An event type outside this list is not valid.
EVENTS: tuple[str, ...] = tuple(SPEC["permission-process-event"])

#: Datasets ODP cannot produce a single row for. Stated here so the reason is in one place.
NO_SOURCE_IN_ODP = {
    "planning-condition": "ODP does not model a condition imposed on a permission. The field it"
                          " calls conditions holds site constraints, and the application type"
                          " approval.conditions is a request about a condition, not the condition.",
    "decision-condition": "ODP has no decision notice record, so nothing can link a condition to"
                          " one, and it does not record who requested or discharged a condition.",
    "section-106": "section 106, s106 and section106 do not appear anywhere in the ODP schema.",
}

#: National fields with no ODP source, kept beside the dataset so coverage can explain itself.
NO_SOURCE_FIELDS = {
    ("planning-application", "development-scale"): "no equivalent in ODP",
    ("planning-application", "planning-performance-agreement"): "no equivalent in ODP",
    ("planning-application", "documentation-url"): "ODP has no concept of a landing page",
    ("site", "name"): "ODP has no plain language site name",
    ("site", "description"): "ODP has no plain language site description",
    ("decision-notice", "documentation-url"): "ODP has no concept of a landing page",
    ("planning-application-document", "documentation-url"): "ODP has no concept of a landing page",
    ("planning-application-document", "replaces"): "ODP carries a version number but does not name"
                                                   " the document replaced",
}


def table_name(dataset: str) -> str:
    """planning-application becomes national.planning_application."""
    return "national." + dataset.replace("-", "_")


def column_name(field: str) -> str:
    """application-types becomes application_types."""
    return field.replace("-", "_")


def create_tables(connection) -> None:
    """Eight tables generated from the vendored spec, so the spec stays the only field list.

    Every national field is held as text. These are register style datasets rather than a typed
    model: dates are ISO strings and geometry is GeoJSON, and keeping them as written means a
    value is never quietly reformatted on the way out.
    """
    connection.execute("CREATE SCHEMA IF NOT EXISTS national")

    for dataset, definition in DATASETS.items():
        columns = ",\n            ".join(
            f"{column_name(field):<32} VARCHAR" for field in definition["fields"]
        )
        connection.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {table_name(dataset)} (
            council                          VARCHAR NOT NULL,
            {columns},
            translated_at                    TIMESTAMP NOT NULL,
            PRIMARY KEY (council, reference)
            )
            """
        )

    # Anything the translator could not produce. Same rule as silver.mapping_issues: a gap is
    # recorded rather than guessed, so the distance to the national standard stays measurable.
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS national.translation_issues (
            council       VARCHAR NOT NULL,
            reference     VARCHAR NOT NULL,
            dataset       VARCHAR NOT NULL,
            field         VARCHAR,
            reason        VARCHAR NOT NULL,
            found_at      TIMESTAMP NOT NULL
        )
        """
    )


#: Events in the national vocabulary that no ODP record can date. Reported once in coverage
#: rather than against every record, because they are a limit of the standard and not of a record.
UNDATEABLE_EVENTS = {
    "publicity-start": "not held by ODP",
    "additional-information-requested": "not held by ODP",
    "additional-information-received": "not held by ODP",
    "call-in-direction-issued": "not held by ODP",
    "resolution-to-grant": "ODP records the committee decision, not the resolution behind it",
    "resolution-to-refuse": "ODP records the committee decision, not the resolution behind it",
    "time-extension-agreed": "not held by ODP",
    "committee-date": "ODP holds the date sent to committee, which is not the meeting date",
    "invalid-from": "ODP holds a validity flag with no date against it",
}

_POSTCODE = re.compile(r"([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\s*$", re.IGNORECASE)


def _ref(application_reference: str, *parts: str) -> str:
    """A reference the national model needs and ODP does not have.

    Built from the application reference so it is the same on every run, and so a person reading a
    row can see what it belongs to. The parent is recoverable by splitting on the colon, which is
    what the reverse direction relies on.
    """
    return ":".join([application_reference, *parts])


def _date(value) -> str | None:
    """A national date from an ODP timestamp. The time of day is not part of the national field."""
    if not value:
        return None
    if isinstance(value, (dt.date, dt.datetime)):
        return value.isoformat()[:10]
    return str(value)[:10] or None


def translate(record: dict, *, council: str, beside: dict | None = None) -> tuple[dict, list]:
    """One ODP record into rows across the eight national datasets.

    `beside` carries the columns silver keeps next to the record: address, description, applicant
    and officer. Legacy records have no submission block, so without those the site dataset would
    come out empty for every historic application, which would make the translation look worse
    than it really is.

    Returns the rows per dataset, and the gaps found, as (dataset, field, reason).
    """
    beside = beside or {}
    data = record.get("data") or {}
    metadata = record.get("metadata") or {}
    submitted = (record.get("submission") or {}).get("data") or {}

    application = data.get("application") or {}
    validation = data.get("validation") or {}
    assessment = data.get("assessment") or {}
    consultation = data.get("consultation") or {}
    property_ = submitted.get("property") or {}
    address = property_.get("address") or {}

    organisation = metadata.get("organisation") or council
    reference = application.get("reference") or metadata.get("id") or beside.get("reference") or ""

    rows: dict[str, list[dict]] = {name: [] for name in DATASETS}
    issues: list[tuple[str, str | None, str]] = []

    # --- site, which ODP does not model as a thing with its own identity --------------------
    site_reference = _ref(reference, "site")
    address_text = address.get("singleLine") or beside.get("address")
    postcode = address.get("postcode")
    if not postcode and address_text:
        found = _POSTCODE.search(address_text)
        postcode = found.group(1).upper() if found else None
    boundary = (property_.get("boundary") or {}).get("site")

    if not address_text:
        issues.append(("site", "address-text", "no address on the record"))
    if not boundary:
        issues.append(("site", "geometry", "no site boundary, a council publishes a point or nothing"))

    rows["site"].append({
        "reference": site_reference,
        "name": None,
        "address-text": address_text,
        "postcode": postcode,
        "description": None,
        "geometry": json.dumps(boundary, ensure_ascii=False) if boundary else None,
    })

    # --- the application itself -------------------------------------------------------------
    submitted_application = submitted.get("application") or {}
    linked = [
        (submitted_application.get("planningApp") or {}).get("reference"),
        (submitted_application.get("preApp") or {}).get("reference"),
    ]
    rows["planning-application"].append({
        "reference": reference,
        "description": (submitted.get("proposal") or {}).get("description")
                       or beside.get("description"),
        "application-types": record.get("applicationType"),
        "site": site_reference,
        "received-date": _date(validation.get("receivedAt")) or _date(beside.get("valid_from")),
        "planning-authority": organisation,
        "development-scale": None,
        "planning-performance-agreement": None,
        "withdrawn-date": _date(application.get("withdrawnAt")),
        "linked-applications": ";".join(r for r in linked if r) or None,
        "document-url": _application_form_url(record),
        "documentation-url": None,
    })

    # --- the decision, which the national model holds as its own record ---------------------
    decision = (assessment.get("committeeDecision") or assessment.get("planningOfficerDecision")
                or beside.get("decision"))
    decided_at = (_date(assessment.get("committeeDecisionDate"))
                  or _date(assessment.get("planningOfficerDecisionDate"))
                  or _date(beside.get("decided_at")))

    if decision:
        if assessment.get("committeeDecision"):
            maker = "committee"
        elif assessment.get("planningOfficerDecision"):
            maker = "planning-officer"
        else:
            maker = None
            issues.append(("decision-notice", "decision-maker",
                           "the export does not say who made the decision"))
        rows["decision-notice"].append({
            "reference": _ref(reference, "decision"),
            "planning-application": reference,
            "decision": decision,
            "decision-date": decided_at,
            "organisation": organisation,
            "decision-maker": maker,
            "planning-officer-recommendation": assessment.get("planningOfficerRecommendation"),
            "document-url": (assessment.get("decisionNotice") or {}).get("url"),
            "documentation-url": None,
        })

    # --- the three datasets ODP has no source for at all ------------------------------------
    for dataset, reason in NO_SOURCE_IN_ODP.items():
        issues.append((dataset, None, reason))

    # --- documents --------------------------------------------------------------------------
    for document in record.get("files") or []:
        rows["planning-application-document"].append({
            "reference": _ref(reference, "document", str(document.get("id") or "")),
            "planning-application": reference,
            "document-url": document.get("url"),
            "documentation-url": None,
            "name": document.get("name"),
            "replaces": None,
        })

    # --- the timeline, which is the real difference in shape --------------------------------
    for event, when in _timeline(data, validation, application, consultation, record):
        rows["planning-permission-timeline"].append({
            "reference": _ref(reference, "event", event),
            "planning-application": reference,
            "permission-process-event": event,
            "event-date": when,
        })

    return rows, issues


def _application_form_url(record: dict) -> str | None:
    """The national field means the completed application form, specifically.

    ODP lists files with a type from a controlled list, so the form can be picked out when the type
    is there. A record whose files carry no type gets nothing, rather than the first file.
    """
    for document in record.get("files") or []:
        types = document.get("type") or []
        values = [t.get("value") if isinstance(t, dict) else t for t in types]
        if any(value == "applicationForm" for value in values):
            return document.get("url")
    return None


def _timeline(data, validation, application, consultation, record) -> list[tuple[str, str]]:
    """Fixed ODP date fields turned into typed, dated events.

    Only events with a real date are emitted. The rest are in UNDATEABLE_EVENTS with the reason,
    because an invented date in a timeline is worse than a missing one.
    """
    consulted = [
        comment.get("firstConsultedAt")
        for comment in ((record.get("comments") or {}).get("specialist") or {}).get("comments") or []
        if comment.get("firstConsultedAt")
    ]

    candidates = [
        ("application-submitted", _date((data.get("submission") or {}).get("submittedAt"))),
        ("valid-from", _date(validation.get("validatedAt")) if validation.get("isValid") else None),
        ("validation-completed", _date(validation.get("validatedAt"))),
        ("application-published", _date(application.get("publishedAt"))),
        ("consultation-start", _date(consultation.get("startDate"))),
        ("consultation-end", _date(consultation.get("endDate"))),
        ("consultees-contacted", _date(min(consulted)) if consulted else None),
    ]
    return [(event, when) for event, when in candidates if when]


def translate_all(connection, council: str | None = None, *, approved_only: bool = True) -> dict:
    """Translate the gold layer into the national datasets. Returns rows written per dataset.

    Approved records only, by default. The national public view is a publication, so a record a
    person has not approved has no business in it, in the same way it has no business on the public
    endpoints.

    The national tables are rebuilt from gold on every run rather than merged into. Nothing here is
    hand edited and every row is derived, so rebuilding is the honest option: an event that stops
    being true in gold should stop existing here too.
    """
    create_tables(connection)

    conditions = []
    params: list = []
    if council:
        conditions.append("g.council = ?")
        params.append(council)
    if approved_only:
        conditions.append("g.approved")
    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    source = connection.execute(
        f"""
        SELECT g.council, g.reference, g.record,
               s.address, s.description, s.decision, s.valid_from, s.decided_at
        FROM gold.applications g
        LEFT JOIN silver.applications s
               ON s.council = g.council AND s.reference = g.reference
        {where}
        """,
        params,
    ).fetchall()

    translated_at = dt.datetime.now(dt.timezone.utc)
    collected: dict[str, list[dict]] = {name: [] for name in DATASETS}
    issues: list[tuple] = []

    for row in source:
        council_name, reference, raw, address, description, decision, valid_from, decided_at = row
        record = json.loads(raw) if isinstance(raw, str) else raw
        beside = {
            "reference": reference,
            "address": address,
            "description": description,
            "decision": decision,
            "valid_from": valid_from,
            "decided_at": decided_at,
        }
        rows, found = translate(record, council=council_name, beside=beside)

        for dataset, dataset_rows in rows.items():
            for dataset_row in dataset_rows:
                collected[dataset].append({"council": council_name, **dataset_row})
        issues.extend(
            (council_name, reference, dataset, field, reason, translated_at)
            for dataset, field, reason in found
        )

    _replace(connection, "national.translation_issues", council)
    written: dict[str, int] = {}
    for dataset, dataset_rows in collected.items():
        _replace(connection, table_name(dataset), council)
        written[dataset] = _insert(connection, dataset, dataset_rows, translated_at)

    if issues:
        connection.executemany(
            """
            INSERT INTO national.translation_issues
                (council, reference, dataset, field, reason, found_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            issues,
        )

    return written


def _replace(connection, table: str, council: str | None) -> None:
    """Clear the derived rows about to be rebuilt, for one council or for all of them."""
    if council:
        connection.execute(f"DELETE FROM {table} WHERE council = ?", [council])
    else:
        connection.execute(f"DELETE FROM {table}")


def _insert(connection, dataset: str, rows: list[dict], translated_at) -> int:
    """Insert rows for one dataset, with the column list taken from the spec."""
    if not rows:
        return 0

    fields = DATASETS[dataset]["fields"]
    columns = ["council"] + [column_name(field) for field in fields] + ["translated_at"]
    placeholders = ", ".join("?" for _ in columns)
    values = [
        [row["council"]] + [_text(row.get(field)) for field in fields] + [translated_at]
        for row in rows
    ]
    connection.executemany(
        f"INSERT INTO {table_name(dataset)} ({', '.join(columns)}) VALUES ({placeholders})",
        values,
    )
    return len(values)


def _text(value) -> str | None:
    """Every national field is held as written, so only dates need turning into text."""
    if value is None:
        return None
    if isinstance(value, (dt.date, dt.datetime)):
        return value.isoformat()
    return str(value)


# --- the reverse direction ------------------------------------------------------------------
#
# Translating back matters for two reasons. It is the only honest way to show what the national
# datasets do and do not carry, and it is what a council asks first: if we publish to the national
# standard, can the register still be fed from it?


def to_odp(rows: dict, *, council: str = "") -> dict:
    """National rows for one application, back into an ODP record.

    Only what the national datasets actually carry. Nothing is filled in from somewhere else, so
    what comes back is smaller than what went out, and round_trip names the difference.
    """
    application = (rows.get("planning-application") or [{}])[0]
    site = (rows.get("site") or [{}])[0]
    notice = (rows.get("decision-notice") or [{}])[0]
    timeline = {
        row.get("permission-process-event"): row.get("event-date")
        for row in rows.get("planning-permission-timeline") or []
    }

    reference = application.get("reference")
    organisation = application.get("planning-authority") or council

    data: dict = {
        "application": {
            "reference": reference,
            "stage": "assessment" if notice.get("decision") else "validation",
            "status": "determined" if notice.get("decision") else "undetermined",
            "publishedAt": _stamp(timeline.get("application-published")),
        },
        "submission": {"submittedAt": _stamp(timeline.get("application-submitted"))},
        "validation": {
            "receivedAt": _stamp(application.get("received-date")),
            "validatedAt": _stamp(timeline.get("validation-completed")),
            "isValid": "valid-from" in timeline,
        },
    }
    if application.get("withdrawn-date"):
        data["application"]["withdrawnAt"] = _stamp(application["withdrawn-date"])

    if timeline.get("consultation-start") or timeline.get("consultation-end"):
        data["consultation"] = {
            "startDate": timeline.get("consultation-start"),
            "endDate": timeline.get("consultation-end"),
        }

    if notice.get("decision"):
        committee = notice.get("decision-maker") == "committee"
        assessment: dict = {}
        # A decision date is a date in both standards, so it goes back as written. Only the
        # fields the record builder holds as timestamps are turned back into timestamps.
        if committee:
            assessment["committeeDecision"] = notice["decision"]
            assessment["committeeDecisionDate"] = notice.get("decision-date")
        else:
            assessment["planningOfficerDecision"] = notice["decision"]
            assessment["planningOfficerDecisionDate"] = notice.get("decision-date")
        if notice.get("planning-officer-recommendation"):
            assessment["planningOfficerRecommendation"] = notice["planning-officer-recommendation"]
        if notice.get("document-url"):
            assessment["decisionNotice"] = {"url": notice["document-url"]}
        data["assessment"] = assessment

    record: dict = {
        "applicationType": application.get("application-types"),
        "data": data,
        "metadata": {"organisation": organisation, "id": reference},
    }

    submitted: dict = {}
    if site.get("address-text") or site.get("postcode"):
        submitted["property"] = {
            "address": {
                "singleLine": site.get("address-text"),
                "postcode": site.get("postcode"),
            }
        }
    if site.get("geometry"):
        submitted.setdefault("property", {})["boundary"] = {
            "site": json.loads(site["geometry"])
        }
    if application.get("description"):
        submitted["proposal"] = {"description": application["description"]}
    if submitted:
        record["submission"] = {"data": submitted}

    documents = rows.get("planning-application-document") or []
    if documents:
        record["files"] = [
            {
                "id": (document.get("reference") or "").split(":")[-1] or None,
                "url": document.get("document-url"),
                "name": document.get("name"),
            }
            for document in documents
        ]

    return record


def _stamp(date: str | None) -> str | None:
    """A national date back into an ODP timestamp. Midnight, because the time was never carried."""
    if not date:
        return None
    return f"{str(date)[:10]}T00:00:00Z"


def round_trip(record: dict, *, council: str, beside: dict | None = None) -> dict:
    """ODP, into the national datasets, and back. What survives and what does not.

    Four answers, and the difference between them matters:

      kept      came back exactly
      trimmed   came back as the same day without the time, because the national view holds a
                date where ODP holds a timestamp
      changed   came back as something else, which is a fault in the translation
      lost      the national public view does not carry it at all, which is a question for the
                standard rather than a fault in the code
    """
    rows, _ = translate(record, council=council, beside=beside)
    single = {dataset: dataset_rows for dataset, dataset_rows in rows.items()}
    back = to_odp(single, council=council)

    before = _flatten(record)
    after = _flatten(back)

    kept, trimmed, changed = [], [], []
    for path, value in before.items():
        if path not in after:
            continue
        if value == after[path]:
            kept.append(path)
        elif _same_day(value, after[path]):
            trimmed.append(path)
        else:
            changed.append(path)

    lost = sorted(path for path in before if path not in after)
    added = sorted(path for path in after if path not in before)

    return {
        "kept": sorted(kept),
        "trimmed": sorted(trimmed),
        "changed": sorted(changed),
        "lost": lost,
        "added": added,
        "record": back,
    }


def _same_day(before, after) -> bool:
    """The same day, with the time of day gone.

    The national public view carries a date where ODP carries a timestamp, so a time cannot
    survive the trip. That is a property of the standard rather than a fault, and it is reported
    on its own so it does not hide among real differences.
    """
    if not isinstance(before, str) or not isinstance(after, str):
        return False
    return len(before) > 10 and before[:10] == after[:10]


def _flatten(value, prefix: str = "") -> dict:
    """Leaf paths and their values, so two records can be compared without reading them."""
    flat: dict = {}
    if isinstance(value, dict):
        for key, inner in value.items():
            flat.update(_flatten(inner, f"{prefix}.{key}" if prefix else str(key)))
    elif isinstance(value, list):
        for index, inner in enumerate(value):
            flat.update(_flatten(inner, f"{prefix}[{index}]"))
    else:
        flat[prefix] = value
    return flat


# --- reporting ------------------------------------------------------------------------------


def coverage(connection, council: str | None = None) -> list[dict]:
    """How much of the national public view we can actually fill, field by field.

    A field counts as filled when a row has a value in it. The reason column says why a field is
    empty where the reason is the standard rather than the data.
    """
    report: list[dict] = []
    where = "WHERE council = ?" if council else ""
    params = [council] if council else []

    for dataset, definition in DATASETS.items():
        table = table_name(dataset)
        total = connection.execute(f"SELECT count(*) FROM {table} {where}", params).fetchone()[0]
        for field in definition["fields"]:
            column = column_name(field)
            filled = connection.execute(
                f"SELECT count({column}) FROM {table} {where}", params
            ).fetchone()[0] if total else 0
            reason = NO_SOURCE_FIELDS.get((dataset, field))
            if reason is None and dataset in NO_SOURCE_IN_ODP:
                reason = NO_SOURCE_IN_ODP[dataset]
            report.append({
                "dataset": dataset,
                "field": field,
                "rows": total,
                "filled": filled,
                "reason": reason,
            })
    return report


def summary(connection, council: str | None = None) -> dict:
    """The headline: how many of the 52 fields come out with something in them."""
    report = coverage(connection, council)
    filled = [line for line in report if line["filled"]]
    structural = [line for line in report if not line["filled"] and line["reason"]]
    return {
        "fields": len(report),
        "filled": len(filled),
        "empty_by_standard": len(structural),
        "empty_by_data": len(report) - len(filled) - len(structural),
        "rows": {
            dataset: connection.execute(
                f"SELECT count(*) FROM {table_name(dataset)}"
                + (" WHERE council = ?" if council else ""),
                [council] if council else [],
            ).fetchone()[0]
            for dataset in DATASETS
        },
    }


def export(connection, directory, council: str | None = None) -> dict:
    """One CSV per dataset, which is how the national datasets are published.

    CSV rather than a database dump, for the same reason the council exports are CSV: anyone can
    open it, and it does not need the product it came out of.
    """
    import csv
    from pathlib import Path as _Path

    directory = _Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    written: dict[str, int] = {}

    for dataset, definition in DATASETS.items():
        fields = definition["fields"]
        columns = [column_name(field) for field in fields]
        where = "WHERE council = ?" if council else ""
        rows = connection.execute(
            f"SELECT {', '.join(columns)} FROM {table_name(dataset)} {where} ORDER BY reference",
            [council] if council else [],
        ).fetchall()

        path = directory / f"{dataset}.csv"
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(fields)
            writer.writerows(rows)
        written[dataset] = len(rows)

    return written
