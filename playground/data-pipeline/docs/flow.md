# What happens, step by step

    CAMDEN                                    BARNET
    opendata.camden.gov.uk                    a CSV export of Uniform, one file per table
    NEC M3 behind it                          Idox Uniform behind it
    public API, no key, daily                 no contract yet, so made up rows in the right shape
    application_number, decision_type ...     REFVAL, APPTYPE, DECISION, KEYVAL ...
            │                                         │
            │  dpr ingest camden                      │  dpr ingest barnet
            │  1000 records a page                    │  tables joined on their key
            ▼                                         ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │  BRONZE                                                                   │
    │                                                                           │
    │  A copy of exactly what each council gave us. Nothing renamed, nothing     │
    │  dropped, their own column names kept.                                     │
    │                                                                           │
    │    data/bronze/<council>/<timestamp>/...    the raw files                 │
    │    bronze.applications                     one row per application        │
    │                                                                           │
    │  Why: if a supplier changes the data or cuts off access, we still have     │
    │  ours, and the mapper can re-run without asking them again.                │
    └───────────────────────────────┬───────────────────────────────────────────┘
            │                                         │
            │  dpr map camden                         │  dpr map barnet
            │  mappers/camden.py                      │  mappers/barnet.py
            │                                         │
            │          both end in post_submission.build(), which is why
            │          two different systems come out identical
            ▼                                         ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │  SILVER                                                                   │
    │                                                                           │
    │    silver.applications      the ODP post submission published shape       │
    │                             plus columns for the council's own detail:    │
    │                             address, description, applicant, officer      │
    │                                                                           │
    │    silver.mapping_issues    everything that could not be placed, kept     │
    │                             rather than guessed                           │
    │                                                                           │
    │  448 records pass the real ODP schema. The one thing that cannot pass is   │
    │  the original submission, because historic records predate PlanX.          │
    │                                                                           │
    │  Never edited. That is what lets the pipeline run again tomorrow.          │
    └───────────────────────────────┬───────────────────────────────────────────┘
                                    │  dpr publish
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │  GOLD                                                                     │
    │                                                                           │
    │    gold.applications   starts as a copy of silver, and is the only place  │
    │                        records are edited. Arrives unapproved             │
    │    gold.edits          every change, approval and unapproval, with who    │
    │                                                                           │
    │  Re-publishing refreshes untouched records and leaves edited ones alone,   │
    │  and never undoes an approval.                                            │
    └───────────────────────────────┬───────────────────────────────────────────┘
                                    │  dpr approve --council X --clean
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │  APPROVAL                                                                 │
    │                                                                           │
    │  Nothing is public until somebody approves it. The work splits in two,     │
    │  using the gaps already recorded against each record:                      │
    │                                                                           │
    │    clean      nothing flagged, approved together in one command            │
    │    flagged    something specific to that record, left for a person         │
    │                                                                           │
    │  Gaps true of every legacy record do not count: the missing submission,    │
    │  a coordinate instead of a boundary, the council's own status wording.     │
    └───────────────────────────────┬───────────────────────────────────────────┘
                                    │  uvicorn dpr_pipeline.api:app
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────────┐
    │  THE API AND THE ADMIN SCREEN,  http://localhost:8000                     │
    │                                                                           │
    │    public    read only, and only approved records                         │
    │    private   everything, plus what is approved, flagged and edited        │
    │                                                                           │
    │    GET    /public/applications          what the register reads           │
    │    GET    /private/applications         what an admin tool reads          │
    │    POST   /private/approval/approve     a list, or everything clean       │
    │    POST   PUT   DELETE                  add, replace, unpublish           │
    │    /admin                               a screen for reviewing and editing│
    │    /docs                                generated documentation           │
    └───────────────────────────────────────────────────────────────────────────┘

## Where the council specific part sits

Two files per council, and nothing else:

    sources/camden.py    how to pull their data      sources/barnet.py
    mappers/camden.py    how their fields translate  mappers/barnet.py

Storage, the database, the record builder, validation, gold, the API and the admin screen are all
shared. Adding a third council is two files, not a second pipeline.

## Where the data physically lives

    data/bronze/...     a local folder, or s3://bucket/... or abfs://container/...
    data/dpr.duckdb     one file, three schemas, no server

The path in `config/config.yaml` decides. The code never changes, which is what lets one council
run this on AWS, another on Azure, and a third on a laptop before deciding anything.

## A demo in six commands

    dpr status              everything at zero
    dpr ingest camden       200 records into bronze
    dpr map camden          into silver, in the standard shape
    dpr ingest barnet       250 from a CSV export
    dpr map barnet          the same shape, from a different system
    dpr validate            checked against the real ODP schema
    dpr publish             into gold, unapproved
    dpr approve --clean     the ones with nothing flagged, in one go
