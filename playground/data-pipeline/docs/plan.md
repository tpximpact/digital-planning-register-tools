# Plan

What the pipeline sets out to do, and how far it has got.

Nothing is ticked on the strength of code alone: it needs a test or a real run behind it.

---

## Done

- [x] **One repo, one command to run**
- [x] **Docker, so it runs with no setup at all**
- [x] **Storage behind config: a local folder, S3 or Azure**
- [x] **One DuckDB file, three schemas**
- [x] **Open data API ingestion into bronze**
- [x] **Raw pages kept on disk as well as in the database**, as an audit copy
- [x] **Re-running does not duplicate records**
- [x] **Mapping into the post submission standard**
- [x] **Gaps recorded rather than guessed**
- [x] **Commands to look at it: show, gaps, values, sql, status**
- [x] **DuckDB web interface for browsing the layers**
- [x] **Flow diagram and decision notes**

## Application types

The standard defines ninety five application types. A council's own list rarely matches it.

- [x] **Load the valid types from the schema repository**, vendored with a script to refresh them
- [x] **Fall back to the nearest valid type rather than leaving it empty.** A record with no
      application type fails the schema, so an empty value is not an option
- [x] **Keep the council's own wording beside the mapped type**, so a fallback is never mistaken for
      an agreed match
- [x] **Record every fallback**, separately from a genuine match
- [x] **Leave status and decision as the council wrote them.** Mapping those is a standards
      question, not a coding one
- [x] **Count the distinct statuses and decisions**, so the size of that question is known
- [x] **Leave out rows that are not planning applications**, such as a request for observations from
      a neighbouring authority

## The published layer

- [x] **Gold starts as a copy of silver**
- [x] **Silver is never edited.** It stays exactly as the council sent it
- [x] **Re-running refreshes silver without wiping edits in gold**
- [x] **Every change records who made it and when**

## The API

- [x] **Public, read only**: list with paging and sorting, and get one by reference
- [x] **Private, for an admin tool**: the same records plus the council's own detail, the history,
      and create, update and delete
- [x] **Who edited what stays on the private side.** It is internal housekeeping, not planning data
- [x] **A plain admin screen** for reviewing and editing
- [x] **Batch approval.** Nothing is public until somebody approves it, and approval is done in
      bulk. The clean records go together, the flagged ones are left for a person
- [x] **Approvals survive a re-run**, like edits do
- [x] **Every approval is attributed** and appears in the record's history
- [ ] **Field level approval.** Today it is the whole record or nothing. Comments are the clearest
      case: one council publishes a comment without the name, another publishes both
- [ ] **Per council settings**, since what can be published varies by council
- [ ] Comments themselves. Out of scope for now

## A second council, from a database export

- [x] **Read a CSV export, one file per table, and join it back together**
- [x] **Map the source codes into the standard**
- [x] **Generate a stand in export** where real data cannot be used yet, clearly labelled
- [x] **Document the export step as CSV per table, not a database dump.** A dump can only be loaded
      back into the same database product, which forces a licence on the next council

## Fitting the real standard

The first shape was a guess. This is the shape the published standard actually defines.

- [x] **Build records with the blocks the standard requires**: application with a stage and status,
      local planning authority, submission dates, validation and case officer
- [x] **Short organisation codes**, because the standard allows four characters
- [x] **The schema URL in metadata**, which the standard checks for
- [x] **Validate against the real schema**, found automatically beside this repo
- [x] **Readable failures.** The standard is one long list of alternatives, so a plain report only
      says "not valid under any of the given schemas". The checker walks into the alternative that
      nearly fitted and says what actually went wrong
- [x] **Report the missing submission block separately.** Historic records predate it, so they
      cannot have one. Counted apart from real faults, and shown with `--strict`
- [x] **Council detail kept beside the record**, in columns rather than pushed into a schema with no
      place for it: address, description, applicant, officer
- [x] **Records from two councils pass**, with that one known gap excluded

## Running anywhere

- [x] **Docker builds and runs the whole pipeline**
- [x] **Docker runs the API and the admin screen**
- [x] **Schema validation works inside Docker**, with the schemas mounted read only
- [x] **Tests, no network needed**

---

## Open, and not a coding problem

- [ ] **A real export from the second council.** The mapper is written but has only run against the
      stand in rows
- [ ] **A recommended database schema**, for councils who want one. The pipeline writes flat files
      just as easily, so this is a decision rather than a build
- [ ] **Direct access to a back office system**, rather than an export

## Not in scope

- Deployment scripts for a council's own environment
- PDFs, documents and OCR
- Making the type and decision mapping exact. That is a standards conversation
