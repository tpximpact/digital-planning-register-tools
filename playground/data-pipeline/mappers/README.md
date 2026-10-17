# Value mappers

Tables that turn a source system's wording into the Open Digital Planning standard's. They are
being filled in with local planning authorities, so they are plain csv files that can be reviewed
in a pull request.

    application_types/
      mapping.csv          mhclg_type, odp_type, notes      <- the table people fill in
      mhclg_types.json     every application type MHCLG defines
      mhclg_context.json   each one's name and description (written by `dpr mappers fetch`)
      odp_types.json       every application type the standard accepts
    idox/
      idox_urls.txt        one Idox advanced search address per line; # starts a comment
      odp_statuses.json    every status the standard accepts
      odp_decisions.json   every decision the standard accepts
      <portal domain>/
        idox_status.json, idox_decision.json, idox_caseType.json, idox_developmentType.json
                           the dropdown values the portal offers (written by fetch)
        mapping_status.csv, mapping_decision.csv     idox_value, idox_text, odp_type, notes
        mapping_caseType.csv                         optional: Idox case type -> application type

Only the `odp_type` and `notes` columns are for people. Everything else is written by `fetch`.

## Filling a table in

1. `dpr mappers status` shows how finished each table is.
2. Edit the csv, or use the page at `/admin/mappers` (it edits the same files).
3. `dpr mappers validate` lists what is unmapped or wrong.
4. Commit the csv.

An `odp_type` has to be a value in the matching list (`odp_types.json`, `odp_statuses.json` or
`odp_decisions.json`). Leave it empty if there is no fit and say why in `notes`.

One source value can have several rows when it fits more than one standard value:

    technical-details-consent,pp.full.major.technicalDetails,[check] also mapped to other
    technical-details-consent,pp.full.minor.technicalDetails,[check] also mapped to other

A note that starts with `[check]` marks a guess that wants a second opinion. It is counted and
shown, and does not fail validation.

Some values have no equivalent in the standard (a status where only granted and refused exist, an
Article 4 direction that is not an application). Leave `odp_type` empty and start the note with
`[no fit]` and a reason. That counts as done, so the table can be complete, and it is listed as
"no fit" so nobody mistakes it for something forgotten. An empty `odp_type` without it is
"unmapped" and fails validation. If a row has a real `odp_type`, the marker is ignored.

## Adding an Idox portal

    dpr mappers add-portal "https://planning.example.gov.uk/online-applications/search.do?action=advanced"

This adds the address to `idox_urls.txt`, reads the portal's dropdowns, and starts a blank
mapping file for each of status, decision and case type. Use the portal's domain name, not an IP
address.

## Refreshing

`dpr mappers fetch` re-reads the standard and MHCLG's list. It skips portals that already have data
unless you pass `--force`. A refresh only ever **adds** blank rows for new source values. Rows
already filled in, and their notes, are never changed. A value the source stopped offering is not
deleted: it is reported as invalid so someone can decide.

## What counts as complete

Status and decision tables must have every source value mapped, to a value the standard accepts,
or marked `[no fit]`, for `dpr mappers validate` to pass. Case type and application type tables are reported the same
way; case types are optional and do not fail the run.
