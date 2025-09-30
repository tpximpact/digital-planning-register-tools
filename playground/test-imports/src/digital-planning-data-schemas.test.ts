import { describe, expect, it } from 'bun:test'
import * as example from 'digital-planning-data-schemas/examples/postSubmissionPublishedApplication/planningPermission/fullHouseholder-04-assessment-03-committee-determined.json'
import * as schemas from 'digital-planning-data-schemas/schemas/postSubmissionPublishedApplication.json'
import * as types from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/lib/realisticDates.ts'

/**
 * Tests to ensure the package is correctly exporting its modules
 * and that they can be imported without errors.
 *
 * Currently digital-planning-data-schemas has three main exports:
 * "main": "schema/schema.json",
 * "files": [
 *   "types",
 *   "schemas",
 *   "examples"
 * ],
 * "exports": {
 *   "./types/*": "./types/*",
 *   "./schemas/*": "./schemas/*",
 *   "./examples/*": "./examples/*"
 * },
 *
 * This test checks that each of these can be imported and used.
 *
 * Why .ts/.json?
 * Currently the digital-planning-data-schemas doesn't export a main module that can be imported directly.
 * Instead, it provides access to its contents via sub-paths (like ./types/, ./schemas/, ./examples/).
 * Therefore, to test the types, we need to import a specific .ts file directly.
 *
 * Note: If digital-planning-data-schemas adds a main entry point in the future,
 * this test can be updated to import that directly instead.
 */

describe('digital-planning-data-schemas-0.7.5.tgz', () => {
  it('should export examples', () => {
    expect(example).not.toBeNull()
  })

  it('should export schemas', () => {
    expect(schemas).not.toBeNull()
  })

  it('should export types', () => {
    expect(types.generateRealisticDates()).toBeObject()
  })
})
