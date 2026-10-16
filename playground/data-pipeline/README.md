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
| `dpr show REFERENCE` | Prints one record twice, as published and in the standard shape |
| `dpr gaps` | Groups what the mapper could not place, largest first |
| `dpr values decision` | Distinct statuses, decisions or types, with counts |
| `dpr sql "SELECT ..."` | Any query against the database |

## The API and the admin screen

`uvicorn dpr_pipeline.api:app` serves both, on port 8000.

There are two sets, because they do different jobs.

**Public**, read only. What the register and anyone else consuming the data would call.

| Endpoint | What it does |
| --- | --- |
| `GET /public/applications` | List of approved records, with paging, sorting and a council filter |
| `GET /public/applications/{council}/{reference}` | One record |

**Private**, for an admin tool. The same records, plus the council's own detail, the history, and
everything that changes a record.

| Endpoint | What it does |
| --- | --- |
| `GET /private/applications` | List, showing what is approved, flagged or edited |
| `POST /private/approval/approve` | Approve a list of references, or everything clean |
| `POST /private/approval/unapprove` | Take records back out of public view |
| `GET /private/approval/summary` | How the approval work splits |
| `GET /private/applications/{council}/{reference}` | One record |
| `GET /private/applications/{council}/{reference}/history` | What changed, who by, and when |
| `POST /private/applications/{council}/{reference}` | Add a record by hand |
| `PUT /private/applications/{council}/{reference}` | Replace one |
| `DELETE /private/applications/{council}/{reference}` | Unpublish one |

| Also | |
| --- | --- |
| `GET /admin` | A plain screen for reviewing and editing |
| `GET /docs` | The generated API documentation |

Changes need an `X-Edited-By` header, so every edit is attributable. Real sign in comes later.

The public feed carries the record and nothing else. Who edited what stays on the private side,
because that is internal housekeeping rather than planning data.

## Looking at the data

DuckDB has a built in web interface, which is easier to show people than SQL in a terminal.

    python scripts/ui.py            # then open http://localhost:4213

## Validation

`dpr validate` checks silver against `postSubmissionPublishedApplication.json` from the ODP schema
repository. Point at a checkout with `--schemas`, or set `DPR_SCHEMAS`. A checkout sitting beside
this repo is found automatically.

One gap cannot be closed. The standard expects the original submission, which in practice means a
PlanX submission, and historic records predate it. That is reported separately rather than counted
as a fault, because no amount of mapping will produce it. Use `--strict` to include it.

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
      mappers/              one module per council, bronze into silver
      post_submission.py    the shared record builder, why both councils match
      application_types.py  the 95 valid types, and how a council's wording reaches them
      gold.py               publishing, editing, and the history of changes
      api.py                the endpoints and the admin screen
      validate.py           schema checking
      cli.py                the command line

Adding a council means adding one source module and one mapper module. Everything else is shared.

## Tests

    pytest

39 tests, no network needed. The schema tests skip themselves if the ODP repository is not checked
out.

The admin screen is documented in `docs/admin-ui.md`: what it does today, what batch approval
would need, and the endpoints behind it.

See `docs/plan.md` for what was asked for and what is built, `docs/decisions.md` for why it is
built this way, and `docs/flow.md` for the shape of it.
```
