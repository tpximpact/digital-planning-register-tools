import { describe, it, expect } from 'bun:test'
import dayjs from 'dayjs'
import {
  specialistCommentDates,
  getLatestComment,
  generateSpecialistComments,
  getPublishedSpecialistComments,
  generateSpecialistCommentsRedacted
} from './SpecialistComments'
import type { SpecialistComment } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.js'
import type { PossibleDates } from '../libs/generateAllPossibleDates'

describe('specialistCommentDates', () => {
  it('returns ISO date strings in correct order', () => {
    const dates = specialistCommentDates()
    expect(dates.firstConsultedAt).toBeDate()
    expect(dates.submittedAt).toBeDate()
    expect(dates.validatedAt).toBeDate()
    expect(dates.publishedAt).toBeDate()

    expect(dates.firstConsultedAt <= dates.submittedAt).toBe(true)
    expect(dates.submittedAt <= dates.validatedAt).toBe(true)
    expect(dates.validatedAt <= dates.publishedAt).toBe(true)
  })

  it('returns ISO date strings in correct order when given dates', () => {
    const startDate = dayjs('2025-01-01')
    const possibleDates = {
      consultation: {
        startAt: startDate,
        endAt: startDate.add(21, 'day')
      }
    } as unknown as PossibleDates
    const dates = specialistCommentDates(possibleDates)
    expect(dates.firstConsultedAt).toBeDate()
    expect(dates.submittedAt).toBeDate()
    expect(dates.validatedAt).toBeDate()
    expect(dates.publishedAt).toBeDate()

    // between start and end date
    expect(
      dates.firstConsultedAt >= possibleDates.consultation.startAt.toDate() &&
        dates.firstConsultedAt <= possibleDates.consultation.endAt.toDate()
    ).toBe(true)
    expect(
      dates.submittedAt >= possibleDates.consultation.startAt.toDate() &&
        dates.submittedAt <= possibleDates.consultation.endAt.toDate()
    ).toBe(true)
    expect(
      dates.validatedAt >= possibleDates.consultation.startAt.toDate() &&
        dates.validatedAt <= possibleDates.consultation.endAt.toDate()
    ).toBe(true)
    expect(
      dates.publishedAt >= possibleDates.consultation.startAt.toDate() &&
        dates.publishedAt <= possibleDates.consultation.endAt.toDate()
    ).toBe(true)

    expect(dates.firstConsultedAt <= dates.submittedAt).toBe(true)
    expect(dates.submittedAt <= dates.validatedAt).toBe(true)
    expect(dates.validatedAt <= dates.publishedAt).toBe(true)
  })
})

describe('getLatestComment', () => {
  it('returns undefined for empty array', () => {
    expect(getLatestComment([])).toBeUndefined()
  })

  it('returns the comment with the latest date', () => {
    const comments: SpecialistComment[] = [
      {
        id: '1',
        sentiment: 'approved',
        comment: 'A',
        commentRedacted: 'A',
        files: [],
        metadata: { submittedAt: '2024-01-01T00:00:00.000Z' }
      },
      {
        id: '2',
        sentiment: 'objected',
        comment: 'B',
        commentRedacted: 'B',
        files: [],
        metadata: {
          submittedAt: '2024-02-01T00:00:00.000Z',
          publishedAt: '2024-03-01T00:00:00.000Z'
        }
      }
    ]
    expect(getLatestComment(comments)?.id).toBe('2')
  })
})

describe('generateSpecialistComments', () => {
  it('returns a SpecialistComments object with summary and comments', () => {
    const result = generateSpecialistComments()
    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('comments')
    expect(Array.isArray(result.comments)).toBe(true)
  })
})

describe('getPublishedSpecialistComments', () => {
  it('returns only published and redacted comments', () => {
    const comments: SpecialistComment[] = [
      {
        id: '1',
        sentiment: 'approved',
        comment: 'A',
        commentRedacted: 'A',
        files: [],
        metadata: {
          submittedAt: '2024-01-01T00:00:00.000Z',
          validatedAt: '2024-01-02T00:00:00.000Z',
          publishedAt: '2024-01-03T00:00:00.000Z'
        }
      },
      {
        id: '2',
        sentiment: 'objected',
        comment: 'B',
        files: [],
        metadata: {
          submittedAt: '2024-01-01T00:00:00.000Z',
          validatedAt: '2024-01-02T00:00:00.000Z'
          // publishedAt missing
        }
      }
    ]

    const result = getPublishedSpecialistComments(comments)

    expect(Array.isArray(result)).toBe(true)
    result.forEach((comment) => {
      expect(typeof comment.commentRedacted).toBe('string')
      expect(typeof comment.metadata.publishedAt).toBe('string')
      expect(typeof comment.metadata.validatedAt).toBe('string')
    })
  })
})

describe('generateSpecialistCommentsRedacted', () => {
  it('returns a SpecialistCommentsRedacted object with redacted comments', () => {
    const result = generateSpecialistCommentsRedacted()
    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('comments')
    expect(Array.isArray(result.comments)).toBe(true)
  })
})
