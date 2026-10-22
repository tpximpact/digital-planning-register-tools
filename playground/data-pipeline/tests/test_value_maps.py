"""The value mappers: the library, the checks, the fetchers and `dpr mappers`. No network."""

import argparse
import json

import pytest

from dpr_pipeline.value_maps import Library, check, fetch, targets, view
from dpr_pipeline.value_maps import cli as mappers_cli

DOMAIN = "portal.example.gov.uk"

IDOX_PAGE = """
<html><body><form>
<select id="caseStatus"><option value="">Any</option><option value="Granted">Granted</option>
  <option value="Received"> Received
  here </option></select>
<select id="caseDecision"><option value="">Any</option><option value="REF">Refused &amp; closed</option></select>
<select id="caseType"><option value="ADV">Adverts (ADV)</option><option value="A21">A21</option></select>
<select id="other"><option value="x">not wanted</option></select>
</form></body></html>
"""


def _json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")


@pytest.fixture
def library(tmp_path):
    root = tmp_path / "mappers"
    types = root / "application_types"
    _json(types / "mhclg_types.json", ["advertising", "change-of-use", "ldc", "split"])
    _json(types / "mhclg_context.json",
          {"advertising": {"name": "Advertising", "description": "Signs and adverts"}})
    _json(types / "odp_types.json", ["advertConsent", "ldc.existing", "ldc.proposed"])
    (types / "mapping.csv").write_text(
        "mhclg_type,odp_type,notes\n"
        "advertising,advertConsent,\n"
        "ldc,ldc,\n"                                   # a parent, not a value the standard accepts
        "split,ldc.existing,[check] also mapped to other\n"
        "split,ldc.proposed,[check] also mapped to other\n"
        "retired,advertConsent,\n",                    # the source no longer offers it
        encoding="utf-8")
    _json(root / "idox" / "odp_statuses.json", ["determined", "undetermined"])
    _json(root / "idox" / "odp_decisions.json", ["granted", "refused"])
    portal = root / "idox" / DOMAIN
    _json(portal / "idox_status.json", [{"value": "Granted", "text": "Granted"},
                                        {"value": "Received", "text": "Received"}])
    _json(portal / "idox_decision.json", [{"value": "REF", "text": "Refused"}])
    _json(portal / "idox_caseType.json", [{"value": "ADV", "text": "Adverts"}])
    (portal / "mapping_status.csv").write_text(
        "idox_value,idox_text,odp_type,notes\nGranted,Granted,determined,\n", encoding="utf-8")
    (portal / "mapping_decision.csv").write_text(
        "idox_value,idox_text,odp_type,notes\nREF,Refused,refused,\n", encoding="utf-8")
    return Library(root)


def _run(library, *argv):
    lines = []
    parser = argparse.ArgumentParser()
    mappers_cli.add_arguments(parser)
    code = mappers_cli.run(parser.parse_args(list(argv)), library, out=lines.append)
    return code, "\n".join(lines)


# --- the library --------------------------------------------------------------------------------

def test_the_tables_are_found_and_only_status_and_decision_are_required(library):
    ids = {t.id: t.required for t in library.tables()}
    assert ids == {"application-types": True, f"idox/{DOMAIN}/status": True,
                   f"idox/{DOMAIN}/decision": True, f"idox/{DOMAIN}/caseType": False}


def test_a_table_can_be_named_by_the_start_of_its_id(library):
    assert [t.id for t in library.matching(["idox"])] == [
        f"idox/{DOMAIN}/status", f"idox/{DOMAIN}/decision", f"idox/{DOMAIN}/caseType"]
    assert len(library.matching([])) == 4
    assert library.matching(["idox/nothing"]) == []


def test_source_options_carry_the_mhclg_name_and_description(library):
    first = library.source_options(library.application_table())[0]
    assert first == {"value": "advertising", "text": "Advertising",
                     "description": "Signs and adverts"}


def test_targets_fall_back_to_the_schemas_bundled_with_the_pipeline(tmp_path):
    empty = Library(tmp_path / "nothing")
    assert empty.targets("status") == ["determined", "returned", "undetermined", "withdrawn"]
    assert empty.targets("decision") == ["granted", "refused"]
    assert "pp.full.minor" in empty.targets("application_type")


