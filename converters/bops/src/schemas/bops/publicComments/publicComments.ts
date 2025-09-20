import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { PublicCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { PublicCommentSentiment } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'
import { PublicCommentTopic } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/PublicCommentTopic.ts'

export const BopsPublicComment = Type.Object({
  id: Type.Number(),
  sentiment: PublicCommentSentiment,
  comment: Type.String(),
  receivedAt: Type.String({ format: 'date-time' })
})
export type BopsPublicComment = Static<typeof BopsPublicComment>

export const BopsPublicCommentsEndpoint = Type.Object({
  pagination: Pagination,
  summary: PublicCommentSummary,
  comments: Type.Array(BopsPublicComment)
})
export type BopsPublicCommentsEndpoint = Static<
  typeof BopsPublicCommentsEndpoint
>

export const BopsPostComment = Type.Object({
  name: Type.String(),
  address: Type.Optional(Type.String()),
  response: Type.String(),
  summary_tag: PublicCommentSentiment,
  tags: Type.Optional(Type.Array(PublicCommentTopic))
})
export type BopsPostComment = Static<typeof BopsPostComment>
