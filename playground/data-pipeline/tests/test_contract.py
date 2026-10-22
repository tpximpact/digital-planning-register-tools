"""Checking responses against the standard's OpenAPI spec.

The first group needs no spec file. The second needs one: download openapi.json from the schemas
repository to data/openapi.json, or point DPR_OPENAPI at it. Without it they skip.
"""

import datetime as dt
import json
import os
from pathlib import Path

import pytest

from dpr_pipeline import contract, post_submission
from dpr_pipeline.api_responses import envelope

TINY = {
    "openapi": "3.1.1",
    "paths": {
        "/api/@next/applications": {"get": {"operationId": "list", "responses": {"200": {
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/many"}}}}}}},
        "/api/@next/applications/{applicationId}": {"get": {"operationId": "one", "responses": {
            "200": {"content": {"application/json": {"schema": {"$ref": "#/components/schemas/one"}}}}}}},
        "/api/@next/applications/{applicationId}/documents": {"get": {"operationId": "docs",
                                                                       "responses": {}}},
    },
    "components": {"schemas": {
        "many": {"$id": "#/components/schemas/many", "type": "object",
                 "properties": {"data": {"type": "array", "items": {"type": "string"}}},
                 "required": ["data"]},
        "one": {"$id": "#/components/schemas/one", "type": "object",
                "properties": {"data": {"type": "string"}}, "required": ["data"]},
    }},
}


@pytest.fixture
def tiny(tmp_path):
    path = tmp_path / "openapi.json"
    path.write_text(json.dumps(TINY))
    contract.load.cache_clear()
    contract._validator.cache_clear()
    return str(path)


def test_a_path_with_slashes_in_the_reference_finds_its_operation(tiny):
    spec = contract.load(tiny)
    template, operation = contract.find_operation(spec, "GET", "/api/@next/applications/24/0001/FUL")
    assert operation["operationId"] == "one"
    assert contract.find_operation(spec, "GET", "/api/@next/applications/24/0001/FUL/documents")[0] \
        .endswith("/documents")


def test_the_more_literal_template_wins(tiny):
    spec = contract.load(tiny)
    assert contract.find_operation(spec, "GET", "/api/@next/applications")[1]["operationId"] == "list"


def test_a_good_body_is_valid_and_a_bad_one_says_where(tiny):
    good = contract.check(tiny, "GET", "/api/@next/applications/x", 200, {"data": "ok"})
    assert good["valid"] is True
    bad = contract.check(tiny, "GET", "/api/@next/applications/x", 200, {"data": 5})
    assert bad["valid"] is False
    assert bad["errors"][0].startswith("data:")


def test_a_path_the_spec_does_not_have_is_reported_not_guessed(tiny):
    result = contract.check(tiny, "GET", "/nowhere", 200, {})
    assert result["valid"] is None


def test_a_missing_spec_says_so():
    contract.load.cache_clear()
    info = contract.describe("/no/such/openapi.json")
    assert info["loaded"] is False


# ---- against the real spec

def _spec_path():
    for candidate in (os.getenv("DPR_OPENAPI"), "data/openapi.json"):
        if candidate and Path(candidate).is_file():
            return candidate
    pytest.skip("no openapi.json, set DPR_OPENAPI or put it at data/openapi.json")


def _record(**extra):
    return post_submission.build(
        council="camden", application_type="pp.full.householder", reference="24-0001-FUL",
        received_at=dt.date(2024, 2, 18), validated_at=dt.date(2024, 2, 19),
        decided_at=dt.date(2024, 3, 21), officer_name="A Officer", decision="granted",
        expiry_date=dt.date(2024, 4, 11), applicant_name="A Owner", address="12 High Road",
        description="Rear extension", **extra)


def test_a_built_record_is_accepted_as_a_published_application():
    path = _spec_path()
    record = json.loads(json.dumps(_record()))
    result = contract.check(path, "GET", "/api/@next/public/applications/24-0001-FUL", 200,
                            envelope(record))
    assert result["errors"] == []
    assert result["valid"] is True


def test_a_list_of_records_is_accepted():
    path = _spec_path()
    record = json.loads(json.dumps(_record()))
    pagination = {"resultsPerPage": 10, "currentPage": 1, "totalPages": 1,
                  "totalResults": 1, "totalAvailableItems": 1}
    result = contract.check(path, "GET", "/api/@next/public/applications", 200,
                            envelope([record], pagination))
    assert result["valid"] is True, result["errors"]


def test_a_decision_without_an_expiry_date_is_the_known_gap():
    path = _spec_path()
    record = json.loads(json.dumps(post_submission.build(
        council="camden", application_type="pp.full.householder", reference="x",
        received_at=dt.date(2024, 2, 18), validated_at=dt.date(2024, 2, 19),
        decided_at=dt.date(2024, 3, 21), officer_name="o", decision="granted")))
    result = contract.check(path, "GET", "/api/@next/public/applications/x", 200, envelope(record))
    assert result["valid"] is False
    assert all("expiryDate" in error for error in result["errors"])


def test_the_error_envelope_is_accepted():
    path = _spec_path()
    for status in (400, 404, 422, 500):
        result = contract.check(path, "GET", "/api/@next/public/applications/x", status,
                                envelope(None, code=status, message="Problem"))
        assert result["valid"] is True, (status, result["errors"])


# ---- the running API against the real spec (needs fastapi, so it sits with the API tests)

from .test_api import CAMDEN, PUBLIC, REFERENCE, UNREDACTED, attached, client  # noqa: E402,F401


def _only_the_known_gap(result):
    return all("expiryDate" in error for error in result["errors"])


@pytest.mark.parametrize("path", [
    PUBLIC, f"{PUBLIC}/{REFERENCE}", f"{PUBLIC}/{REFERENCE}/documents",
    f"{PUBLIC}/{REFERENCE}/documents/1", f"{PUBLIC}/{REFERENCE}/publicComments",
    f"{PUBLIC}/{REFERENCE}/publicComments/1", f"{PUBLIC}/{REFERENCE}/specialistComments",
    f"{PUBLIC}/{REFERENCE}/specialistComments/1",
    UNREDACTED, f"{UNREDACTED}/{REFERENCE}", f"{UNREDACTED}/{REFERENCE}/documents",
    f"{UNREDACTED}/{REFERENCE}/publicComments", f"{UNREDACTED}/{REFERENCE}/specialistComments",
])
def test_every_get_endpoint_answers_in_the_shape_the_spec_promises(attached, path):
    spec = _spec_path()
    response = attached.get(path, headers=CAMDEN)
    assert response.status_code == 200
    result = contract.check(spec, "GET", path, 200, response.json())
    assert result["valid"] is not None, result["errors"]
    assert result["valid"] or _only_the_known_gap(result), result["errors"]


def test_a_404_from_the_api_fits_the_spec(attached):
    spec = _spec_path()
    path = f"{PUBLIC}/NOPE"
    response = attached.get(path, headers=CAMDEN)
    assert contract.check(spec, "GET", path, 404, response.json())["valid"] is True
