import { describe, it, expect } from 'bun:test'
import {
  generatePostSubmissionFileDates,
  generatePostSubmissionFiles,
  generatePostSubmissionFilesRedacted,
  generatePostSubmissionFileRedacted,
  generatePostSubmissionFile
} from './PostSubmissionFile'
import type { PossibleDates } from '../libs/generateAllPossibleDates'
import { PostSubmissionFileRedactedChecker } from '@dpr/libs'
import {
  assertSchema,
  PostSubmissionFileChecker,
  PostSubmissionFileArrayChecker,
  PostSubmissionFileRedactedArrayChecker
} from '@dpr/test-libs'

describe('generatePostSubmissionFileDates', () => {
  it('returns an valid set of dates', () => {
    const obj = generatePostSubmissionFileDates()
    expect(obj).toBeDefined()
  })
  it('should return all date fields as Date objects', () => {
    const dates = generatePostSubmissionFileDates()
    expect(dates).toHaveProperty('createdAtDate')
    expect(dates).toHaveProperty('submittedAtDate')
    expect(dates).toHaveProperty('validatedAtDate')
    expect(dates).toHaveProperty('publishedAtDate')
    expect(dates.createdAtDate instanceof Date).toBe(true)
    expect(dates.submittedAtDate instanceof Date).toBe(true)
    expect(dates.validatedAtDate instanceof Date).toBe(true)
    expect(dates.publishedAtDate instanceof Date).toBe(true)
  })

  it('should return dates in chronological order', () => {
    const { createdAtDate, submittedAtDate, validatedAtDate, publishedAtDate } =
      generatePostSubmissionFileDates()
    expect(createdAtDate.getTime()).toBeLessThanOrEqual(
      submittedAtDate.getTime()
    )
    expect(submittedAtDate.getTime()).toBeLessThanOrEqual(
      validatedAtDate.getTime()
    )
    expect(validatedAtDate.getTime()).toBeLessThanOrEqual(
      publishedAtDate.getTime()
    )
  })

  it('should respect provided PossibleDates', () => {
    const now = new Date()
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(now.getMonth() - 6)
    const fakeDates = {
      submission: { submittedAt: { toDate: () => sixMonthsAgo } },
      appeal: { decidedAt: { toDate: () => now } }
    }
    const { createdAtDate, publishedAtDate } = generatePostSubmissionFileDates(
      fakeDates as PossibleDates
    )
    expect(createdAtDate.getTime()).toBeGreaterThanOrEqual(
      sixMonthsAgo.getTime()
    )
    expect(publishedAtDate.getTime()).toBeLessThanOrEqual(now.getTime())
  })
})
describe('generatePostSubmissionFiles', () => {
  it('returns an valid PostSubmissionFile[]', () => {
    const obj = generatePostSubmissionFiles()
    expect(obj).toBeDefined()
    assertSchema(PostSubmissionFileArrayChecker, obj)
  })
})
describe('generatePostSubmissionFilesRedacted', () => {
  it('returns an valid PostSubmissionFileRedacted[]', () => {
    const obj = generatePostSubmissionFilesRedacted()
    expect(obj).toBeDefined()
    assertSchema(PostSubmissionFileRedactedArrayChecker, obj)
  })
})
describe('generatePostSubmissionFileRedacted', () => {
  it('returns an valid PostSubmissionFileRedacted', () => {
    const obj = generatePostSubmissionFileRedacted()
    expect(obj).toBeDefined()
    assertSchema(PostSubmissionFileRedactedChecker, obj)
  })
})
describe('generatePostSubmissionFile', () => {
  it('returns an valid PostSubmissionFile', () => {
    const obj = generatePostSubmissionFile()
    expect(obj).toBeDefined()
    assertSchema(PostSubmissionFileChecker, obj)
  })
})
