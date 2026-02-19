import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsApplicationSchema } from './BopsApplication'
import { validBopsApplication } from '../../mocks/validBopsApplication'

describe('BopsApplication TypeBox schema', () => {
  const valid = validBopsApplication
  it('validates a correct object', () => {
    expect(Value.Check(BopsApplicationSchema, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = { ...valid, reference: 12345 } // reference should be a string
    expect(Value.Check(BopsApplicationSchema, invalid)).toBe(false)
  })

  describe('bops-date-time field', () => {
    it('validates bops-date-time field', () => {
      expect(Value.Check(BopsApplicationSchema, valid)).toBe(true)
    })
    it('rejects an invalid bops-date-time field', () => {
      expect(
        Value.Check(BopsApplicationSchema, {
          ...valid,
          receivedAt: '2025-07-03T14:23:53Z',
          validAt: '2025-07-03T14:23:53Z',
          publishedAt: '2025-07-03T14:23:53Z',
          determinedAt: '2025-07-03T14:23:53Z'
        })
      ).toBe(false)
    })
  })

  describe('date field', () => {
    it('validates date field', () => {
      expect(Value.Check(BopsApplicationSchema, valid)).toBe(true)
    })
    it('rejects an invalid date field', () => {
      expect(
        Value.Check(BopsApplicationSchema, {
          ...valid,
          targetDate: '2025-07-03T14:23:53Z'
        })
      ).toBe(false)
    })
  })
})
