import { convertDateTimeToUtc } from '../../utils/formatDates'
import { Value } from '@sinclair/typebox/value'
import {
  type SpecialistCommentRedacted,
  SpecialistCommentRedacted as SpecialistCommentRedactedSchema,
  SpecialistRedacted as SpecialistRedactedSchema,
  type SpecialistRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'
import { convertBopsFileToPostSubmissionFileRedacted } from '../documents'
import type { PostSubmissionFileRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'

export const convertBopsSpecialistCommentToSpecialistCommentRedacted = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comment: any
): SpecialistCommentRedacted => {
  if (Value.Check(SpecialistCommentRedactedSchema, comment)) {
    return comment
  }

  const convertedFiles: PostSubmissionFileRedacted[] = (comment.files ?? [])
    .map((file: unknown): PostSubmissionFileRedacted | undefined => {
      try {
        return convertBopsFileToPostSubmissionFileRedacted(
          file,
          'specialistComment'
        )
      } catch (error) {
        console.warn(
          'Error converting specialists comment files but its taken care of elsewhere:',
          error
        )
        return undefined
      }
    })
    .filter(
      (
        file: PostSubmissionFileRedacted | undefined
      ): file is PostSubmissionFileRedacted => file !== undefined
    )

  const object = {
    id: String(comment.id),
    sentiment: comment.sentiment,
    files: convertedFiles,
    commentRedacted: comment.commentRedacted,
    metadata: {
      submittedAt: comment.metadata.submittedAt,
      validatedAt: comment.metadata.submittedAt,
      publishedAt: comment.metadata.publishedAt
    }
  }

  if (Value.Check(SpecialistCommentRedactedSchema, object)) {
    return object
  }

  throw new Error('Unable to convert specialist comment')
}

export const convertBopsSpecialistToSpecialistRedacted = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specialist: any
): SpecialistRedacted => {
  if (Value.Check(SpecialistRedactedSchema, specialist)) {
    return specialist
  }

  const comments = specialist.comments ?? undefined

  if (!comments) {
    throw new Error('Specialist has no comments')
  }

  // Convert and filter comments

  const convertedComments: SpecialistCommentRedacted[] = (comments ?? [])
    .map((comment: unknown): SpecialistCommentRedacted | undefined => {
      try {
        return convertBopsSpecialistCommentToSpecialistCommentRedacted(comment)
      } catch (error) {
        console.warn(
          'Error converting specialists comment but its taken care of elsewhere:',
          error
        )
        return undefined
      }
    })
    .filter(
      (
        specialist: SpecialistCommentRedacted | undefined
      ): specialist is SpecialistCommentRedacted => specialist !== undefined
    )

  const obj = {
    id: specialist.id,
    name: {
      singleLine: specialist?.name?.singleLine ?? 'Not disclosed'
    },
    organisationSpecialism: specialist.organisationSpecialism,
    jobTitle: specialist.jobTitle,
    reason: specialist.reason,
    constraints: specialist.constraints,
    firstConsultedAt: convertDateTimeToUtc(specialist.firstConsultedAt),
    comments: convertedComments
  }

  if (Value.Check(SpecialistRedactedSchema, obj)) {
    return obj
  }

  throw new Error('Unable to convert specialist')
}
