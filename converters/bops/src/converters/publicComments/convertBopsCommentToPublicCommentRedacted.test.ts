import { describe, it, expect } from 'bun:test'
import {
  PublicCommentRedacted as PublicCommentRedactedSchema,
  type PublicCommentRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import { Value } from '@sinclair/typebox/value'
import { convertBopsCommentToPublicCommentRedacted } from './convertBopsCommentToPublicCommentRedacted'

describe('convertBopsCommentToPublicCommentRedacted', () => {
  const validPublicCommentRedacted: PublicCommentRedacted[] = [
    {
      id: '2',
      sentiment: 'objection',
      commentRedacted: [
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
      id: '2',
      sentiment: 'objection',
      commentRedacted: 'Comment on other things',
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

  validPublicCommentRedacted.forEach((comment, i) => {
    it(`Does nothing if data is already valid ${i}`, () => {
      const result = convertBopsCommentToPublicCommentRedacted(comment)
      expect(result).toBe(comment) // should return the same object by reference if no changes made
      expect(Value.Check(PublicCommentRedactedSchema, result)).toBe(true)
    })
  })

  const bopsPublicComments = [
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
    }
  ]

  bopsPublicComments.forEach((comment, i) => {
    it(`Converts BOPS public comment from given examples ${i}`, () => {
      const result = convertBopsCommentToPublicCommentRedacted(comment)
      expect(Value.Check(PublicCommentRedactedSchema, result)).toBe(true)
    })
  })

  it('Throws an error if it cant convert', () => {
    expect(() =>
      convertBopsCommentToPublicCommentRedacted({
        sentiment: 'supportive',
        comment: 'This is comment number 28'
      })
    ).toThrow('Unable to convert public comment')
  })
})
