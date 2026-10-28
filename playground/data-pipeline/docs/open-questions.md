# Open questions

Questions the prototype could not answer, written down so whoever picks this up knows what to
ask. Most came out of Dave's database schema work on 7 October 2026.

## Data model

- Should the site be its own table, or stay inside the application record?
- Are materials one to many with an application?
- Are environmental impacts one to many, with none allowed?
- Is prior approval a yes or no field, and does it need a reason?
- Is "listed" an application type or a property of the building? The schema treats it as a type,
  and combinations such as `pp.full.householder.listed` exist as single values.

## Councils and the standard

- Which of the standard's application types does each council actually use? The standard lists
  them but not which are in use.
- 23 of the 52 national public view fields have no source in the register format. Who would
  supply them?
