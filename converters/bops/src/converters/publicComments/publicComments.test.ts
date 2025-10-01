import { describe, it, expect, spyOn } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import {
  type PostSubmissionPublishedPublicCommentsResponse,
  PostSubmissionPublishedPublicCommentsResponse as PostSubmissionPublishedPublicCommentsResponseSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { bopsPublicCommentsEndpointToOdp } from './publicComments'

describe('bopsPublicCommentsEndpointToOdp', () => {
  it('Does nothing if data is already valid', () => {
    const validPublicEndpointRedacted: PostSubmissionPublishedPublicCommentsResponse =
      {
        status: {
          code: 200,
          message: 'OK'
        },
        pagination: {
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 1,
          totalResults: 2,
          totalAvailableItems: 2
        },
        data: {
          summary: {
            totalComments: 2,
            sentiment: {
              supportive: 1,
              objection: 1,
              neutral: 0
            }
          },
          comments: [
            {
              // This comment is published, validated and redacted for public view
              id: '1',
              sentiment: 'supportive',
              commentRedacted: [
                {
                  topic: 'traffic',
                  question:
                    'Comment on impacts to traffic, parking or road safety',
                  comment: 'lalala'
                },
                {
                  topic: 'other',
                  question: 'Comment on other things',
                  comment: 'lalala'
                }
              ],
              author: {
                name: {
                  singleLine: 'John Doe'
                }
              },
              metadata: {
                submittedAt: '2024-02-20T15:54:31.021Z',
                validatedAt: '2024-02-21T15:54:31.021Z',
                publishedAt: '2024-02-21T15:54:31.021Z'
              }
            },
            {
              // This comment is published, validated and redacted for public view
              id: '2',
              sentiment: 'objection',
              commentRedacted: [
                {
                  topic: 'traffic',
                  question:
                    'Comment on impacts to traffic, parking or road safety',
                  comment: 'lalala'
                },
                {
                  topic: 'other',
                  question: 'Comment on other things',
                  comment: 'lalala'
                }
              ],
              author: {
                name: {
                  singleLine: 'John Doe'
                }
              },
              metadata: {
                submittedAt: '2024-02-20T15:54:31.021Z',
                validatedAt: '2024-02-21T15:54:31.021Z',
                publishedAt: '2024-02-21T15:54:31.021Z'
              }
            }
          ]
        }
      }

    const result = bopsPublicCommentsEndpointToOdp(
      validPublicEndpointRedacted,
      {
        code: 200,
        message: 'OK'
      }
    )
    expect(result).toBe(validPublicEndpointRedacted) // should return the same object by reference if no changes made
    expect(
      Value.Check(PostSubmissionPublishedPublicCommentsResponseSchema, result)
    ).toBe(true)
  })

  it('Converts an invalid endpoint', () => {
    const validPublicCommentsEndpointRedacted = {
      pagination: {
        resultsPerPage: 10,
        currentPage: 1,
        totalPages: 3,
        totalResults: 30,
        totalAvailableItems: 30
      },
      summary: {
        totalComments: 30,
        sentiment: { supportive: 15, objection: 5, neutral: 10 }
      },
      comments: [
        {
          id: 591,
          sentiment: 'supportive',
          comment: 'This is comment number 30',
          receivedAt: '2025-04-11T11:37:36Z'
        },
        {
          id: 590,
          sentiment: 'supportive',
          comment: 'This is comment number 29',
          receivedAt: '2025-04-11T11:37:31Z'
        },
        {
          id: 589,
          sentiment: 'supportive',
          comment: 'This is comment number 28',
          receivedAt: '2025-04-11T11:37:26Z'
        },
        {
          id: 587,
          sentiment: 'supportive',
          comment: 'This is comment number 26',
          receivedAt: '2025-04-11T11:37:15Z'
        },
        {
          id: 585,
          sentiment: 'supportive',
          comment: 'This is comment number 24',
          receivedAt: '2025-04-11T11:37:05Z'
        },
        {
          id: 584,
          sentiment: 'objection',
          comment: 'This is comment number 23',
          receivedAt: '2025-04-11T11:37:00Z'
        },
        {
          id: 583,
          sentiment: 'supportive',
          comment: 'This is comment number 22',
          receivedAt: '2025-04-11T11:36:55Z'
        },
        {
          id: 582,
          sentiment: 'neutral',
          comment: 'This is comment number 21',
          receivedAt: '2025-04-11T11:36:50Z'
        },
        {
          id: 581,
          sentiment: 'objection',
          comment: 'This is comment number 20',
          receivedAt: '2025-04-11T11:36:45Z'
        },
        {
          id: 580,
          sentiment: 'supportive',
          comment: 'This is comment number 19',
          receivedAt: '2025-04-11T11:36:40Z'
        }
      ]
    }

    const result = bopsPublicCommentsEndpointToOdp(
      validPublicCommentsEndpointRedacted,
      {
        code: 200,
        message: 'OK'
      }
    )
    expect(
      Value.Check(PostSubmissionPublishedPublicCommentsResponseSchema, result)
    ).toBe(true)

    expect(result.pagination).toEqual({
      resultsPerPage: 10,
      currentPage: 1,
      totalPages: 3,
      totalResults: 30,
      totalAvailableItems: 30
    })
  })

  it('Adjusts pagination if one isnt returned', () => {
    const validPublicCommentsEndpointRedacted = {
      pagination: {
        resultsPerPage: 10,
        currentPage: 1,
        totalPages: 3,
        totalResults: 30,
        totalAvailableItems: 30
      },
      summary: {
        totalComments: 30,
        sentiment: { supportive: 15, objection: 5, neutral: 10 }
      },
      comments: [
        {
          id: 591,
          sentiment: 'supportive',
          comment: 'This is comment number 30',
          receivedAt: '2025-04-11T11:37:36Z'
        },
        {
          id: 590,
          sentiment: 'supportive',
          comment: 'This is comment number 29',
          receivedAt: '2025-04-11T11:37:31Z'
        },
        {
          id: 589,
          sentiment: 'supportive',
          comment: 'This is comment number 28',
          receivedAt: '2025-04-11T11:37:26Z'
        },
        {
          id: 587,
          sentiment: 'supportive',
          comment: 'This is comment number 26',
          receivedAt: '2025-04-11T11:37:15Z'
        },
        {
          id: 585,
          sentiment: 'supportive',
          comment: 'This is comment number 24',
          receivedAt: '2025-04-11T11:37:05Z'
        },
        {
          id: 584,
          sentiment: 'objection',
          comment: 'This is comment number 23',
          receivedAt: '2025-04-11T11:37:00Z'
        },
        {
          id: 583,
          sentiment: 'supportive',
          comment: 'This is comment number 22',
          receivedAt: '2025-04-11T11:36:55Z'
        },
        {
          id: 582,
          sentiment: 'neutral',
          comment: 'This is comment number 21',
          receivedAt: '2025-04-11T11:36:50Z'
        },
        {
          id: 581,
          sentiment: 'objection',
          comment: 'This is comment number 20',
          receivedAt: '2025-04-11T11:36:45Z'
        },
        {
          id: 580,
          comment: 'This is comment number 19',
          receivedAt: '2025-04-11T11:36:40Z'
        }
      ]
    }

    // Spy on console.warn
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})

    const result = bopsPublicCommentsEndpointToOdp(
      validPublicCommentsEndpointRedacted,
      {
        code: 200,
        message: 'OK'
      }
    )

    expect(warnSpy).toHaveBeenCalledWith(
      'Error converting public comment but its taken care of elsewhere:',
      expect.any(Error)
    )

    warnSpy.mockRestore()
    expect(
      Value.Check(PostSubmissionPublishedPublicCommentsResponseSchema, result)
    ).toBe(true)

    expect(result.pagination).toEqual({
      resultsPerPage: 10,
      currentPage: 1,
      totalPages: 3,
      totalResults: 29,
      totalAvailableItems: 29
    })
  })
})
