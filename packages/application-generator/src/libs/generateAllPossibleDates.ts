import { faker } from '@faker-js/faker'
import dayjs, { Dayjs } from 'dayjs'

export interface PossibleDates {
  application: {
    withdrawnAt: Dayjs
  }
  submission: {
    submittedAt: Dayjs
  }
  validation: {
    receivedAt: Dayjs
    validatedAt: Dayjs
  }
  publishedAt: Dayjs
  consultation: {
    startAt: Dayjs
    endAt: Dayjs
  }
  assessment: {
    expiryAt: Dayjs
    planningOfficerDecisionAt: Dayjs
    committeeSentAt: Dayjs
    committeeDecisionAt: Dayjs
  }
  appeal: {
    lodgedAt: Dayjs
    validatedAt: Dayjs
    startedAt: Dayjs
    decidedAt: Dayjs
    withdrawnAt: Dayjs
  }
  generatedAt: Dayjs
}

export const generateAllPossibleDates = (
  consultationInProgress = false
): PossibleDates => {
  let startDate = faker.date.past({
    years: 10,
    refDate: dayjs().subtract(2, 'year').toDate()
  })
  if (consultationInProgress) {
    startDate = dayjs().subtract(1, 'day').subtract(200, 'millisecond').toDate()
  }

  // an application is submitted and some point in the last 10 years
  const submittedAt = dayjs(startDate)

  // application received by back office system a few ms later because maybe theres latency
  const receivedAt = dayjs(submittedAt).add(200, 'millisecond')

  // application validated in back office system the next day
  const validatedAt = dayjs(receivedAt).add(1, 'day')

  // when its validated the reviewer sets it to be published (not always at this stage but it will be for these examples)
  const publishedAt = dayjs(validatedAt).add(200, 'millisecond')

  // consultation (depending on application type) starts once it's valid and lasts 21 days (theres more nuance around business days etc but this is accurate enough)
  // startDate - as soon as validated
  const consultationStartAt = validatedAt
  const consultationEndAt = consultationStartAt.add(21, 'day')

  // An assessment has an expiry date which is different per application type
  const expiryAt = consultationEndAt.add(1, 'month')

  // the council decision is made sometime after the consultation ends
  const planningOfficerDecisionAt = consultationEndAt.add(10, 'day')

  // if it's sent to committee it's sent after the planning officers recommendation
  const committeeSentAt = planningOfficerDecisionAt.add(1, 'day')

  // after it's sent to the committee the decision is made after that date
  const committeeDecisionAt = committeeSentAt.add(10, 'day')

  // an appeal can be lodged within 6 months of determination being made
  // lodgedDate
  const appealLodgedAt = committeeDecisionAt.add(1, 'month')

  // appeal is validated
  const appealValidatedAt = dayjs(appealLodgedAt).add(1, 'day')

  // appeal starts soon after
  const appealStartedAt = dayjs(appealValidatedAt).add(200, 'millisecond')

  // appeal decided
  const appealDecidedAt = dayjs(appealStartedAt).add(5, 'day')

  // application can be withdrawn any time between consultationStartAt and planningOfficerDecisionAt
  const withdrawnAt = dayjs(consultationStartAt).add(1, 'day')

  // appeal is withdrawn any time between appealLodgedAt and appealDecidedAt
  const appealWithdrawnAt = dayjs(appealLodgedAt).add(1, 'day')

  // when the data is generated it is given a generatedAt date,
  // if it was an API this would be the current date and time
  // but if it was a static file this would be the date the file was generated
  // in this case we are using a fixed date for consistency in tests
  const generatedAt = dayjs()

  const dates = {
    application: {
      withdrawnAt: withdrawnAt
    },
    submission: {
      submittedAt: submittedAt
    },
    validation: {
      receivedAt: receivedAt,
      validatedAt: validatedAt
    },
    publishedAt: publishedAt,
    consultation: {
      startAt: consultationStartAt,
      endAt: consultationEndAt
    },
    assessment: {
      expiryAt: expiryAt,
      planningOfficerDecisionAt: planningOfficerDecisionAt,
      committeeSentAt: committeeSentAt,
      committeeDecisionAt: committeeDecisionAt
    },
    appeal: {
      lodgedAt: appealLodgedAt,
      validatedAt: appealValidatedAt,
      startedAt: appealStartedAt,
      decidedAt: appealDecidedAt,
      withdrawnAt: appealWithdrawnAt
    },
    generatedAt: generatedAt
  }

  return dates
}
