import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsSearchEndpoint } from '.'
import example from '../../fixtures/bops/search.json'

describe('BopsSearchEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsSearchEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsSearchEndpoint, invalid)).toBe(false)
  })
})
