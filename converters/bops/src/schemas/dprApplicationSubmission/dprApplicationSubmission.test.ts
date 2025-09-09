import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { DprApplicationSubmissionEndpoint } from '.'
import example from '../../fixtures/dpr/applicationSubmission.json'
import { debugSchema } from '../../utils/debugSchema'

describe('DprApplicationSubmissionEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    debugSchema(DprApplicationSubmissionEndpoint, valid)
    expect(Value.Check(DprApplicationSubmissionEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(DprApplicationSubmissionEndpoint, invalid)).toBe(false)
  })
})
