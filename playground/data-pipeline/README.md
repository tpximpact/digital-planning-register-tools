# DPR data pipeline

A small, portable pipeline that takes planning data out of a council's systems and turns it into
the Open Digital Planning post submission standard.

It runs on a laptop with one command. Nothing is installed on a council's systems, and no cloud
account is needed. The same code runs against a local folder, S3 or Azure, because storage is
chosen in config rather than in the code.

Two councils are wired up, on two different back office systems, and both come out identical:

| Council | Back office  | How the data arrives                                 |
| ------- | ------------ | ---------------------------------------------------- |
| Camden  | NEC M3       | Their open data API. Public, no key, refreshed daily |
| Barnet  | Idox Uniform | A CSV export, one file per table                     |

Barnet records cannot be used yet while data sharing is agreed, so their side runs against made
up rows in the right shape. When a real export is available, only the data changes.

## The three layers

| Layer  | What it holds                                                | Shape                       |
| ------ | ------------------------------------------------------------ | --------------------------- |
| Bronze | A copy of whatever the council's export gave us, untouched   | Different for every council |
| Silver | The same records converted to the post submission standard   | The same everywhere         |
| Gold   | The published version, and the only place records are edited | The same everywhere         |

Nothing in gold is public until somebody approves it, and approval is done in bulk. See
`docs/admin-ui.md`.

Bronze exists so that we never have to go back to a council for a second export, and so a change at
their end cannot take our data away. Silver is never edited, so re-running the pipeline refreshes
it without wiping anyone's work in gold.

## Quick start

The folder structure for this project should be as follows:

- `digital-planning-register/` (optional: only needed if you want to see everything on the DPR frontend)
- `digital-planning-data-schemas/`
- `digital-planning-register-tools/`

```sh
# digital-planning-data-schemas
git clone git@github.com:theopensystemslab/digital-planning-data-schemas.git
cd digital-planning-data-schemas
cp sample.env .env
# edit it to give values
# CAMDEN_BOPS_API_URL=https://camden.bops.services/api/v2/
# CAMDEN_API_URL=http://0.0.0.0:8000/
pnpm i
pnpm build
cd ..

# call the dpr api and use bops handlers uses CAMDEN_BOPS_API_URL
curl 'http://localhost:4000/api/@next/public/applications?page=1&resultsPerPage=10' \
  --header 'x-client: camden' \
  --header 'x-service: documentation-example' \
  --header 'x-handler: bops'


curl 'http://localhost:4000/api/@next/public/applications/25-00118-HAPP/specialistComments' \
  --header 'x-client: camden' \
  --header 'x-service: documentation-example' \
  --header 'x-handler: bops'

# call the dpr api and use external handlers uses CAMDEN_API_URL (the data pipeline url)
curl 'http://localhost:4000/api/@next/public/applications?page=1&resultsPerPage=10' \
--header 'x-client: camden' \
--header 'x-service: documentation-example' \
--header 'x-handler: external'

# digital-planning-register
git clone git@github.com:tpximpact/digital-planning-register.git
cd digital-planning-register
cp sample.env .env
# edit it to give values
# CAMDEN_BOPS_API_KEY=123
# CAMDEN_BOPS_API_URL=123
cd ..


# digital-planning-register-tools
cd digital-planning-register-tools
cp sample.env .env
bun install
bun workspace @dpr/api bun run dev


# setup the pipeline
cd playground/data-pipeline
cp config/config.example.yaml config/config.yaml

# run the command in scripts/refresh_application_types.py

# run the command in scripts/make_fake_uniform.py

# to see the data in duckdb
uv run --with duckdb scripts/ui.py

bun workspace @dpr/api bun run generate:openapi
cp -rp apps/api/schema.json playground/data-pipeline/data/openapi.json
```

