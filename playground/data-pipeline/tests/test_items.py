"""Documents and comments, the parts that need no database."""

from dpr_pipeline import items

PUBLIC = {
    "id": "1", "sentiment": "objection",
    "author": {"name": {"singleLine": "A Neighbour"},
               "address": {"line1": "1 Road", "town": "Town", "postcode": "AA1 1AA"}},
    "comment": [{"topic": "noise", "question": "Q", "comment": "far too loud"}],
    "commentRedacted": [{"topic": "noise", "question": "Q", "comment": "[redacted]"}],
    "metadata": {"publishedAt": "2024-03-01T10:00:00.000Z"},
}
DOCUMENT = {
    "id": 1, "name": "plans.pdf", "association": "application", "type": ["sitePlan.proposed"],
    "url": "https://private/plans.pdf", "redactedUrl": "https://public/plans.pdf",
    "metadata": {"publishedAt": "2024-02-19T15:54:31.021Z"},
}
SPECIALIST = {
    "id": "1", "name": {"singleLine": "Jane"}, "address": {"line1": "x"},
    "comments": [
        {"id": "2", "sentiment": "approved", "comment": "fine", "commentRedacted": "fine"},
        {"id": "3", "sentiment": "objected", "comment": "no", "commentRedacted": "no"},
    ],
}


def test_the_public_comment_loses_the_comment_and_the_authors_address():
    shown = items.redact(items.PUBLIC_COMMENTS, PUBLIC)
    assert "comment" not in shown
    assert shown["author"] == {"name": {"singleLine": "A Neighbour"}}
    assert shown["commentRedacted"][0]["comment"] == "[redacted]"


def test_the_public_document_loses_its_private_url():
    shown = items.redact(items.DOCUMENTS, DOCUMENT)
    assert "url" not in shown
    assert shown["redactedUrl"] == "https://public/plans.pdf"


def test_the_public_specialist_loses_the_address_and_the_unredacted_comments():
    shown = items.redact(items.SPECIALIST_COMMENTS, SPECIALIST)
    assert "address" not in shown
    assert all("comment" not in c for c in shown["comments"])
    assert shown["comments"][0]["commentRedacted"] == "fine"


def test_redacting_does_not_change_the_stored_item():
    items.redact(items.PUBLIC_COMMENTS, PUBLIC)
    assert "comment" in PUBLIC


def test_summaries_count_by_sentiment():
    assert items.summary(items.PUBLIC_COMMENTS, [PUBLIC, {**PUBLIC, "sentiment": "supportive"}]) == {
        "totalComments": 2, "sentiment": {"objection": 1, "neutral": 0, "supportive": 1}}
    assert items.summary(items.SPECIALIST_COMMENTS, [SPECIALIST]) == {
        "totalComments": 2, "totalConsulted": 1,
        "sentiment": {"approved": 1, "amendmentsNeeded": 0, "objected": 1}}


def test_filters():
    other = {**PUBLIC, "id": "2", "sentiment": "supportive",
             "commentRedacted": [{"topic": "design", "question": "Q", "comment": "lovely"}],
             "metadata": {"publishedAt": "2024-04-01T00:00:00.000Z"}}
    both = [PUBLIC, other]
    kind = items.PUBLIC_COMMENTS
    assert items.filtered(kind, both, sentiment="supportive") == [other]
    assert items.filtered(kind, both, topic="noise") == [PUBLIC]
    assert items.filtered(kind, both, query="LOVELY") == [other]
    assert items.filtered(kind, both, published_from="2024-03-15") == [other]
    assert items.filtered(kind, both, published_to="2024-03-15") == [PUBLIC]
    assert items.filtered(items.DOCUMENTS, [DOCUMENT], doc_type="sitePlan.proposed") == [DOCUMENT]
    assert items.filtered(items.DOCUMENTS, [DOCUMENT], name="PLANS") == [DOCUMENT]
    assert items.filtered(items.DOCUMENTS, [DOCUMENT], doc_type="floorPlan.proposed") == []
    assert items.filtered(items.SPECIALIST_COMMENTS, [SPECIALIST], sentiment="objected") == [SPECIALIST]


def test_ordering():
    later = {**PUBLIC, "id": "2", "metadata": {"publishedAt": "2024-04-01T00:00:00.000Z"}}
    assert items.ordered(items.PUBLIC_COMMENTS, [PUBLIC, later], "publishedAt", "desc")[0] == later
    assert items.ordered(items.PUBLIC_COMMENTS, [PUBLIC, later], "publishedAt", "asc")[0] == PUBLIC
    b, a = {**DOCUMENT, "name": "b"}, {**DOCUMENT, "name": "a"}
    assert items.ordered(items.DOCUMENTS, [b, a], "name", "asc") == [a, b]


def test_comments_may_arrive_wrapped_or_bare():
    assert items._listed({"summary": {}, "comments": [PUBLIC]}) == [PUBLIC]
    assert items._listed([PUBLIC]) == [PUBLIC]
    assert items._listed(None) == []
