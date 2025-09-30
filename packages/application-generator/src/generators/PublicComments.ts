import { fakerEN_GB as faker } from '@faker-js/faker'
import type {
  CommentMetaData,
  PublicComments,
  PublicCommentsRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/Comment.js'
import type {
  PublicComment,
  PublicCommentRedacted,
  TopicAndComments
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/PublicComment.js'
import { generateAddress } from './Address'
import {
  generateAllPossibleDates,
  type PossibleDates
} from '../libs/generateAllPossibleDates'
import type { PublicCommentTopic } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/PublicCommentTopic.js'
import type { PublicCommentSentiment } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.js'
import type { PublicCommentSummary } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.js'

/**
 * Generates an array of topics with associated questions and comments.
 * @returns An array of topics with associated questions and comments
 */
const generateTopicAndComments = (): TopicAndComments[] => {
  const topics: PublicCommentTopic[] = [
    'design',
    'use',
    'light',
    'privacy',
    'access',
    'noise',
    'traffic',
    'other'
  ]

  const numTopics = faker.number.int({ min: 1, max: topics.length })
  const selectedTopics = faker.helpers.shuffle(topics).slice(0, numTopics)

  return selectedTopics.map((topic) => ({
    topic,
    question: `What are your comments about ${topic}?`,
    comment: faker.lorem.paragraphs({ min: 1, max: 2 })
  }))
}

/**
 *
 * @param published
 * @param dates
 * @returns
 */
const generateCommentMetadata = (dates?: PossibleDates) => {
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
  const submittedAt = faker.date.between({
    from: consultationStart,
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
    submittedAt: submittedAt.toISOString(),
    validatedAt: validatedAt.toISOString(),
    publishedAt: publishedAt.toISOString()
  }
}

/**
 *
 * @returns
 */
const generatePublicCommentFields = () => {
  return {
    id: faker.string.uuid(),
    sentiment: faker.helpers.arrayElement([
      'objection',
      'neutral',
      'supportive'
    ]) as PublicCommentSentiment,
    author: {
      name: {
        singleLine: faker.person.fullName()
      },
      address: generateAddress()
    },
    commentRedacted: faker.datatype.boolean()
      ? faker.lorem.paragraphs({ min: 1, max: 5 })
      : generateTopicAndComments()
  }
}

/**
 * Generates a public comment object.
 * @param dates - Optional dates object for the comment.
 * @returns A public comment object.
 */
const generatePublicComment = (dates?: PossibleDates): PublicComment => {
  const fields = generatePublicCommentFields()

  const { submittedAt, validatedAt, publishedAt } =
    generateCommentMetadata(dates)

  // Randomly pick state: 0=submitted, 1=validated, 2=published
  const state = faker.number.int({ min: 0, max: 2 })

  // // Build metadata according to state
  const metadata: CommentMetaData = {
    submittedAt: submittedAt
  }
  if (state >= 1) metadata.validatedAt = validatedAt
  if (state === 2) metadata.publishedAt = publishedAt

  // return metadata

  return {
    ...fields,
    comment: fields.commentRedacted,
    metadata
  }
}

/**
 * Generates a redacted public comment object.
 * @param dates - Optional dates object for the comment.
 * @returns A redacted public comment object.
 */
const generatePublicCommentRedacted = (
  dates?: PossibleDates
): PublicCommentRedacted => {
  const fields = generatePublicCommentFields()
  const { submittedAt, validatedAt, publishedAt } =
    generateCommentMetadata(dates)

  return {
    ...fields,
    metadata: {
      submittedAt,
      validatedAt,
      publishedAt
    }
  }
}

/**
 * Creates the summary of generated comments
 * @param comments
 * @returns
 */
const generatePublicCommentSummary = (
  comments: PublicComment[] | PublicCommentRedacted[]
): PublicCommentSummary => {
  return {
    totalComments: comments.length,
    sentiment: comments.reduce(
      (acc, comment) => {
        if (comment.sentiment === 'supportive') {
          acc.supportive++
        } else if (comment.sentiment === 'objection') {
          acc.objection++
        } else if (comment.sentiment === 'neutral') {
          acc.neutral++
        }
        return acc
      },
      { supportive: 0, objection: 0, neutral: 0 }
    )
  }
}

/**
 * Returns a public comments objects
 * @param dates
 * @returns
 */
export const generatePublicComments = (
  dates: PossibleDates
): PublicComments => {
  if (!dates) {
    dates = generateAllPossibleDates(true)
  }
  const count = Math.floor(Math.random() * 101) // 0 - 100
  const comments = Array.from({ length: count }, () =>
    generatePublicComment(dates)
  )
  return {
    summary: generatePublicCommentSummary(comments),
    comments
  }
}

/**
 * Returns a redacted public comment object
 * @param dates
 * @returns
 */
export const generatePublicCommentsRedacted = (
  dates: PossibleDates
): PublicCommentsRedacted => {
  if (!dates) {
    dates = generateAllPossibleDates(true)
  }
  const count = Math.floor(Math.random() * 101) // 0 - 100
  const comments = Array.from({ length: count }, () =>
    generatePublicCommentRedacted(dates)
  )
  return {
    summary: generatePublicCommentSummary(comments),
    comments
  }
}
