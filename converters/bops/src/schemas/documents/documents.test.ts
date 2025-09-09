import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsDocumentsEndpoint } from '.'
import example from './../../fixtures/bops/documents.json'

describe('BopsDocumentsEndpoint TypeBox schema', () => {
  it('validates a correct object', () => {
    const valid = example
    expect(Value.Check(BopsDocumentsEndpoint, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
  })

  it('rejects an object with duplicate files', () => {
    const invalid = { ...example, files: [example.files[0], example.files[0]] }
    expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
  })

  it('rejects an object with invalid decision notice uri', () => {
    const invalid = {
      ...example,
      decisionNotice: { ...example.decisionNotice, url: 'invalid-uri' }
    }
    expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
  })
})
