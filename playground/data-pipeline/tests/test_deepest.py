"""Which alternative of the schema a failure is reported against."""

from dpr_pipeline import validate


def _alternatives():
    """Three alternatives by application type. The record's own type has the most to say, and a
    wrong type fails on fewer things, which used to make it look like the nearest fit."""
    def alt(kind, extra):
        return {"type": "object", "required": ["applicationType", *extra],
                "properties": {"applicationType": {"const": kind}}}
    return {"anyOf": [alt("amendment.minorMaterial", []), alt("wtt.consent", ["site", "agent"]),
                      alt("advertConsent", [])]}


def test_the_alternative_for_the_records_own_type_is_the_one_reported():
    from jsonschema import Draft202012Validator

    schema = _alternatives()
    errors = [real for error in Draft202012Validator(schema).iter_errors({"applicationType": "wtt.consent"})
              for real in validate._deepest(error)]
    messages = " ".join(e.message for e in errors)
    assert "'site' is a required property" in messages
    assert "'agent' is a required property" in messages
    assert "was expected" not in messages


def test_a_type_that_matches_nothing_still_reports_something():
    from jsonschema import Draft202012Validator

    errors = [real for error in Draft202012Validator(_alternatives()).iter_errors({"applicationType": "nope"})
              for real in validate._deepest(error)]
    assert errors