```sh
With Docker, nothing else needed:

    docker compose run --rm pipeline ingest camden
    docker compose run --rm pipeline map camden
    docker compose run --rm pipeline publish
    docker compose up api           # then open http://localhost:8000/admin

Without Docker:

    python -m venv .venv
    . .venv/bin/activate            # Windows: .venv\Scripts\activate
    pip install -e ".[dev,api]"
    dpr ingest camden
    dpr map camden
    dpr publish
    uvicorn dpr_pipeline.api:app    # then open http://localhost:8000/admin

For Barnet, make the stand in export first:

    python scripts/make_fake_uniform.py data/fake-barnet 250
    dpr ingest barnet
    dpr map barnet

## Commands

| Command | What it does |
| --- | --- |
| `dpr ingest camden` | Pulls Camden's open data API into bronze |
| `dpr ingest barnet` | Reads a CSV export, one file per table, into bronze |
| `dpr map camden` | Converts bronze into silver, post submission shape |
| `dpr map barnet` | The same, from Uniform's tables and codes |
| `dpr publish` | Copies silver into gold, leaving any edits alone |
| `dpr approve --council X --clean` | Approves everything with nothing flagged, so it becomes public |
| `dpr validate` | Checks silver against the real ODP schema |
| `dpr status` | Row counts for each layer |
| `dpr attach COUNCIL REF FILE` | Store the documents and comments from a standard shaped record |
| `dpr reset --yes` | Delete the database so the next run starts from nothing (see below) |
| `dpr show REFERENCE` | Prints one record twice, as published and in the standard shape |
| `dpr gaps` | Groups what the mapper could not place, largest first |
| `dpr values decision` | Distinct statuses, decisions or types, with counts |
| `dpr sql "SELECT ..."` | Any query against the database |
| `dpr mappers status` | How finished each value mapper table is (see below) |
| `dpr mappers validate` | What is unmapped or wrong; exits 1 if a required table is unfinished |
| `dpr mappers fetch` | Refreshes the standard's values, MHCLG's list and each Idox portal |
| `dpr mappers add-portal URL` | Starts mapping another Idox portal |

### Starting again from nothing

    dpr reset            # shows what would be deleted
    dpr reset --yes      # deletes the database
    dpr reset --yes --files    # and the bronze, silver and gold folders, so downloads are fresh

Stop the API first, because an open DuckDB file cannot be deleted. A reset removes everything,
including edits, approvals and their history, which cannot be rebuilt. Then run it again:

    dpr ingest camden
    dpr map camden
    dpr publish
    dpr approve --council camden --clean

Keep the folders if you only want to rebuild silver and gold: bronze is the expensive part to fetch.

## The API

`uvicorn dpr_pipeline.api:app` serves it on port 8000.

The API is only the standard's own OpenAPI endpoints, in `api_odp.py`, so the register can call
this in place of its BOPS handler. Nothing else is exposed as JSON. Anything extra goes in
`metadata`, covered below.

Every response is an `ApiResponse`: `data`, then `pagination` on lists, then `status`
(`code`, `message` and an optional `detail` string). Errors use the same shape with `data` null.

Lists take `page`, `resultsPerPage`, `query` (searches reference, address and description),
`sortBy` (`publishedAt` or `receivedAt`), `orderBy` (`asc` or `desc`) and `reference`. The council
comes from the `x-client` header, as in the standard. `x-service` is accepted and ignored.
Pagination is the offset kind: `resultsPerPage`, `currentPage`, `totalPages`, `totalResults` and
`totalAvailableItems` (everything the caller could see before `query` and `reference` narrowed it).

**Public**, read only, approved records only.

| Endpoint | What it does |
| --- | --- |
| `GET /api/@next/public/applications` | A page of published records |
| `GET /api/@next/public/applications/{applicationId}` | One record, by reference |
| `GET .../{applicationId}/documents` | Its documents, redacted |
| `GET .../{applicationId}/documents/{documentId}` | One document |
| `GET .../{applicationId}/publicComments` | Published public comments, with a sentiment summary |
| `POST .../{applicationId}/publicComments` | Send a comment. It waits until somebody publishes it |
| `GET .../{applicationId}/publicComments/{publicCommentId}` | One published comment |
| `GET .../{applicationId}/specialistComments` | Specialist comments, with a summary |
| `GET .../{applicationId}/specialistComments/{specialistId}` | One specialist and their comments |

**Unredacted**, all of the above again under `/api/@next/applications`, with every record whether
approved or not, and nothing redacted: documents keep their private `url`, comments keep the
original wording and the author's address, and comments still waiting to be published are listed.

| Endpoint | What it does |
| --- | --- |
| `GET /api/@next/applications` | A page of records |
| `GET /api/@next/applications/{applicationId}` | One record, by reference |

Documents and comments are not in a council's planning export, so they start empty. Attach them
from a file in the standard's shape (the examples have both `files` and `comments`):

    dpr attach camden 24-0001-FUL examples/with-comments.json

Comments sent in through the API are held back from the public list until they are published, which
happens through `items.publish_comment`. Public items are the stored item with the private parts
removed, so there is one copy to keep right.

### Extra information goes in metadata

The unredacted endpoints add a `pipeline` object to each record's `metadata`. The public ones never
do.

    metadata.pipeline: { council, approved, approvedAt, approvedBy, edited, updatedAt, updatedBy,
                         flagged, issues: [{field, reason}], sourceStatus }

The published schema does not allow extra keys in `metadata`, so `extension.py` adds `pipeline` to
the schema before anything is validated (`dpr validate`, the tests). The OpenAPI spec's metadata is
looser and accepts it as it is. Propose the same property to the schemas repository and
`extension.py` can go. Records are stored without it, and it is dropped from anything saved
through the admin.

## The admin

`/admin` is a page for reviewing and changing records. A switch at the top moves between bronze,
silver and gold, and each layer has its own columns: bronze shows the council's own reference and
what it was mapped to, silver shows type, status and whether it is in gold, and gold shows
approval and edits. Bronze and silver are read only. Only gold can be approved, edited or
unpublished, with bulk approve for every clean record. The name you are asked for is recorded with
each change.

The council is chosen at the very top. Opening an application has two validate buttons that check
the JSON in the box, edits included, against the standard's two schemas: the private one
(`postSubmissionApplication.json`, the unredacted application) and the public one
(`postSubmissionPublishedApplication.json`, the published copy). Problems are listed, and the
missing original submission that a historic record cannot have is kept apart as known gaps. Copies
of both schemas are bundled in `data/schemas`; point `DPR_SCHEMAS` at a checkout to use a newer one.

It reads and writes through `/admin/data` (`admin_data.py`), which is hidden from the API docs so
the documented API stays the standard's ODP endpoints and nothing else. `POST /admin/data/validate` takes `{schema, record}` and
`GET /admin/data/{council}/{reference}/check` runs a record through the OpenAPI spec.

## Value mappers

Separate from the council mappers above, which convert whole records. These are small lookup
tables that turn one source system's wording into the standard's: an Idox status into an ODP
status, an Idox decision into granted or refused, an MHCLG application type into an ODP one. They
are being filled in with LPAs, so they live as plain csv files in `mappers/`, committed with the
code, and are never overwritten by a fetch. `mappers/README.md` explains the files and the
workflow.

    docker compose run --rm pipeline mappers status                    # a bar and counts per table
    docker compose run --rm pipeline mappers validate                  # lists what is unmapped or invalid
    docker compose run --rm pipeline mappers validate idox             # one portal's tables, or any id prefix
    docker compose run --rm pipeline mappers fetch                     # standard + MHCLG + new portals; --force re-reads portals
    docker compose run --rm pipeline mappers fetch --offline           # only create or extend csv files from what is on disk
    docker compose run --rm pipeline mappers add-portal "https://planning.example.gov.uk/online-applications/search.do?action=advanced"
    docker compose run --rm pipeline mappers show idox/<domain>/decision

They never need the database. With Docker: `docker compose run --rm pipeline mappers status`.

`/admin/mappers` edits the same files in the same style as `/admin`: pick a table, filter to what
is unmapped, invalid or flagged `[check]`, choose the standard's value from a list, add a note, and
save. A source value can map to more than one standard value (**Add another**). A value the
standard does not accept can't be saved. **Refresh from source** and **Add Idox portal** do what
`fetch` and `add-portal` do. The JSON behind it is `/admin/mappers/data`, hidden from the API docs.

What the checks count: a source value is *unmapped* until a row gives it a standard value,
*invalid* if a row's value is not one the standard accepts, the source stopped offering it, or the
same mapping is listed twice, and *to check* when a mapped row has a note starting `[check]`. A
value with nothing to map to is left empty with a note starting `[no fit]`, which counts as done.
Status and decision tables must be complete for `validate` to pass. Idox case types, which map to
application types, are reported but do not fail it.

The standard's values come from the schemas (`schemas/postSubmissionApplication.json` and
`postSubmissionPublishedApplication.json`), so a parent name such as `pp.full`, `ldc` or `pa`,
which is not itself a valid application type, is rejected. `fetch` reads them from GitHub, or from
a checkout with `--schemas PATH` or `DPR_SCHEMAS`.

## The review lab

`/lab` holds three prototype apps for getting records approved quickly. They are proofs of
concept, for trying with people rather than for production. Each draws a site plan from the
record's GeoJSON, shows the record as a comment thread, and has the full JSON one tap away.

| App | Path | Idea |
| --- | --- | --- |
| Tim-ber | `/lab/timber/` | One application at a time. Drag right to approve, left to flag, up to see it later. Arrow keys and Z (undo) work |
| plannertok | `/lab/plannertok/` | A full screen feed. Scroll to the next one, double tap to approve |
| InstaPlan | `/lab/instaplan/` | A photo style feed. Double tap the plan to approve, open the comments to read the record |

They read the unredacted ODP endpoint and approve through the admin's data routes. Without the API
they fall back to sample data and save nothing, so they can be shown from any static host. Add
`?demo` to force the sample and `?council=barnet` to pick a council. Flagging is not stored.

### Strange but true

`/lab/oddities/` lists things in a council's own data that cannot be right, or are hard to
believe: an expiry earlier than the received date, a decision with no date, coordinates in the
Atlantic, a point outside its own site boundary, a site the size of a small town, an applicant
called ".". It reads bronze, the data as the council sent it, through the council's mapping, so
it works for any council whose yaml names the field. Each kind shows a count and the most extreme
records first. Kinds with nothing to report are listed as clean.

The data comes from `GET /admin/data/oddities?council=camden&limit=5` (admin only, not in the API
docs). The rules are in `oddities.py`; add one by adding a `Rule`. Nothing is changed or flagged
by the page, it only reports. Add `?demo` to see it with sample data.

## Checking against the OpenAPI spec

Download `openapi.json` (or `openapi.yaml`) from the digital-planning-data-schemas repository to
`data/openapi.json`, or point `DPR_OPENAPI` or `openapi: path:` in the config at it. The spec is
large, because it writes every application type out in full, so it is read once and cached.

| Where | What it does |
| --- | --- |
| `/admin/data/{council}/{reference}/check` | Checks the record as the unredacted endpoint would send it, and lists what the spec rejects |
| Lab apps | The comments show "matches the spec" or not for each application |
| `tests/test_contract.py` | Every GET endpoint is called and its answer checked against the spec. Skips without a spec |

## Looking at the data

DuckDB has a built in web interface, which is easier to show people than SQL in a terminal.

    python scripts/ui.py            # then open http://localhost:4213

## Validation

`dpr validate` checks silver against `postSubmissionPublishedApplication.json` from the ODP schema
repository. Point at a checkout with `--schemas`, or set `DPR_SCHEMAS`. A checkout sitting beside
this repo is found automatically.

One gap cannot be closed. The standard expects the original submission, which in practice means a
PlanX submission, and historic records predate it. What a legacy record can give is the part a
register shows, so the `submission` block holds just that:

    submission: { applicationType, data: { applicant, property: { address, boundary }, proposal: { description } } }

Anything the source does not have is left out. A council with only a point gets a `boundary` made
by `geo.py`: a 10 metre GeoJSON square around the point, with its area, so `site.geometry` has data.
It is not the real red line, and the mapper notes that in the issues list. A council that holds real
boundaries passes them to `build(boundary=...)` and they are used instead. The rest of what the standard requires inside a submission is reported separately rather than
counted as a fault, because no amount of mapping will produce it. Use `--strict` to include it.

References use only `a-z A-Z 0-9` and `-`. Each other run of characters becomes one hyphen, so
`2018/2267/P` is `2018-2267-P` in silver and gold. Bronze keeps the council's own reference.

`assessment.expiryDate` is estimated until a source supplies it (`expiry.py`): the submission date
plus a number of days for the type, 56 for most, 91 for major, 112 for environmental impact. It
only appears where an assessment already exists, and each use is listed in the mapper's issues as
estimated. A mapping that names `opt_expiry` always wins. Delete `expiry.py` when real dates arrive.

An application that is withdrawn gets the `withdrawn` status, with `withdrawnAt` and, where the
source has it, `withdrawnReason`. Its stage stays where it had got to.

## Configuration

Copy `config/config.example.yaml` to `config/config.yaml` and edit it. Every path accepts a local
folder, `s3://bucket/prefix` or `abfs://container/prefix`. Credentials come from environment
variables, never from the file, so the config can be committed and the repo can be public.

    cp .env.example .env

