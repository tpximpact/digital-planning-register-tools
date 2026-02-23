import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsFileSchema } from './BopsFile'
import { validBopsFile } from '../../mocks/validBopsFile'

describe('BopsFile TypeBox schema', () => {
  const valid = validBopsFile
  it('validates a correct object', () => {
    expect(Value.Check(BopsFileSchema, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = { ...valid, createdAt: 'large' } // createdAt should be a date
    expect(Value.Check(BopsFileSchema, invalid)).toBe(false)
  })

  describe('bops-date-time field', () => {
    it('validates bops-date-time field', () => {
      expect(Value.Check(BopsFileSchema, valid)).toBe(true)
    })
    it('rejects an invalid bops-date-time field', () => {
      expect(
        Value.Check(BopsFileSchema, {
          ...valid,
          createdAt: '2025-07-03T14:23:53Z'
        })
      ).toBe(false)
    })
  })

  describe('uri field', () => {
    it('validates uri field', () => {
      expect(Value.Check(BopsFileSchema, valid)).toBe(true)
    })
    it('rejects an invalid uri field', () => {
      expect(
        Value.Check(BopsFileSchema, { ...valid, url: 'invalid-uri' })
      ).toBe(false)
    })
  })
})
