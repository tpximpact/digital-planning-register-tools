import { describe, it, expect } from 'bun:test'
import {
  convertBopsSpecialistCommentToSpecialistCommentRedacted,
  convertBopsSpecialistToSpecialistRedacted
} from './convertBopsSpecialistToSpecialistRedacted'
import {
  SpecialistRedactedSchema,
  SpecialistCommentRedactedSchema,
  type SpecialistRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'
import { Value } from '@sinclair/typebox/value'

describe('convertBopsSpecialistToSpecialistRedacted', () => {
  it('Does nothing if data is already valid', () => {
    const validSpecialistRedacted: SpecialistRedacted = {
      id: '1',
      organisationSpecialism: 'Historic England',
      reason: 'constraint',
      name: {
        singleLine: 'Jane Smith'
      },
      constraints: [
        {
          value: 'monument',
          description: 'Site of a Scheduled Monument',
          intersects: true,
          entities: [
            {
              name: 'Rochester Castle',
              source: {
                text: 'Planning Data',
                url: 'https://www.planning.data.gov.uk/entity/13909855'
              }
            }
          ]
        }
      ],
      firstConsultedAt: '2024-02-20T15:54:31.021Z',
      comments: [
        {
          // this is a published comment that has been validated and redacted
          id: '1',
          sentiment: 'amendmentsNeeded',
          commentRedacted: 'Please amend this application *********',
          metadata: {
            submittedAt: '2024-02-20T15:54:31.021Z',
            validatedAt: '2024-02-21T15:54:31.021Z',
            publishedAt: '2024-02-21T15:54:31.021Z'
          }
        }
      ]
    }

    const result = convertBopsSpecialistToSpecialistRedacted(
      validSpecialistRedacted
    )
    expect(result).toBe(validSpecialistRedacted) // should return the same object by reference if no changes made
    expect(Value.Check(SpecialistRedactedSchema, result)).toBe(true)
  })

  const bopsSpecialists = [
    {
      id: '284',
      organisationSpecialism: 'London Borough of Camden Council',
      jobTitle: 'Amy Ly',
      reason: 'Other',
      firstConsultedAt: '2025-01-30T11:34:12Z',
      comments: [
        {
          id: '90',
          sentiment: 'approved',
          commentRedacted: 'test approve',
          metadata: {
            submittedAt: '2025-01-30T11:44:30Z',
            publishedAt: '2025-04-11T11:30:43Z'
          }
        },
        {
          id: '91',
          sentiment: 'objected',
          commentRedacted: 'testing testing',
          metadata: {
            submittedAt: '2025-01-30T14:47:58Z',
            publishedAt: '2025-04-11T11:30:40Z'
          }
        },
        {
          id: '89',
          sentiment: 'amendmentsNeeded',
          commentRedacted: 'test amendments',
          metadata: {
            submittedAt: '2025-01-30T11:36:01Z',
            publishedAt: '2025-04-11T11:30:47Z'
          }
        },
        {
          id: '88',
          sentiment: 'objected',
          commentRedacted: 'test objection',
          metadata: {
            submittedAt: '2025-01-30T11:34:51Z',
            publishedAt: '2025-04-11T11:30:51Z'
          }
        }
      ]
    },
    {
      id: '348',
      organisationSpecialism: 'London Borough of Camden Council',
      jobTitle: 'Transport (generic email)',
      reason: 'Other',
      firstConsultedAt: '2025-07-03T14:47:27Z',
      comments: [
        {
          id: '123',
          sentiment: 'approved',
          commentRedacted:
            'Secure cycle parking via condition and car-free via s106. ',
          metadata: {
            submittedAt: '2025-07-03T14:56:58Z',
            publishedAt: '2025-07-03T15:49:48Z'
          }
        }
      ]
    },
    {
      id: '349',
      organisationSpecialism: 'Camden Town CAAC',
      jobTitle: 'Conservation area advisory committee',
      reason: 'Other',
      firstConsultedAt: '2025-07-03T14:47:27Z',
      comments: [
        {
          id: '122',
          sentiment: 'amendmentsNeeded',
          commentRedacted:
            'The original factory building at 5-6 Underhill Street was partially destroyed by enemy action during WWII and rebuilt in 1946. The site is located within Camden Town Conservation Area.\r\n\r\nIn 1988 consent was granted for external alterations to the building (plus small extension). This is the building we find today.\r\n\r\nUnderhill Street façade (ref 8701306)\r\n\r\nThe current proposal seeks to return the Underhill Street elevation to an arrangement of four windows at ground floor level as previously granted in 1988.\r\n\r\nTo ensure the building retains an architecturally coherent appearance there should be a condition attached to any consent requiring the new windows to match the existing windows in style i.e. have an ‘Art Deco’ metal Crittall-like appearance.\r\n\r\nProviding the design of the proposed windows is in keeping, the elevational changes are considered not to harm the contribution made by this building to the character and appearance of the streetscape and hence the conservation area.\r\n',
          files: [
            {
              name: 'Picture.jpg',
              referencesInDocument: [],
              url: 'https://camden.bops-staging.services/files/uro1k24a6cu2rbobpbfnj8j4tl96',
              type: [],
              createdAt: '2025-07-03T15:55:27.530+01:00',
              applicantDescription: null,
              metadata: { byteSize: 41743, contentType: 'image/jpeg' }
            }
          ],
          metadata: {
            submittedAt: '2025-07-03T14:55:27Z',
            publishedAt: '2025-07-03T15:01:05Z'
          }
        }
      ]
    }
  ]

  bopsSpecialists.forEach((specialist, i) => {
    it(`Converts BOPS specialist comment from given examples ${i}`, () => {
      const result = convertBopsSpecialistToSpecialistRedacted(specialist)
      expect(Value.Check(SpecialistRedactedSchema, result)).toBe(true)
    })
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsSpecialistToSpecialistRedacted({
        organisationSpecialism: 'Camden Town CAAC',
        jobTitle: 'Conservation area advisory committee',
        reason: 'Other',
        firstConsultedAt: '2025-07-03T14:47:27Z',
        comments: [
          {
            id: '122',
            sentiment: 'amendmentsNeeded',
            commentRedacted:
              'The original factory building at 5-6 Underhill Street was partially destroyed by enemy action during WWII and rebuilt in 1946. The site is located within Camden Town Conservation Area.\r\n\r\nIn 1988 consent was granted for external alterations to the building (plus small extension). This is the building we find today.\r\n\r\nUnderhill Street façade (ref 8701306)\r\n\r\nThe current proposal seeks to return the Underhill Street elevation to an arrangement of four windows at ground floor level as previously granted in 1988.\r\n\r\nTo ensure the building retains an architecturally coherent appearance there should be a condition attached to any consent requiring the new windows to match the existing windows in style i.e. have an ‘Art Deco’ metal Crittall-like appearance.\r\n\r\nProviding the design of the proposed windows is in keeping, the elevational changes are considered not to harm the contribution made by this building to the character and appearance of the streetscape and hence the conservation area.\r\n',
            files: [
              {
                name: 'Picture.jpg',
                referencesInDocument: [],
                url: 'https://camden.bops-staging.services/files/uro1k24a6cu2rbobpbfnj8j4tl96',
                type: [],
                createdAt: '2025-07-03T15:55:27.530+01:00',
                applicantDescription: null,
                metadata: { byteSize: 41743, contentType: 'image/jpeg' }
              }
            ],
            metadata: {
              submittedAt: '2025-07-03T14:55:27Z',
              publishedAt: '2025-07-03T15:01:05Z'
            }
          }
        ]
      })
    ).toThrow('Unable to convert specialist')
  })

  it(`Supports comment author if it starts getting sent through`, () => {
    const comment: unknown = {
      id: '348',
      organisationSpecialism: 'London Borough of Camden Council',
      jobTitle: 'Transport (generic email)',
      reason: 'Other',
      firstConsultedAt: '2025-07-03T14:47:27Z',
      name: {
        singleLine: 'John Doe'
      },
      comments: [
        {
          id: '123',
          sentiment: 'approved',
          commentRedacted:
            'Secure cycle parking via condition and car-free via s106. ',
          metadata: {
            submittedAt: '2025-07-03T14:56:58Z',
            publishedAt: '2025-07-03T15:49:48Z'
          }
        }
      ]
    }
    const result = convertBopsSpecialistToSpecialistRedacted(comment)
    expect(result.name.singleLine).toBe('John Doe')
    expect(Value.Check(SpecialistRedactedSchema, result)).toBe(true)
  })
})