## Layout

    src/dpr_pipeline/
      config.py             settings, from yaml plus environment
      storage.py            read and write, local or cloud, chosen by the path
      db.py                 DuckDB, one file, three schemas
      sources/              one module per council, pulls data into bronze
      mappers/              bronze into silver: common.py is shared, one small module per council
      mappings/             one yaml per council, saying where each field lives and what its codes mean
      post_submission.py    the shared record builder, why both councils match
      application_types.py  the 95 valid types, and how a council's wording reaches them
      gold.py               publishing, editing, and the history of changes
      api.py                assembles the app
      api_odp.py            the routes in the OpenAPI spec
      admin_data.py         the admin page's data routes, hidden from the docs
      admin_mappers.py      the value mappers page's data routes, also hidden
      value_maps/           the mappers/ csv tables: library, checks, fetchers, `dpr mappers`
      extension.py          metadata.pipeline, and the schema change that allows it
      api_common.py         what both share
      expiry.py, geo.py     temporary expiry estimate, and GeoJSON from a point
      validate.py           schema checking
      cli.py                the command line
      static/               admin.html, mappers.html, admin.css (shared) and the lab

    mappers/                value mapper tables (csv and json), committed with the code

Adding a council means adding one source module, one yaml file in `mappings/` and a small mapper
module for the parts that are that council's alone. Everything else is shared.