def test_the_bundled_target_lists_leave_out_the_parent_names():
    bundled = targets.from_bundled_schemas()["application_type"]
    for parent in ("pp", "pp.full", "ldc", "pa", "amendment"):
        assert parent not in bundled


# --- checks -------------------------------------------------------------------------------------

def test_a_value_can_map_to_two_standard_values_and_still_counts_once(library):
    result = check(library, library.application_table())
    assert result.total == 4 and result.mapped == 2          # advertising, split
    assert [u["value"] for u in result.unmapped] == ["change-of-use"]
    assert result.review == 1                                  # split, noted [check]


def test_invalid_rows_say_why(library):
    result = check(library, library.application_table())
    reasons = {i["value"]: i["problem"] for i in result.invalid}
    assert "not a value the standard accepts" in reasons["ldc"]
    assert "no longer offers" in reasons["retired"]
    assert result.blocking


def test_an_identical_mapping_listed_twice_is_invalid(library):
    table = library.application_table()
    library.write_rows(table, library.read_rows(table) + [
        {"mhclg_type": "advertising", "odp_type": "advertConsent", "notes": ""}])
    problems = [i["problem"] for i in check(library, table).invalid if i["value"] == "advertising"]
    assert problems == ["the same mapping is listed twice"]


def test_unused_standard_values_are_listed(library):
    assert check(library, library.application_table()).unused == []
    table = library.table(f"idox/{DOMAIN}/status")
    assert check(library, table).unused == ["undetermined"]


def test_only_required_tables_block(library):
    case_type = check(library, library.table(f"idox/{DOMAIN}/caseType"))
    assert case_type.unmapped and not case_type.ok and not case_type.blocking


def test_a_value_left_empty_on_purpose_counts_as_done_but_not_as_mapped(library):
    table = library.application_table()
    library.save(table, [
        {"value": "change-of-use", "entries": [{"target": "", "notes": "[no fit] not an application"}]}])
    result = check(library, table)
    assert [n["value"] for n in result.no_fit] == ["change-of-use"]
    assert result.unmapped == [] and result.mapped == 2 and result.resolved == 3
    states = {r["value"]: r["state"] for r in view(library, table)["rows"]}
    assert states["change-of-use"] == "nofit"


def test_a_no_fit_note_does_not_override_a_real_mapping(library):
    table = library.application_table()
    library.save(table, [
        {"value": "advertising", "entries": [{"target": "advertConsent", "notes": "[no fit] oops"}]}])
    result = check(library, table)
    assert result.no_fit == [] and result.mapped == 2


def test_the_view_gives_every_row_a_state(library):
    rows = view(library, library.application_table())["rows"]
    states = {(r["value"], r["slot"]): r["state"] for r in rows}
    assert states[("advertising", 0)] == "mapped"
    assert states[("change-of-use", 0)] == "unmapped"
    assert states[("ldc", 0)] == "invalid" and states[("retired", 0)] == "invalid"
    assert states[("split", 0)] == states[("split", 1)] == "review"


# --- saving -------------------------------------------------------------------------------------

def test_saving_changes_one_value_and_leaves_every_other_row_alone(library):
    table = library.application_table()
    before = {(r["mhclg_type"], r["odp_type"]) for r in library.read_rows(table)}
    assert library.save(table, [{"value": "change-of-use",
                                 "entries": [{"target": "ldc.existing", "notes": "guess"}]}]) == []
    after = {(r["mhclg_type"], r["odp_type"]) for r in library.read_rows(table)}
    assert after - before == {("change-of-use", "ldc.existing")}
    assert before - after == set()
    assert any(r["notes"] == "guess" for r in library.read_rows(table))


def test_saving_a_value_with_two_rows_keeps_both_and_can_drop_one(library):
    table = library.application_table()
    library.save(table, [{"value": "split", "entries": [{"target": "ldc.proposed", "notes": ""}]}])
    rows = [r for r in library.read_rows(table) if r["mhclg_type"] == "split"]
    assert [r["odp_type"] for r in rows] == ["ldc.proposed"]


