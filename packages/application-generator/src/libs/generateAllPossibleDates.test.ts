import { describe, expect, it } from 'bun:test'
import { generateAllPossibleDates } from './generateAllPossibleDates'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)

describe('generateAllPossibleDates', () => {
  it('generates dates with consultationInProgress set to false', () => {
    const dates = generateAllPossibleDates(false)

    // Validate submission dates
    expect(dates.submission.submittedAt.isValid()).toBe(true)

    // Validate validation dates
    expect(
      dates.validation.receivedAt.isAfter(dates.submission.submittedAt)
    ).toBe(true)
    expect(
      dates.validation.validatedAt.isAfter(dates.validation.receivedAt)
    ).toBe(true)

    // Validate publishedAt
    expect(dates.publishedAt.isAfter(dates.validation.validatedAt)).toBe(true)

    // Validate consultation dates
    expect(
      dates.consultation.startAt.isSame(dates.validation.validatedAt)
    ).toBe(true)
    expect(dates.consultation.endAt.isAfter(dates.consultation.startAt)).toBe(
      true
    )

    // Validate assessment dates
    expect(dates.assessment.expiryAt.isAfter(dates.consultation.endAt)).toBe(
      true
    )
    expect(
      dates.assessment.planningOfficerDecisionAt.isAfter(
        dates.consultation.endAt
      )
    ).toBe(true)
    expect(
      dates.assessment.committeeSentAt.isAfter(
        dates.assessment.planningOfficerDecisionAt
      )
    ).toBe(true)
    expect(
      dates.assessment.committeeDecisionAt.isAfter(
        dates.assessment.committeeSentAt
      )
    ).toBe(true)

    // Validate appeal dates
    expect(
      dates.appeal.lodgedAt.isAfter(dates.assessment.committeeDecisionAt)
    ).toBe(true)
    expect(dates.appeal.validatedAt.isAfter(dates.appeal.lodgedAt)).toBe(true)
    expect(dates.appeal.startedAt.isAfter(dates.appeal.validatedAt)).toBe(true)
    expect(dates.appeal.decidedAt.isAfter(dates.appeal.startedAt)).toBe(true)
    expect(dates.appeal.withdrawnAt.isAfter(dates.appeal.lodgedAt)).toBe(true)

    // Validate application withdrawal date
    expect(
      dates.application.withdrawnAt.isAfter(dates.consultation.startAt)
    ).toBe(true)
    expect(
      dates.application.withdrawnAt.isBefore(
        dates.assessment.planningOfficerDecisionAt
      )
    ).toBe(true)
  })

  it('generates dates with consultationInProgress set to true', () => {
    const dates = generateAllPossibleDates(true)

    // Validate consultation start date is close to now
    const now = dayjs()
    expect(dates.consultation.startAt.isSameOrBefore(now)).toBe(true)
    expect(dates.consultation.startAt.isAfter(now.subtract(2, 'day'))).toBe(
      true
    )

    // Validate consultation end date
    expect(dates.consultation.endAt.isAfter(dates.consultation.startAt)).toBe(
      true
    )

    // Validate other dates follow the same logic as when consultationInProgress is false
    expect(dates.assessment.expiryAt.isAfter(dates.consultation.endAt)).toBe(
      true
    )
    expect(
      dates.assessment.planningOfficerDecisionAt.isAfter(
        dates.consultation.endAt
      )
    ).toBe(true)
    expect(
      dates.assessment.committeeSentAt.isAfter(
        dates.assessment.planningOfficerDecisionAt
      )
    ).toBe(true)
    expect(
      dates.assessment.committeeDecisionAt.isAfter(
        dates.assessment.committeeSentAt
      )
    ).toBe(true)
  })

  it('ensures appeal dates are sequential', () => {
    const dates = generateAllPossibleDates()

    expect(
      dates.appeal.lodgedAt.isAfter(dates.assessment.committeeDecisionAt)
    ).toBe(true)
    expect(dates.appeal.validatedAt.isAfter(dates.appeal.lodgedAt)).toBe(true)
    expect(dates.appeal.startedAt.isAfter(dates.appeal.validatedAt)).toBe(true)
    expect(dates.appeal.decidedAt.isAfter(dates.appeal.startedAt)).toBe(true)
    expect(dates.appeal.withdrawnAt.isAfter(dates.appeal.lodgedAt)).toBe(true)
  })

  it('ensures application withdrawal date is valid', () => {
    const dates = generateAllPossibleDates()

    expect(
      dates.application.withdrawnAt.isAfter(dates.consultation.startAt)
    ).toBe(true)
    expect(
      dates.application.withdrawnAt.isBefore(
        dates.assessment.planningOfficerDecisionAt
      )
    ).toBe(true)
  })
})
