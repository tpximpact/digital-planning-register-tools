import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsFile } from './BopsFile'

describe('BopsFile TypeBox schema', () => {
  const valid = {
    name: 'CIL FORM .pdf',
    referencesInDocument: ['CIL form'],
    url: 'https://camden.bops.services/files/123456789',
    type: [
      {
        value: 'relevantInformation',
        description: 'Relevent information'
      }
    ],
    createdAt: '2025-07-03T15:25:03.333+01:00',
    applicantDescription: null,
    metadata: { byteSize: 15304, contentType: 'application/pdf' }
  }
  it('validates a correct object', () => {
    expect(Value.Check(BopsFile, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {
      name: 'CIL FORM .pdf',
      referencesInDocument: ['CIL form'],
      // missing url
      type: [
        {
          value: 'relevantInformation',
          description: 'Relevent information'
        }
      ],
      createdAt: 'invalid-date',
      applicantDescription: null,
      metadata: { byteSize: 15304, contentType: 'application/pdf' }
    }
    expect(Value.Check(BopsFile, invalid)).toBe(false)
  })

  describe('bops-date-time field', () => {
    it('validates bops-date-time field', () => {
      expect(Value.Check(BopsFile, valid)).toBe(true)
    })
    it('rejects an invalid bops-date-time field', () => {
      expect(
        Value.Check(BopsFile, { ...valid, createdAt: '2025-07-03T14:23:53Z' })
      ).toBe(false)
    })
  })

  describe('uri field', () => {
    it('validates uri field', () => {
      expect(Value.Check(BopsFile, valid)).toBe(true)
    })
    it('rejects an invalid uri field', () => {
      expect(Value.Check(BopsFile, { ...valid, url: 'invalid-uri' })).toBe(
        false
      )
    })
  })
})