describe('convertBopsSpecialistCommentToSpecialistCommentRedacted', () => {
  const bopsSpecialistComments = [
    {
      id: '90',
      sentiment: 'approved',
      commentRedacted: 'test approve',
      metadata: {
        submittedAt: '2025-01-30T11:44:30Z',
        publishedAt: '2025-04-11T11:30:43Z'
      }
    },
    {
      id: '91',
      sentiment: 'objected',
      commentRedacted: 'testing testing',
      metadata: {
        submittedAt: '2025-01-30T14:47:58Z',
        publishedAt: '2025-04-11T11:30:40Z'
      }
    },
    {
      id: '89',
      sentiment: 'amendmentsNeeded',
      commentRedacted: 'test amendments',
      metadata: {
        submittedAt: '2025-01-30T11:36:01Z',
        publishedAt: '2025-04-11T11:30:47Z'
      }
    },
    {
      id: '88',
      sentiment: 'objected',
      commentRedacted: 'test objection',
      metadata: {
        submittedAt: '2025-01-30T11:34:51Z',
        publishedAt: '2025-04-11T11:30:51Z'
      }
    },
    {
      id: '123',
      sentiment: 'approved',
      commentRedacted:
        'Secure cycle parking via condition and car-free via s106. ',
      metadata: {
        submittedAt: '2025-07-03T14:56:58Z',
        publishedAt: '2025-07-03T15:49:48Z'
      }
    },
    {
      id: '122',
      sentiment: 'amendmentsNeeded',
      commentRedacted:
        'The original factory building at 5-6 Underhill Street was partially destroyed by enemy action during WWII and rebuilt in 1946. The site is located within Camden Town Conservation Area.\r\n\r\nIn 1988 consent was granted for external alterations to the building (plus small extension). This is the building we find today.\r\n\r\nUnderhill Street façade (ref 8701306)\r\n\r\nThe current proposal seeks to return the Underhill Street elevation to an arrangement of four windows at ground floor level as previously granted in 1988.\r\n\r\nTo ensure the building retains an architecturally coherent appearance there should be a condition attached to any consent requiring the new windows to match the existing windows in style i.e. have an ‘Art Deco’ metal Crittall-like appearance.\r\n\r\nProviding the design of the proposed windows is in keeping, the elevational changes are considered not to harm the contribution made by this building to the character and appearance of the streetscape and hence the conservation area.\r\n',
      files: [
        {
          name: 'Picture.jpg',
          referencesInDocument: [],
          url: 'https://camden.bops-staging.services/files/uro1k24a6cu2rbobpbfnj8j4tl96',
          type: [],
          createdAt: '2025-07-03T15:55:27.530+01:00',
          applicantDescription: null,
          metadata: { byteSize: 41743, contentType: 'image/jpeg' }
        }
      ],
      metadata: {
        submittedAt: '2025-07-03T14:55:27Z',
        publishedAt: '2025-07-03T15:01:05Z'
      }
    }
  ]

  bopsSpecialistComments.forEach((specialistComment, i) => {
    it(`Converts BOPS specialist comments from given examples ${i}`, () => {
      const result =
        convertBopsSpecialistCommentToSpecialistCommentRedacted(
          specialistComment
        )
      expect(Value.Check(SpecialistCommentRedactedSchema, result)).toBe(true)
    })
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsSpecialistCommentToSpecialistCommentRedacted({
        id: '90',
        sentiment: 'approved',
        metadata: {
          submittedAt: '2025-01-30T11:44:30Z',
          publishedAt: '2025-04-11T11:30:43Z'
        }
      })
    ).toThrow('Unable to convert specialist comment')
  })
})
