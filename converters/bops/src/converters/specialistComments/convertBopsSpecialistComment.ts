import { convertDateTimeToUtc } from '../../utils/formatDates'
import { Value } from '@sinclair/typebox/value'
import type { BopsSpecialistComment } from '../../schemas/bops/specialistComments'
import {
  SpecialistRedacted as SpecialistRedactedSchema,
  type SpecialistRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'

export const convertBopsSpecialistComment = (
  comment: BopsSpecialistComment
): SpecialistRedacted | undefined => {
  const specialistRedacted: SpecialistRedacted = {
    id: `${comment.id}`,
    firstConsultedAt: convertDateTimeToUtc(comment.receivedAt),
    comments: [
      {
        id: `${comment.id}`,
        commentRedacted: comment.comment,
        sentiment: comment.sentiment,
        metadata: {
          submittedAt: convertDateTimeToUtc(comment.receivedAt),
          validatedAt: convertDateTimeToUtc(comment.receivedAt),
          publishedAt: convertDateTimeToUtc(comment.receivedAt)
        }
      }
    ]
  }

  if (!Value.Check(SpecialistRedactedSchema, specialistRedacted)) {
    return undefined
  }

  return specialistRedacted
}
