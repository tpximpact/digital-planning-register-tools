"""Documents and comments, the things that hang off an application.

The standard serves three of them next to each application: its documents, the public's comments
and the specialists' comments. None of them come from a council's planning export, so they are
held apart from the application records, one row each, in gold.items.

An item is stored exactly as the standard describes it, unredacted. The public side is the same
item with the private parts taken out (see redact), so there is one copy to keep right.

Items arrive two ways: attached from a file in the standard's own shape (attach_record), or sent in
by the public (add_public_comment), which waits unpublished until somebody publishes it.
"""

from __future__ import annotations

import datetime as dt
import json
from typing import Any

DOCUMENTS = "documents"
PUBLIC_COMMENTS = "publicComments"
SPECIALIST_COMMENTS = "specialistComments"
KINDS = (DOCUMENTS, PUBLIC_COMMENTS, SPECIALIST_COMMENTS)


def _now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)


def _stamp(item: dict) -> str:
    metadata = item.get("metadata") or {}
    return (metadata.get("publishedAt") or metadata.get("submittedAt")
            or item.get("firstConsultedAt") or _now().isoformat())


# ------------------------------------------------------------------ writing

def put(connection, council: str, reference: str, kind: str, item: dict,
        published: bool = True) -> dict:
    """Store one item, replacing any with the same id."""
    assert kind in KINDS, kind
    item_id = str(item["id"])
    connection.execute(
        """
        INSERT INTO gold.items (council, reference, kind, item_id, published, published_at, record)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (council, reference, kind, item_id) DO UPDATE SET
            published = excluded.published,
            published_at = excluded.published_at,
            record = excluded.record
        """,
        [council, reference, kind, item_id, published, _stamp(item), json.dumps(item)],
    )
    return item


def attach_record(connection, council: str, reference: str, record: dict) -> dict[str, int]:
    """Take the files and comments out of a record in the standard's shape and store them."""
    comments = record.get("comments") or {}
    found = {
        DOCUMENTS: record.get("files") or [],
        PUBLIC_COMMENTS: _listed(comments.get("public")),
        SPECIALIST_COMMENTS: _listed(comments.get("specialist")),
    }
    for kind, entries in found.items():
        for entry in entries:
            put(connection, council, reference, kind, entry)
    return {kind: len(entries) for kind, entries in found.items()}


def _listed(block: Any) -> list[dict]:
    """The standard wraps comments as {summary, comments: [...]}, a bare list is accepted too."""
    if isinstance(block, dict):
        return block.get("comments") or []
    return block or []


def add_public_comment(connection, council: str, reference: str, body: dict) -> dict:
    """A comment sent in by the public. It waits, unpublished, until somebody publishes it."""
    existing = [int(i) for (i,) in connection.execute(
        "SELECT item_id FROM gold.items WHERE council = ? AND reference = ? AND kind = ?",
        [council, reference, PUBLIC_COMMENTS]).fetchall() if str(i).isdigit()]
    item = {
        "id": str(max(existing, default=0) + 1),
        "sentiment": body["sentiment"],
        "author": body["author"],
        "comment": body["comment"],
        # Redaction is a person's job. Until they do it nothing is shown to the public anyway.
        "commentRedacted": body.get("commentRedacted") or [],
        "metadata": {"submittedAt": _now().isoformat() + "Z"},
    }
    return put(connection, council, reference, PUBLIC_COMMENTS, item, published=False)


def publish_comment(connection, council: str, reference: str, item_id: str) -> bool:
    row = connection.execute(
        "SELECT record FROM gold.items WHERE council = ? AND reference = ? AND kind = ? "
        "AND item_id = ?", [council, reference, PUBLIC_COMMENTS, item_id]).fetchone()
    if row is None:
        return False
    item = json.loads(row[0]) if isinstance(row[0], str) else row[0]
    item.setdefault("metadata", {})["publishedAt"] = _now().isoformat() + "Z"
    put(connection, council, reference, PUBLIC_COMMENTS, item, published=True)
    return True


def awaiting_redaction(connection, council: str | None = None) -> list[tuple[str, str, dict]]:
    """Public comments nobody has checked for things that should not be public yet.

    Returns (council, reference, comment). A comment is checked once somebody saves its redaction,
    even if the redaction is "nothing to hide", so it does not come round again.
    """
    rows = connection.execute(
        "SELECT council, reference, record FROM gold.items WHERE kind = ?"
        + (" AND council = ?" if council else ""),
        [PUBLIC_COMMENTS] + ([council] if council else [])).fetchall()
    waiting = []
    for row_council, reference, record in rows:
        item = json.loads(record) if isinstance(record, str) else record
        if not (item.get("metadata") or {}).get("redactionReviewedAt"):
            waiting.append((row_council, reference, item))
    return waiting


