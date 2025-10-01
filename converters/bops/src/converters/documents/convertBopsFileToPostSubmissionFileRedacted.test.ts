import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import {
  convertBopsFileToPostSubmissionFileRedacted,
  convertTypesToFileType
} from './convertBopsFileToPostSubmissionFileRedacted'
import { FileType as FileTypeSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/FileType.ts'
import { Type } from '@sinclair/typebox'
import {
  type PostSubmissionFileRedacted,
  PostSubmissionFileRedacted as PostSubmissionFileRedactedSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'

describe('convertTypesToFileType', () => {
  it(`Converts types to filetype`, () => {
    const result = convertTypesToFileType([
      {
        value: 'floorPlan.proposed',
        description: 'Floor plan - proposed'
      },
      {
        value: 'floorPlan.proposed',
        description: 'Floor plan - proposed'
      },
      { value: 'roofPlan.proposed', description: 'Roof plan - proposed' }
    ])
    expect(result).toEqual(['floorPlan.proposed', 'roofPlan.proposed'])
    expect(Value.Check(Type.Array(FileTypeSchema), result)).toBe(true)
  })
})

describe('convertBopsFileToPostSubmissionFileRedacted', () => {
  const files: PostSubmissionFileRedacted[] = [
    {
      id: 1,
      name: 'myPlans.pdf',
      association: 'application',
      redactedUrl:
        'https://api.editor.planx.dev/file/private/tbp4kiba/myPlans.pdf',
      type: ['roofPlan.existing', 'roofPlan.proposed'],
      metadata: {
        size: {
          bytes: 123456
        },
        mimeType: 'application/pdf',
        createdAt: '2024-02-18T15:54:30.821Z',
        submittedAt: '2024-02-18T15:54:30.821Z',
        validatedAt: '2024-02-19T15:54:31.021Z',
        publishedAt: '2024-02-19T15:54:31.021Z'
      }
    },
    {
      id: 2,
      name: 'other.pdf',
      association: 'application',
      type: ['sitePlan.existing', 'sitePlan.proposed'],
      metadata: {
        size: {
          bytes: 123456
        },
        mimeType: 'application/pdf',
        createdAt: '2024-02-18T15:54:30.821Z',
        submittedAt: '2024-02-18T15:54:30.821Z',
        validatedAt: '2024-02-19T15:54:31.021Z',
        publishedAt: '2024-02-19T15:54:31.021Z'
      },
      redactedUrl:
        'https://api.editor.planx.dev/file/private/5w5v8s8z/other.pdf'
    },
    {
      id: 3,
      name: 'elevations.pdf',
      association: 'application',
      type: ['elevations.existing', 'elevations.proposed'],
      metadata: {
        size: {
          bytes: 123456
        },
        mimeType: 'application/pdf',
        createdAt: '2024-02-18T15:54:30.821Z',
        submittedAt: '2024-02-18T15:54:30.821Z',
        validatedAt: '2024-02-19T15:54:31.021Z',
        publishedAt: '2024-02-19T15:54:31.021Z'
      },
      redactedUrl:
        'https://api.editor.planx.dev/file/private/7nrefxnn/elevations.pdf'
    },
    {
      id: 4,
      name: 'floor_plans.pdf',
      association: 'application',
      type: ['floorPlan.existing', 'floorPlan.proposed'],
      metadata: {
        size: {
          bytes: 123456
        },
        mimeType: 'application/pdf',
        createdAt: '2024-02-18T15:54:30.821Z',
        submittedAt: '2024-02-18T15:54:30.821Z',
        validatedAt: '2024-02-19T15:54:31.021Z',
        publishedAt: '2024-02-19T15:54:31.021Z'
      },
      redactedUrl:
        'https://api.editor.planx.dev/file/private/311w2id6/floor_plans.pdf'
    }
  ]

  files.forEach((file, i) => {
    it(`Does nothing if data is already valid ${i}`, () => {
      const result = convertBopsFileToPostSubmissionFileRedacted(
        file,
        'application'
      )
      expect(result).toBe(file) // should return the same object by reference if no changes made
      expect(Value.Check(PostSubmissionFileRedactedSchema, result)).toBe(true)
    })
  })

  const bopsFiles = [
    {
      name: 'Design and Access Statement.PDF',
      referencesInDocument: ['DESIGN AND ACCESS STATEMENT'],
      url: 'https://camden.bops-staging.services/files/hv71uw5pvuuyxdrf8h6qnk6oh1nv',
      type: [
        {
          value: 'designAndAccessStatement',
          description: 'Design and Access Statement'
        }
      ],
      createdAt: '2024-05-02T16:14:40.682+01:00',
      applicantDescription: null,
      metadata: { byteSize: 1688899, contentType: 'application/pdf' }
    },
    {
      name: 'Planning and Heritage Statement.PDF',
      referencesInDocument: ['Planning \u0026 Heritage Statement'],
      url: 'https://camden.bops-staging.services/files/y4gy2dl9qcgjbrhk912q4692c4i7',
      type: [{ value: 'heritageStatement', description: 'Heritage Statement' }],
      createdAt: '2024-05-02T16:14:42.987+01:00',
      applicantDescription: null,
      metadata: { byteSize: 1546986, contentType: 'application/pdf' }
    },
    {
      name: 'Existing Section AA.PDF',
      referencesInDocument: ['1959-E-121'],
      url: 'https://camden.bops-staging.services/files/sbiapwpvh86zrinu4e78wq15caps',
      type: [
        { value: 'sections.existing', description: 'Sections - existing' }
      ],
      createdAt: '2024-05-02T16:14:43.295+01:00',
      applicantDescription: null,
      metadata: { byteSize: 53445, contentType: 'application/pdf' }
    },
    {
      name: 'Existing Section BB.PDF',
      referencesInDocument: ['1959-E-122'],
      url: 'https://camden.bops-staging.services/files/ps3cqrgq4cf0v0lh39dbibezj1w7',
      type: [
        { value: 'sections.existing', description: 'Sections - existing' }
      ],
      createdAt: '2024-05-02T16:14:43.570+01:00',
      applicantDescription: null,
      metadata: { byteSize: 49933, contentType: 'application/pdf' }
    },
    {
      name: 'Existing Section CC.PDF',
      referencesInDocument: ['Existing Section CC'],
      url: 'https://camden.bops-staging.services/files/2y63fozksyp0gkgv5qcp73lspp2h',
      type: [
        { value: 'sections.existing', description: 'Sections - existing' }
      ],
      createdAt: '2024-05-02T16:14:43.829+01:00',
      applicantDescription: null,
      metadata: { byteSize: 46489, contentType: 'application/pdf' }
    },
    {
      name: 'Existing Section DD.PDF',
      referencesInDocument: ['Existing Section DD'],
      url: 'https://camden.bops-staging.services/files/hnsvuidoyvhhqrfd530po17eyayj',
      type: [
        { value: 'sections.existing', description: 'Sections - existing' }
      ],
      createdAt: '2024-05-02T16:14:44.058+01:00',
      applicantDescription: null,
      metadata: { byteSize: 46845, contentType: 'application/pdf' }
    },
    {
      name: 'Existing Section EE.PDF',
      referencesInDocument: ['Existing Section EE'],
      url: 'https://camden.bops-staging.services/files/ji21s2zjtcb6e8uu361lbh9hbmhk',
      type: [
        { value: 'sections.existing', description: 'Sections - existing' }
      ],
      createdAt: '2024-05-02T16:14:45.631+01:00',
      applicantDescription: null,
      metadata: { byteSize: 49353, contentType: 'application/pdf' }
    },
    {
      name: 'Proposed Section AA.PDF',
      referencesInDocument: ['Proposed Section AA'],
      url: 'https://camden.bops-staging.services/files/iod3210n9n0gexvwt7nfpve34mri',
      type: [
        { value: 'sections.proposed', description: 'Sections - proposed' }
      ],
      createdAt: '2024-05-02T16:14:45.922+01:00',
      applicantDescription: null,
      metadata: { byteSize: 121021, contentType: 'application/pdf' }
    }
  ]

  bopsFiles.forEach((file, i) => {
    it(`Converts BOPS document from given examples ${i}`, () => {
      const result = convertBopsFileToPostSubmissionFileRedacted(
        file,
        'application'
      )
      expect(Value.Check(PostSubmissionFileRedactedSchema, result)).toBe(true)
    })
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsFileToPostSubmissionFileRedacted(
        {
          referencesInDocument: ['DESIGN AND ACCESS STATEMENT'],
          url: 'https://camden.bops-staging.services/files/hv71uw5pvuuyxdrf8h6qnk6oh1nv',
          type: [
            {
              value: 'designAndAccessStatement',
              description: 'Design and Access Statement'
            }
          ],
          createdAt: '2024-05-02T16:14:40.682+01:00',
          applicantDescription: null,
          metadata: { byteSize: 1688899, contentType: 'application/pdf' }
        },
        'application'
      )
    ).toThrow('Unable to convert file')
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsFileToPostSubmissionFileRedacted(
        {
          referencesInDocument: ['DESIGN AND ACCESS STATEMENT'],
          url: 'https://camden.bops-staging.services/files/hv71uw5pvuuyxdrf8h6qnk6oh1nv',
          type: [
            {
              value: 'invalid',
              description: 'Design and Access Statement'
            }
          ],
          createdAt: '2024-05-02T16:14:40.682+01:00',
          applicantDescription: null,
          metadata: { byteSize: 1688899, contentType: 'application/pdf' }
        },
        'application'
      )
    ).toThrow('Unable to convert file')
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsFileToPostSubmissionFileRedacted(
        {
          referencesInDocument: ['DESIGN AND ACCESS STATEMENT'],

          type: [
            {
              value: 'designAndAccessStatement',
              description: 'Design and Access Statement'
            }
          ],
          createdAt: '2024-05-02T16:14:40.682+01:00',
          applicantDescription: null,
          metadata: { byteSize: 1688899, contentType: 'application/pdf' }
        },
        'application'
      )
    ).toThrow('File is missing url')
  })
})
