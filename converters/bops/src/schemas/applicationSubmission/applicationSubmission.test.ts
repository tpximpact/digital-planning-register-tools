import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsApplicationSubmissionEndpoint } from '.'
import example from '../../fixtures/bops/applicationSubmission.json'

describe('BopsApplicationSubmissionEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsApplicationSubmissionEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsApplicationSubmissionEndpoint, invalid)).toBe(false)
  })
})
