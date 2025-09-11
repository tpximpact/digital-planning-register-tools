import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { PublicCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { CommentSentiment } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'

export const BopsPublicCommentsEndpoint = Type.Object({
  pagination: Pagination,
  summary: PublicCommentSummary,
  comments: Type.Array(
    Type.Object({
      id: Type.Number(),
      sentiment: CommentSentiment,
      comment: Type.String(),
      receivedAt: Type.String({ format: 'date-time' })
    })
  )
})
export type BopsPublicCommentsEndpoint = Static<
  typeof BopsPublicCommentsEndpoint
>
