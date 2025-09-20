import type { BopsFile } from '../schemas/shared/BopsFile'

export const validBopsFile: BopsFile = {
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
