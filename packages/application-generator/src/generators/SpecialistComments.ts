import { fakerEN_GB as faker } from '@faker-js/faker'
import type {
  SpecialistComments,
  SpecialistCommentsRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/Comment.js'
import type { CommentMetaData } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/CommentMetaData.js'
import {
  generateAllPossibleDates,
  type PossibleDates
} from '../libs/generateAllPossibleDates'
import type {
  Specialist,
  SpecialistComment,
  SpecialistCommentRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.js'
import { generatePostSubmissionFile } from './PostSubmissionFile'
import { generateAddress } from './Address'

/**
 * Generates realistic dates for a specialist comment lifecycle
 * @param dates - optional dates object to base generated dates on
 * @returns dates in correct order
 */
export const specialistCommentDates = (
  dates?: PossibleDates
): {
  firstConsultedAt: Date
  submittedAt: Date
  validatedAt: Date
  publishedAt: Date
} => {
  const consultationStart =
    dates?.consultation.startAt.toISOString() ?? faker.date.past()

  // If no dates object, set consultationEnd to 21 days after consultationStart
  let consultationEnd: string
  if (dates?.consultation.endAt) {
    consultationEnd = dates.consultation.endAt.toISOString()
  } else {
    const startDate = new Date(consultationStart)
    startDate.setDate(startDate.getDate() + 21)
    consultationEnd = startDate.toISOString()
  }

  // Generate dates in order
  const firstConsultedAt = faker.date.between({
    from: consultationStart,
    to: consultationEnd
  })

  const submittedAt = faker.date.between({
    from: firstConsultedAt,
    to: consultationEnd
  })

  const validatedAt = faker.date.between({
    from: submittedAt,
    to: consultationEnd
  })

  const publishedAt = faker.date.between({
    from: validatedAt,
    to: consultationEnd
  })

  return {
    firstConsultedAt: firstConsultedAt,
    submittedAt: submittedAt,
    validatedAt: validatedAt,
    publishedAt: publishedAt
  }
}

// Helper to get the latest comment by date from a Specialist's comments array
export const getLatestComment = (
  comments: SpecialistComment[]
): SpecialistComment | undefined => {
  if (!comments || comments.length === 0) return undefined
  return comments.reduce((latest, current) => {
    const latestDate = new Date(
      latest.metadata.publishedAt ??
        latest.metadata.validatedAt ??
        latest.metadata.submittedAt
    )
    const currentDate = new Date(
      current.metadata.publishedAt ??
        current.metadata.validatedAt ??
        current.metadata.submittedAt
    )
    return currentDate > latestDate ? current : latest
  })
}

/**
 * Returns a public comments objects
 * @param dates
 * @returns
 */
export const generateSpecialistComments = (
  dates?: PossibleDates
): SpecialistComments => {
  if (!dates) {
    dates = generateAllPossibleDates(true)
  }

  // create a random number of specialists between 0 and 50
  const specialists: Specialist[] = Array.from(
    { length: Math.floor(Math.random() * 51) },
    () => {
      const { firstConsultedAt } = specialistCommentDates(dates)

      // randomly decide if this specialist has been consulted
      const consulted = faker.datatype.boolean()

      return {
        id: faker.string.uuid(),
        name: { singleLine: faker.person.fullName() },
        address: generateAddress(),
        organisationSpecialism: faker.datatype.boolean()
          ? faker.company.name()
          : undefined,
        jobTitle: faker.datatype.boolean()
          ? faker.person.jobTitle()
          : undefined,
        reason: 'other',
        firstConsultedAt: consulted ? firstConsultedAt.toISOString() : undefined
      }
    }
  )

  const specialistComments = specialists.map((specialist) => {
    // randomly decide if this specialist has made comments
    const madeComments = specialist.firstConsultedAt
      ? faker.datatype.boolean()
      : false

    let comments: SpecialistComment[] = []
    if (madeComments) {
      comments = Array.from({ length: Math.floor(Math.random() * 11) }, () => {
        const { submittedAt, validatedAt, publishedAt } =
          specialistCommentDates(dates)

        // Randomly pick state: 0=submitted, 1=validated, 2=published
        const state = faker.number.int({ min: 0, max: 2 })

        // Build metadata according to state
        const metadata: CommentMetaData = {
          submittedAt: submittedAt.toISOString()
        }
        if (state >= 1) metadata.validatedAt = validatedAt.toISOString()
        if (state === 2) metadata.publishedAt = publishedAt.toISOString()

        return {
          id: faker.string.uuid(),
          sentiment: faker.helpers.arrayElement([
            'approved',
            'amendmentsNeeded',
            'objected'
          ]),
          comment: faker.lorem.paragraphs({ min: 1, max: 10 }),
          commentRedacted:
            state > 1 ? faker.lorem.paragraphs({ min: 1, max: 10 }) : undefined,
          files: faker.datatype.boolean()
            ? Array.from({ length: Math.floor(Math.random() * 11) }, () =>
                generatePostSubmissionFile('specialistComment', dates)
              )
            : undefined,
          metadata
        }
      })
    }

    return {
      ...specialist,
      comments
    }
  })

  // Cumulatively add up sentiment values from the latest comment of each specialist
  const sentimentTotals = specialistComments.reduce(
    (acc, specialist) => {
      if (specialist.comments) {
        const latestComment = getLatestComment(specialist.comments)
        if (latestComment) {
          if (latestComment.sentiment === 'approved') acc.approved++
          else if (latestComment.sentiment === 'amendmentsNeeded')
            acc.amendmentsNeeded++
          else if (latestComment.sentiment === 'objected') acc.objected++
        }
      }
      return acc
    },
    { approved: 0, amendmentsNeeded: 0, objected: 0 }
  )

  return {
    summary: {
      totalComments: specialistComments.length,
      totalConsulted: specialistComments.filter((s) => s.firstConsultedAt)
        .length,
      sentiment: sentimentTotals
    },
    comments: specialistComments
  }
}

/**
 * Returns a list of published specialist comments
 * @param comments
 * @returns
 */
export const getPublishedSpecialistComments = (
  comments: SpecialistComment[]
): SpecialistCommentRedacted[] => {
  if (!comments || comments.length === 0) return []

  const publishedComments = comments
    .map((comment) => comment)
    .filter(
      (comment) =>
        comment.metadata.submittedAt &&
        comment.metadata.validatedAt &&
        comment.metadata.publishedAt
    )
    .filter(
      (comment) =>
        typeof comment.commentRedacted === 'string' && comment.commentRedacted
    )

  const redactedComments: SpecialistCommentRedacted[] = []

  publishedComments.map(({ comment, ...rest }) => {
    redactedComments.push({
      ...rest,
      commentRedacted: rest.commentRedacted ?? '',
      metadata: {
        ...rest.metadata,
        validatedAt: rest.metadata.validatedAt ?? new Date().toISOString(),
        submittedAt: rest.metadata.submittedAt ?? new Date().toISOString(),
        publishedAt: rest.metadata.publishedAt ?? new Date().toISOString()
      }
    })
  })

  return redactedComments
}

/**
 * Returns a redacted public comment object
 * @param dates
 * @returns
 */
export const generateSpecialistCommentsRedacted = (
  dates?: PossibleDates
): SpecialistCommentsRedacted => {
  if (!dates) {
    dates = generateAllPossibleDates(true)
  }
  const specialistComments = generateSpecialistComments(dates)
  return {
    ...specialistComments,
    comments: specialistComments.comments.map((specialist) => {
      const specialistCommentsRedacted: SpecialistCommentRedacted[] =
        getPublishedSpecialistComments(specialist.comments ?? [])

      return {
        ...specialist,
        comments: specialistCommentsRedacted
      }
    })
  }
}
