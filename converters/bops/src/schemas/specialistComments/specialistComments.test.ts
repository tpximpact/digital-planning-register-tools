import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsSpecialistCommentsEndpoint } from '.'
import example from '../../fixtures/bops/specialistComments.json'

describe('BopsSpecialistCommentsEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsSpecialistCommentsEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsSpecialistCommentsEndpoint, invalid)).toBe(false)
  })
})
