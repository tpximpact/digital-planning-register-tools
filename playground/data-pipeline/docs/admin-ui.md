# The admin screen

Where the admin UI lives, what it already does, and what it still needs. A starting point for
designing the batch approval work rather than a blank page.

## Running it

    dpr publish
    uvicorn dpr_pipeline.api:app

Then open http://localhost:8000/admin

It is one file, `src/dpr_pipeline/static/admin.html`, plain HTML with no build step, served by the
API. Nothing to install.

## What it does today

| | |
| --- | --- |
| List | Every published record, with paging |
| Filter | By council |
| Sort | Reference, published date, last edited |
| Search | Across reference, address and description |
| Open | One record, as JSON |
| Edit | Change anything and save |
| Unpublish | Remove from the published layer, leaving silver and bronze untouched |
| History | Who changed what, and when |
| Marking | An edited record is tagged, so what came from the council stays distinguishable |

Every change needs a name, sent as an `X-Edited-By` header, so nothing is anonymous. Real sign in
comes later.

## What it does not do yet

**Batch approval.** This is the gap, and it is the whole point of the next piece of work. Today a
record is reviewed and published one at a time. What a council with tens of thousands of historic
records needs is to approve many at once.

The useful thing is that the data is already shaped for it. Every gap the mapper found is recorded
per record in `silver.mapping_issues`, so the screen can separate:

- records with nothing flagged, which could be approved in bulk
- records with something flagged, which need a look

That turns the question from "read thirty thousand records" into "approve the clean ones, review
the rest".

## What a council actually has to decide

Worth settling before the design, because it changes the shape of the screen:

- If the records are already public elsewhere, there is nothing to redact and approval is a
  formality. The screen is then about data quality, not disclosure.
- If some records are not public, someone has to look at those, and the screen needs a proper
  review queue with a reason recorded for each decision.

## The endpoints it uses

All of them are on the private side, over the published layer:

    GET    /private/applications                             list, with the council's own detail
    GET    /private/applications/{council}/{reference}        one record
    GET    /private/applications/{council}/{reference}/history
    POST   /private/applications/{council}/{reference}        add by hand
    PUT    /private/applications/{council}/{reference}        replace
    DELETE /private/applications/{council}/{reference}        unpublish

Batch approval would need one more: something that takes a list of references and publishes them
together, writing one history entry each.

## Why it is deliberately plain

It exists so the pipeline can be shown to people who would rather click than read a terminal, and
so the next design conversation starts from something real. It is not meant to be the finished
product.
