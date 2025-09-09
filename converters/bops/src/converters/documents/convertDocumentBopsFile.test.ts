import { describe, it, expect } from 'bun:test'
import { convertDocumentBopsFile } from './convertDocumentBopsFile'
import type { BopsFile } from '../../schemas/shared/BopsFile'

describe('convertDocumentBopsFile', () => {
  it('converts a full BopsFile to PostSubmissionFile', () => {
    const bopsFile = {
      name: 'Test Document',
      referencesInDocument: ['CIL form'],
      url: 'https://example.com/file.pdf',
      type: [
        {
          value: 'relevantInformation',
          description: 'Relevant Information'
        }
      ],
      createdAt: '2025-07-03T15:23:53.264+01:00',
      applicantDescription: null,
      metadata: { byteSize: 12345, contentType: 'application/pdf' }
    }
    const result = convertDocumentBopsFile(bopsFile, 'application')

    expect(result.name).toBe('Test Document')
    expect(result.association).toBe('application')
    expect(result.type).toEqual(['relevantInformation'])
    expect(result.url).toBe('https://example.com/file.pdf')
    expect(result.metadata.size.bytes).toBe(12345)
    expect(result.metadata.mimeType).toBe('application/pdf')
    expect(result.metadata.createdAt).toBe('2025-07-03T14:23:53Z')
    expect(result.metadata.submittedAt).toBe('2025-07-03T14:23:53Z')
    expect(result.metadata.validatedAt).toBe('2025-07-03T14:23:53Z')
    expect(result.metadata.publishedAt).toBe('2025-07-03T14:23:53Z')
    expect(typeof result.id).toBe('number')
  })

  it('handles missing fields and defaults', () => {
    const minimalFile = { type: [], url: '', createdAt: '' }
    const result = convertDocumentBopsFile(minimalFile as unknown as BopsFile)
    expect(result.name).toBe('Unnamed document')
    expect(result.association).toBe('application')
    expect(result.type).toEqual(['otherDocument'])
    expect(result.url).toBe('')
    expect(result.metadata.size.bytes).toBe(0)
    expect(result.metadata.mimeType).toBe('application/octet-stream')
    expect(result.metadata.createdAt).toBe('Invalid Date')
    expect(result.metadata.submittedAt).toBe('Invalid Date')
    expect(result.metadata.validatedAt).toBe('Invalid Date')
    expect(result.metadata.publishedAt).toBe('Invalid Date')
    expect(typeof result.id).toBe('number')
  })
})
