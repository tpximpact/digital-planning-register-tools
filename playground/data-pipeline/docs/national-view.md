# The MHCLG national public view

A council publishing to the ODP standard is not automatically publishing to the national standard.
This is the piece that turns one into the other, and turns it back again.

    dpr national translate              build the eight national datasets from gold
    dpr national coverage               how many of the 52 fields come out filled
    dpr national roundtrip REFERENCE    out to the national shape and back, field by field
    dpr national export DIRECTORY       one CSV per dataset

## Why it is not a rename exercise

ODP emits **one nested object per application**. The application, its dates, its decision, its
documents, all hanging off a single record.

The national public view defines **eight datasets with references between them**. A condition
belongs to a decision notice, which belongs to an application. A site is a thing with its own
identity that applications point at.

So three things have to happen, and only the first one is mapping:

1. One record is split into rows across eight datasets.
2. References that do not exist in ODP have to be created. Six of the national fields are
   relationship references, and a nested document has nothing to join on. They are built from the
   application reference, so they are the same on every run and a person reading a row can see
   what it belongs to.
3. Dates held as named fields become typed events against the national vocabulary.

## What comes out of real data

On the 375 approved records across two councils:

    375    planning-application
    375    site
    375    decision-notice
      0    planning-condition
      0    decision-condition
      0    section-106
      0    planning-application-document
    1500   planning-permission-timeline

18 of the 52 national fields come out with a value. Of the rest, 23 are empty because ODP has no
source for them at all, and 11 are empty because this particular data does not carry them.

`dpr national coverage` prints that field by field, with the reason beside every empty one.

## The four datasets that come out empty, and why

Three of them ODP cannot fill in any circumstance, so they are written to
`national.translation_issues` with the reason rather than left to look like a bug:

**planning-condition.** ODP does contain a field called `conditions`, but it holds site constraints
drawn from a controlled list, such as an aerodrome or an archaeological priority area. It describes
what applies to the land, not what was imposed on a permission. There is also an application type
called `approval.conditions`, which is a request to discharge a condition rather than the condition
itself. So the word appears and the concept does not.

**decision-condition.** ODP has no decision notice record, so nothing can link a condition to one,
and it does not record who requested or discharged a condition. Discharge is a real ongoing process
after the decision and none of it is modelled.

**section-106.** The strings `section 106`, `s106` and `section106` do not appear anywhere in the
ODP schema.

The fourth, **planning-application-document**, is empty here only because legacy exports carry no
documents. The mapping is written and works when files are present.

## The timeline

This is the difference in shape that matters most, and it is also the one that is overstated by
calling it missing.

ODP holds dates as named fields. The national view holds a list of dated events against a
controlled vocabulary of sixteen event types. Seven of those sixteen can be dated from ODP today:

    application-submitted      valid-from              validation-completed
    application-published      consultation-start      consultation-end
    consultees-contacted

The other nine are in `UNDATEABLE_EVENTS` with the reason against each. Two are worth knowing
about, because they look closer than they are:

- `invalid-from` has no date in ODP. There is a validity flag with nothing dated against it.
- `committee-date` is not `committeeSentDate`. ODP holds the date an application was sent to
  committee, which is not the date the committee met.

Nothing is emitted without a real date. An invented date in a timeline is worse than a missing
event.

## The reverse direction

The reason this exists is a question a council asks immediately: if we store our data in the
national shape, can the register still be fed from it?

`dpr national roundtrip` takes one record, builds the national datasets, rebuilds the ODP record
from them, and compares every leaf value. Four answers, and the difference between them matters:

| | |
| --- | --- |
| **kept** | came back exactly |
| **trimmed** | came back as the same day without the time, because the national view holds a date where ODP holds a timestamp |
| **changed** | came back as something else, which would be a fault in the translation |
| **lost** | the national public view does not carry it at all |

On a real Camden record, nothing came back changed. What was lost was the case officer, whether the
authority accepts comments until decision, and the ODP metadata block. Those are not faults. They
are things the national public view was not designed to carry.

That is the answer to the storage question, and it is evidence rather than an opinion.

## Only approved records

The national public view is a publication, so a record nobody has approved has no business in it,
in the same way it has no business on the public endpoints. `dpr national translate --all` includes
unapproved records for testing, and says so.

The national tables are rebuilt from gold on every run rather than merged into. Nothing here is
hand edited and every row is derived, so an event that stops being true in gold stops existing here
too.

## The endpoints

    GET /public/national/datasets                             the eight, with row counts
    GET /public/national/{dataset}                            one dataset, as rows
    GET /public/national/application/{council}/{reference}    one application across all eight
    GET /private/national/coverage                            field by field, with reasons

Coverage sits on the private side because it describes the limits of the translation rather than
planning data, in the same way the edit history does.

## Where the field list lives

`src/dpr_pipeline/data/national_public_view.json`, vendored from the specification repository. The
eight tables are generated from it rather than written out in SQL, so there is one place a field
name exists. The national public view is still a working draft, so that file is expected to change.

The field by field basis for the mapping is the comparison written in August against
`documentation/national-public-view.md` and the ODP post submission published schema.
