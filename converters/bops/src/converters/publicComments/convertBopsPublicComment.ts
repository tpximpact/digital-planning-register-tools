import { convertDateTimeToUtc } from '../../utils/formatDates'
import { Value } from '@sinclair/typebox/value'
import type { BopsPublicComment } from '../../schemas/bops/publicComments'
import {
  PublicCommentRedacted as PublicCommentRedactedSchema,
  type PublicCommentRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'

export const convertBopsPublicComment = (
  comment: BopsPublicComment
): PublicCommentRedacted | undefined => {
  const publicCommentRedacted: PublicCommentRedacted = {
    id: `${comment.id}`,
    sentiment: comment.sentiment,
    commentRedacted: comment.comment,
    metadata: {
      submittedAt: convertDateTimeToUtc(comment.receivedAt),
      validatedAt: convertDateTimeToUtc(comment.receivedAt),
      publishedAt: convertDateTimeToUtc(comment.receivedAt)
    }
  }

  if (!Value.Check(PublicCommentRedactedSchema, publicCommentRedacted)) {
    return undefined
  }

  return publicCommentRedacted
}
