# Decisions

Short notes on why the pipeline is built this way. Agreed in the sessions on 16 September 2026 with
the team unless stated otherwise.

## Python, not FME

FME can do the job and Barnet have proved it, but reproducing their setup needs a particular FME
version, and access to that usually goes through a supplier. If the point is that any council can
pick this up, it cannot depend on a licence. Python is free and portable. The FME route is written
up in the playbook as one of the options rather than as the foundation.

## DuckDB

One file, no server to install, ordinary SQL. Anyone can clone the repo and run the whole thing on
a laptop before deciding anything. Postgres is the obvious step up later and the code barely
changes.

Nothing on the reading side needs a database at all, so no council has to stand up Oracle for us to
work with their data.

## Bronze is different everywhere, silver and gold are the same

Bronze holds a copy of whatever the council's export gave us, in its own shape. Silver and gold
hold the standard shape.

Bronze exists for two reasons. If the supplier changes the data or cuts off access, we still have
what we pulled. And the mapper can be re-run as often as we like without going back to the council
for another export.

## Nothing is trimmed on the way into bronze

Storage is cheap and asking a council for a second export is slow. If we trim early and later find
silver needs a field we dropped, we wait on them again. The one exception is personal data, which
is left out at the export step rather than carried and then removed.

## Nothing gets installed on a council's systems

The prototype runs on our machines against their exports. Installation only becomes a question if
someone wants it running in their own environment, which is a later step.

## Gaps are recorded, not filled in

Where a value cannot be placed, the record still goes to silver and the gap is written to
`silver.mapping_issues`. A guessed value looks like data and is worse than a visible gap.

This matters more than it sounds. In a run of 200 real Camden records, 125 had an application type
we could map and 74 did not. The biggest groups were tree works notifications, listed building
consent and householder applications. That is a question for the standard, not something a mapper
should paper over.

## Camden's point is kept as a point

Camden publishes a coordinate, not a site boundary. The earlier converter drew a small circle
around the point and passed it off as a boundary. On a map that reads as a real site outline, so
here the point stays a point and the missing boundary is recorded as a gap.

## Camden first

Camden's API is public, needs no key, and updates daily, so that work waits on nobody. Barnet needs
a key, and the only Barnet data available is already converted, so it cannot show the source shape.

## Storage is chosen in config

One council may have S3, another Azure, another neither. The path in the config decides, the code
does not branch, and a local folder works the same way. That is what lets someone try the whole
thing before committing to any platform.