def test_a_target_the_standard_does_not_accept_is_never_saved(library):
    table = library.application_table()
    before = table.csv.read_text(encoding="utf-8")
    rejected = library.save(table, [{"value": "advertising",
                                     "entries": [{"target": "advertConsentt", "notes": ""}]}])
    assert rejected and rejected[0]["target"] == "advertConsentt"
    assert table.csv.read_text(encoding="utf-8") == before


def test_clearing_a_target_leaves_a_blank_row_so_the_value_is_unmapped_again(library):
    table = library.table(f"idox/{DOMAIN}/status")
    library.save(table, [{"value": "Granted", "entries": []}])
    assert "Granted" in {u["value"] for u in check(library, table).unmapped}


def test_saving_keeps_the_idox_text_column(library):
    table = library.table(f"idox/{DOMAIN}/status")
    library.save(table, [{"value": "Received",
                          "entries": [{"target": "undetermined", "notes": ""}]}])
    rows = {r["idox_value"]: r for r in library.read_rows(table)}
    assert rows["Received"]["idox_text"] == "Received" and rows["Received"]["odp_type"] == "undetermined"


# --- fetching -----------------------------------------------------------------------------------

def test_the_idox_page_is_read_into_its_dropdowns():
    found = fetch.parse_idox_dropdowns(IDOX_PAGE)
    assert found["status"] == [{"value": "Granted", "text": "Granted"},
                               {"value": "Received", "text": "Received here"}]
    assert found["decision"] == [{"value": "REF", "text": "Refused & closed"}]
    assert [o["value"] for o in found["caseType"]] == ["A21", "ADV"]       # sorted by value
    assert found["developmentType"] == []


class _Page:
    def __init__(self, text):
        self.text = text

    def raise_for_status(self):
        pass


def test_refreshing_a_portal_adds_new_values_as_blank_rows_and_keeps_the_rest(library):
    url = f"https://{DOMAIN}/online-applications/search.do?action=advanced"
    report = fetch.refresh_portal(library, url, get=lambda *a, **k: _Page(IDOX_PAGE))
    assert report["domain"] == DOMAIN
    status = {r["idox_value"]: r["odp_type"]
              for r in library.read_rows(library.table(f"idox/{DOMAIN}/status"))}
    assert status == {"Granted": "determined", "Received": ""}             # Granted untouched
    case_type = library.read_rows(library.table(f"idox/{DOMAIN}/caseType"))
    assert [r["idox_value"] for r in case_type] == ["A21", "ADV"]


def test_a_page_with_no_dropdowns_is_reported_not_written(library):
    try:
        fetch.refresh_portal(library, f"https://{DOMAIN}/x", get=lambda *a, **k: _Page("<p>hi</p>"))
    except fetch.FetchError as problem:
        assert "none of the expected dropdowns" in str(problem)
    else:
        raise AssertionError("expected a FetchError")


def test_portal_addresses_that_point_inside_a_network_are_refused():
    for url in ("http://127.0.0.1/x", "http://localhost/x", "https://10.0.0.5/x", "file:///etc/passwd",
                "ftp://example.gov.uk/x", "not a url"):
        try:
            fetch.check_portal_url(url)
        except fetch.FetchError:
            continue
        raise AssertionError(url)
    assert fetch.check_portal_url("https://planning.example.gov.uk/a") == "planning.example.gov.uk"


def test_sync_creates_a_missing_file_and_never_rewrites_one_that_is_there(library):
    table = library.table(f"idox/{DOMAIN}/caseType")
    created, added = fetch.sync(library, table)
    assert (created, added) == (True, 1)
    library.save(table, [{"value": "ADV", "entries": [{"target": "advertConsent", "notes": "x"}]}])
    assert fetch.sync(library, table) == (False, 0)
    assert library.read_rows(table)[0]["odp_type"] == "advertConsent"


