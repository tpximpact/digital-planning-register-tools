# The admin screen

Where the admin UI lives, what it does, and what is still open. Written so the next design
conversation starts from something real rather than a blank page.

## Running it

    dpr publish
    uvicorn dpr_pipeline.api:app

Then open http://localhost:8000/admin

It is one file, `src/dpr_pipeline/static/admin.html`, plain HTML with no build step, served by the
API. Nothing to install.

## Nothing is public until somebody approves it

Records arrive in gold unapproved. The public endpoints only return approved records, so a record
that has not been through a person is simply not there as far as the outside world is concerned.

That is the point of this screen: deciding what goes out.

## Approving in bulk

A council with tens of thousands of historic records cannot read them one at a time. The pipeline
already records every gap it found against each record, so the work splits in two:

| | |
| --- | --- |
| **Clean** | Nothing flagged. These can be approved together |
| **Needs a look** | Something specific to that record, such as an application type with no equivalent in the standard |

The screen shows those numbers at the top, and **Approve all clean** does the first group in one
go. Individual records can be ticked and approved, or taken back out of public view.

On a real run of Camden's data, that split was 125 clean and 73 needing a look. So a reviewer reads
73 records instead of 198.

### What does not count as a reason to review

Some gaps are true of every legacy record, not of one record:

    submission      the standard expects the original submission; historic records predate it
    boundary        councils publish a coordinate, not a site outline
    location        where there is no coordinate at all
    system_status   the council's own status wording, which the standard has not settled

These are recorded so the limits stay visible, but they do not hold a record back. No amount of
reviewing will produce a PlanX submission for a 2010 application.

The list is `KNOWN_LIMITS` in `gold.py`, and it is a judgement rather than a rule, so it is the
first thing to argue about.

## What the screen does

| | |
| --- | --- |
| List | Every record, with paging |
| Filter | By council, and by waiting or approved |
| Sort | Reference, published date, last edited |
| Search | Across reference, address and description |
| Approve | All clean at once, or a ticked selection |
| Unapprove | Take records back out of public view |
| Open | One record, as JSON |
| Edit | Change anything and save |
| Unpublish | Remove it entirely, leaving silver and bronze untouched |
| History | Who changed, approved or unapproved what, and when |
| Marking | Approved, waiting, needs a look, and edited are each tagged |

Every change needs a name, sent as an `X-Edited-By` header, so nothing is anonymous. Real sign in
comes later.

## What a council still has to decide

This changes the shape of the screen, so it is worth settling early:

- If the records are already public elsewhere, there is nothing to redact and approval is about
  data quality, not disclosure.
- If some records are not public, those need a proper review queue with a reason recorded against
  each decision. The history table already holds the shape for that, it just has no reason field.

## The endpoints behind it

    GET  /private/approval/summary        how the work splits
    GET  /private/approval/clean          the records with nothing flagged
    POST /private/approval/approve        a list of references, or all_clean for a council
    POST /private/approval/unapprove      take records back out

    GET    /private/applications                              list, with state and flags
    GET    /private/applications/{council}/{reference}
    GET    /private/applications/{council}/{reference}/history
    POST   PUT   DELETE                                       add, replace, remove

And from the command line:

    dpr approve --council camden                    show the split, change nothing
    dpr approve --council camden --clean --by NAME  approve everything clean

## Why it is deliberately plain

It exists so the pipeline can be shown to people who would rather click than read a terminal, and
so the next design conversation starts from something real. It is not meant to be the finished
product.
