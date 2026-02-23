import { Value } from '@sinclair/typebox/value'
import {
  PublicCommentRedactedSchema,
  type PublicCommentRedacted
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'

export const convertBopsCommentToPublicCommentRedacted = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comment: any
): PublicCommentRedacted => {
  if (Value.Check(PublicCommentRedactedSchema, comment)) {
    return comment
  }

  const object: PublicCommentRedacted = {
    id: String(comment.id),
    sentiment: comment.sentiment,
    author: {
      name: {
        singleLine: comment?.author?.name?.singleLine ?? 'Not disclosed'
      }
    },
    commentRedacted: comment.comment,
    metadata: {
      submittedAt: comment.receivedAt,
      validatedAt: comment.receivedAt,
      publishedAt: comment.receivedAt
    }
  }

  if (Value.Check(PublicCommentRedactedSchema, object)) {
    return object
  }

  throw new Error('Unable to convert public comment')
}