### Mapping a council

Most of a mapper is saying where things are, so that part is data. A mapping file looks like this:

    fields:
      reference:  {from: application_number}
      received:   {from: registered_date, as: date}
      decision:   {from: DECISION, upper: true, lookup: decision}
      address:    {from: [ADDRESSES.HOUSENUMBER, ADDRESSES.STREET], join: " "}
      opt_expiry: {from: target_date, as: date}
    lookups:
      decision: {GTD: Granted, REF: Refused}

Paths can be dotted, to reach into nested json or across Uniform tables. `lookup` turns a council
code into its wording, and decision wording is then read as granted or refused (anything else is
recorded as a gap, not guessed). Fields starting `opt_` are the parts of the standard a council may
or may not have: expiry date, recommendation, committee date, decision notice, withdrawal reason.
Name a source for one and it appears in the record, leave it out and that block is simply absent.

The mapper module keeps only the awkward parts: rows that are not applications, how an application
type resolves, and any council specific gaps to report. `mappers/common.py` does the rest, including
the write into silver and the issues table.

## Tests

    pytest

39 tests, no network needed. The schema tests skip themselves if the ODP repository is not checked
out.

The admin screen is documented in `docs/admin-ui.md`: what it does today, what batch approval
would need, and the endpoints behind it.

See `docs/plan.md` for what was asked for and what is built, `docs/decisions.md` for why it is
built this way, and `docs/flow.md` for the shape of it.
```
