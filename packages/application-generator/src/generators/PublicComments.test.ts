import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import {
  generateCommentMetadata,
  generatePublicComment,
  generatePublicCommentRedacted,
  generatePublicComments,
  generatePublicCommentsRedacted,
  generatePublicCommentSummary,
  generateTopicAndComments
} from './PublicComments'
import { Type } from '@sinclair/typebox'
import {
  PublicCommentSchema,
  PublicCommentRedactedSchema,
  TopicAndCommentsSchema,
  type PublicComment,
  type PublicCommentRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import type { PossibleDates } from '../libs/generateAllPossibleDates'
import {
  PublicCommentsRedactedSchema,
  PublicCommentsSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/Comment.ts'

describe('generateTopicAndComments', () => {
  it('returns an valid PostSubmissionFile[]', () => {
    const obj = generateTopicAndComments()
    expect(obj).toBeDefined()
    expect(Value.Check(Type.Array(TopicAndCommentsSchema), obj)).toBe(true)
  })
})

describe('generateCommentMetadata', () => {
  it('should return all date fields as ISO strings', () => {
    const metadata = generateCommentMetadata()
    expect(typeof metadata.submittedAt).toBe('string')
    expect(typeof metadata.validatedAt).toBe('string')
    expect(typeof metadata.publishedAt).toBe('string')
    expect(!isNaN(Date.parse(metadata.submittedAt))).toBe(true)
    expect(!isNaN(Date.parse(metadata.validatedAt))).toBe(true)
    expect(!isNaN(Date.parse(metadata.publishedAt))).toBe(true)
  })

  it('should return dates in chronological order', () => {
    const metadata = generateCommentMetadata()
    const submittedAt = new Date(metadata.submittedAt)
    const validatedAt = new Date(metadata.validatedAt)
    const publishedAt = new Date(metadata.publishedAt)
    expect(submittedAt.getTime()).toBeLessThanOrEqual(validatedAt.getTime())
    expect(validatedAt.getTime()).toBeLessThanOrEqual(publishedAt.getTime())
  })

  it('should respect provided PossibleDates', () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 10)
    const end = new Date(now)
    end.setDate(now.getDate() + 10)
    const fakeDates = {
      consultation: {
        startAt: start,
        endAt: end
      }
    }
    const metadata = generateCommentMetadata(
      fakeDates as unknown as PossibleDates
    )
    const submittedAt = new Date(metadata.submittedAt)
    const publishedAt = new Date(metadata.publishedAt)
    expect(submittedAt.getTime()).toBeGreaterThanOrEqual(start.getTime())
    expect(publishedAt.getTime()).toBeLessThanOrEqual(end.getTime())
  })
})

describe('generatePublicComment', () => {
  it('returns an valid PublicComment', () => {
    const obj = generatePublicComment()
    expect(obj).toBeDefined()
    expect(Value.Check(PublicCommentSchema, obj)).toBe(true)
  })
})

describe('generatePublicCommentRedacted', () => {
  it('returns an valid PublicCommentRedacted', () => {
    const obj = generatePublicCommentRedacted()
    expect(obj).toBeDefined()
    expect(Value.Check(PublicCommentRedactedSchema, obj)).toBe(true)
  })
})

describe('generatePublicCommentSummary', () => {
  it('should return correct totals and sentiment counts for PublicComment', () => {
    const comments: PublicComment[] = [
      { sentiment: 'supportive' } as PublicComment,
      { sentiment: 'objection' } as PublicComment,
      { sentiment: 'neutral' } as PublicComment,
      { sentiment: 'supportive' } as PublicComment
    ]
    const summary = generatePublicCommentSummary(comments)
    expect(summary.totalComments).toBe(4)
    expect(summary.sentiment.supportive).toBe(2)
    expect(summary.sentiment.objection).toBe(1)
    expect(summary.sentiment.neutral).toBe(1)
  })

  it('should return zero counts for empty array', () => {
    const comments: PublicComment[] = []
    const summary = generatePublicCommentSummary(comments)
    expect(summary.totalComments).toBe(0)
    expect(summary.sentiment.supportive).toBe(0)
    expect(summary.sentiment.objection).toBe(0)
    expect(summary.sentiment.neutral).toBe(0)
  })

  it('should work with PublicCommentRedacted', () => {
    const comments: PublicCommentRedacted[] = [
      { sentiment: 'objection' } as PublicCommentRedacted,
      { sentiment: 'objection' } as PublicCommentRedacted,
      { sentiment: 'neutral' } as PublicCommentRedacted
    ]
    const summary = generatePublicCommentSummary(comments)
    expect(summary.totalComments).toBe(3)
    expect(summary.sentiment.supportive).toBe(0)
    expect(summary.sentiment.objection).toBe(2)
    expect(summary.sentiment.neutral).toBe(1)
  })
})

describe('generatePublicComments', () => {
  it('returns an valid PublicComments', () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 10)
    const end = new Date(now)
    end.setDate(now.getDate() + 10)
    const fakeDates = {
      consultation: {
        startAt: start,
        endAt: end
      }
    }
    const obj = generatePublicComments(fakeDates as unknown as PossibleDates)
    expect(obj).toBeDefined()
    expect(Value.Check(PublicCommentsSchema, obj)).toBe(true)
  })
})

describe('generatePublicCommentsRedacted', () => {
  it('returns an valid PublicCommentsRedacted', () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 10)
    const end = new Date(now)
    end.setDate(now.getDate() + 10)
    const fakeDates = {
      consultation: {
        startAt: start,
        endAt: end
      }
    }
    const obj = generatePublicCommentsRedacted(
      fakeDates as unknown as PossibleDates
    )
    expect(obj).toBeDefined()
    expect(Value.Check(PublicCommentsRedactedSchema, obj)).toBe(true)
  })
})