def redaction_counts(connection, council: str | None = None) -> dict[str, int]:
    rows = connection.execute(
        "SELECT record FROM gold.items WHERE kind = ?" + (" AND council = ?" if council else ""),
        [PUBLIC_COMMENTS] + ([council] if council else [])).fetchall()
    reviewed = sum(1 for (r,) in rows
                   if (json.loads(r) if isinstance(r, str) else r).get("metadata", {})
                   .get("redactionReviewedAt"))
    return {"awaiting": len(rows) - reviewed, "reviewed": reviewed}


def set_redaction(connection, council: str, reference: str, item_id: str,
                  redacted: list[dict], publish: bool = True) -> bool:
    """Save the redacted wording of a comment, mark it checked and, usually, publish it."""
    item = one(connection, council, reference, PUBLIC_COMMENTS, item_id, published_only=False)
    if item is None:
        return False
    stamp = _now().isoformat() + "Z"
    item["commentRedacted"] = redacted
    item.setdefault("metadata", {})["redactionReviewedAt"] = stamp
    if publish:
        item["metadata"].setdefault("publishedAt", stamp)
    put(connection, council, reference, PUBLIC_COMMENTS, item, published=publish)
    return True


# ------------------------------------------------------------------ reading

def fetch(connection, council: str, reference: str, kind: str, published_only: bool) -> list[dict]:
    rows = connection.execute(
        "SELECT record FROM gold.items WHERE council = ? AND reference = ? AND kind = ?"
        + (" AND published = true" if published_only else ""),
        [council, reference, kind]).fetchall()
    return [json.loads(r[0]) if isinstance(r[0], str) else r[0] for r in rows]


def one(connection, council: str, reference: str, kind: str, item_id: str,
        published_only: bool) -> dict | None:
    for item in fetch(connection, council, reference, kind, published_only):
        if str(item["id"]) == str(item_id):
            return item
    return None


def redact(kind: str, item: dict) -> dict:
    """The public copy of an item: the same, with what is private taken out."""
    if kind == DOCUMENTS:
        return {k: v for k, v in item.items() if k != "url"}
    if kind == PUBLIC_COMMENTS:
        keep = ("id", "sentiment", "metadata", "commentRedacted")
        out = {k: v for k, v in item.items() if k in keep}
        out["author"] = {"name": (item.get("author") or {}).get("name", {"singleLine": ""})}
        return out
    out = {k: v for k, v in item.items() if k != "address"}
    out["comments"] = [{k: v for k, v in c.items() if k != "comment"}
                       for c in item.get("comments") or []]
    return out


def summary(kind: str, entries: list[dict]) -> dict:
    """The counts that sit above a list of comments."""
    if kind == PUBLIC_COMMENTS:
        counts = {"objection": 0, "neutral": 0, "supportive": 0}
        for entry in entries:
            counts[entry.get("sentiment")] = counts.get(entry.get("sentiment"), 0) + 1
        return {"totalComments": len(entries), "sentiment": counts}

    counts = {"approved": 0, "amendmentsNeeded": 0, "objected": 0}
    total = 0
    for specialist in entries:
        for comment in specialist.get("comments") or []:
            total += 1
            counts[comment.get("sentiment")] = counts.get(comment.get("sentiment"), 0) + 1
    return {"totalComments": total, "totalConsulted": len(entries), "sentiment": counts}


# ------------------------------------------------------------------ filtering

def _text(item: dict) -> str:
    return json.dumps(item, ensure_ascii=False).lower()


def _topics(item: dict) -> set[str]:
    parts = item.get("commentRedacted") or item.get("comment") or []
    return {p.get("topic") for p in parts if isinstance(p, dict)}


def _published(item: dict) -> str:
    return _stamp(item)


def filtered(kind: str, entries: list[dict], *, query: str | None = None,
             sentiment: str | None = None, topic: str | None = None,
             published_from: str | None = None, published_to: str | None = None,
             name: str | None = None, doc_type: str | None = None) -> list[dict]:
    result = []
    for item in entries:
        if query and query.lower() not in _text(item):
            continue
        if sentiment:
            if kind == SPECIALIST_COMMENTS:
                if not any(c.get("sentiment") == sentiment for c in item.get("comments") or []):
                    continue
            elif item.get("sentiment") != sentiment:
                continue
        if topic and topic not in _topics(item):
            continue
        if published_from and _published(item)[:10] < published_from[:10]:
            continue
        if published_to and _published(item)[:10] > published_to[:10]:
            continue
        if name and name.lower() not in (item.get("name") or "").lower():
            continue
        if doc_type and doc_type not in (item.get("type") or []):
            continue
        result.append(item)
    return result


def ordered(kind: str, entries: list[dict], sort_by: str, order_by: str) -> list[dict]:
    if sort_by == "name":
        key = lambda item: (item.get("name") or "").lower()  # noqa: E731
    else:
        key = _published
    return sorted(entries, key=key, reverse=(order_by == "desc"))
