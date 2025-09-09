import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsShowEndpoint } from '.'
import example from '../../fixtures/bops/show.json'

describe('BopsShowEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsShowEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsShowEndpoint, invalid)).toBe(false)
  })
})
