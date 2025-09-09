import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsPublicCommentsEndpoint } from '.'
import example from '../../fixtures/bops/publicComments.json'

describe('BopsPublicCommentsEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsPublicCommentsEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsPublicCommentsEndpoint, invalid)).toBe(false)
  })
})