def test_the_standards_values_can_be_refreshed_from_a_schemas_folder(library, tmp_path):
    folder = tmp_path / "schemas-checkout" / "schemas"
    folder.mkdir(parents=True)
    for name in targets.SCHEMA_NAMES.values():
        (folder / name).write_text((fetch.targets.validate.BUNDLED / name).read_text(encoding="utf-8"),
                                   encoding="utf-8")
    counts = fetch.refresh_targets(library, str(tmp_path / "schemas-checkout"))
    assert counts["status"] == 4 and counts["decision"] == 2 and counts["application_type"] > 90
    assert "pp.full" not in library.targets("application_type")


def test_an_unreadable_schemas_folder_in_the_environment_falls_back_to_github(library, tmp_path):
    import os

    class Raw:
        def __init__(self, name):
            self.text = (targets.validate.BUNDLED / name).read_text(encoding="utf-8")

        def raise_for_status(self):
            pass

    os.environ["DPR_SCHEMAS"] = str(tmp_path / "not there")
    try:
        counts = fetch.refresh_targets(library, get=lambda url, **k: Raw(url.rsplit("/", 1)[1]))
        assert counts["decision"] == 2
        try:
            fetch.refresh_targets(library, str(tmp_path / "not there"))
        except fetch.FetchError:
            pass
        else:
            raise AssertionError("a folder named on purpose should not fall back")
    finally:
        del os.environ["DPR_SCHEMAS"]


def test_portal_urls_are_listed_added_once_and_comments_ignored(library):
    library.urls_file.write_text("# portals\nhttps://a.example.gov.uk/x", encoding="utf-8")
    assert library.add_portal_url("https://b.example.gov.uk/y") is True
    assert library.add_portal_url("https://b.example.gov.uk/z") is False
    assert library.portal_urls() == ["https://a.example.gov.uk/x", "https://b.example.gov.uk/y"]


# --- the command --------------------------------------------------------------------------------

def test_status_lists_every_table(library):
    code, out = _run(library, "status")
    assert code == 0
    assert "application-types" in out and f"idox/{DOMAIN}/caseType" in out and "(optional)" in out


def test_validate_fails_on_a_required_table_and_passes_when_they_are_done(library):
    code, out = _run(library, "validate")
    assert code == 1 and "unmapped  'change-of-use'" in out and "'ldc'" in out

    code, out = _run(library, "validate", "idox")
    assert code == 1 and "Received" in out and "optional table" in out

    library.save(library.table(f"idox/{DOMAIN}/status"), [
        {"value": "Received", "entries": [{"target": "undetermined", "notes": ""}]}])
    code, out = _run(library, "validate", "idox")
    assert code == 0 and "every required table is complete" in out      # caseType is optional


def test_validate_with_an_unknown_table_says_so(library):
    code, out = _run(library, "validate", "nope")
    assert code == 1 and "No table matches" in out


def test_show_prints_every_row_of_one_table(library):
    code, out = _run(library, "show", f"idox/{DOMAIN}/decision")
    assert code == 0 and "REF" in out and "refused" in out
    assert _run(library, "show", "idox")[0] == 1                       # more than one table


def test_fetch_offline_builds_missing_files_without_touching_the_network(library):
    code, out = _run(library, "fetch", "--offline")
    assert code == 0 and f"idox/{DOMAIN}/caseType: created" in out


# --- the files in the repo ----------------------------------------------------------------------

def test_the_shipped_target_lists_are_exactly_what_the_schemas_accept():
    """Nothing may be mapped to a value the schemas reject, so the lists must not drift from them."""
    from pathlib import Path

    shipped = Library(Path(__file__).resolve().parent.parent / "mappers")
    bundled = targets.from_bundled_schemas()
    for kind, values in bundled.items():
        assert shipped.targets(kind) == values, kind


def test_no_shipped_mapping_names_a_value_the_schemas_reject():
    """Unfinished is allowed, wrong is not: this fails if a csv is committed with a bad value."""
    from pathlib import Path

    shipped = Library(Path(__file__).resolve().parent.parent / "mappers")
    assert shipped.tables()
    for table in shipped.tables():
        assert check(shipped, table).invalid == [], table.id
        accepted = set(targets.from_bundled_schemas()[table.target])
        used = {r["odp_type"] for r in shipped.read_rows(table) if r.get("odp_type")}
        assert used <= accepted, (table.id, sorted(used - accepted))
