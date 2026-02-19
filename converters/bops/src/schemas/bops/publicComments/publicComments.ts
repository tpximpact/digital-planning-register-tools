import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { PaginationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { PublicCommentSummarySchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { PublicCommentSentimentSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'
import { PublicCommentTopicSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/PublicCommentTopic.ts'

export const BopsPublicCommentSchema = Type.Object({
  id: Type.Number(),
  sentiment: PublicCommentSentimentSchema,
  comment: Type.String(),
  receivedAt: Type.String({ format: 'date-time' })
})
export type BopsPublicComment = Static<typeof BopsPublicCommentSchema>

export const BopsPublicCommentsEndpointSchema = Type.Object({
  pagination: PaginationSchema,
  summary: PublicCommentSummarySchema,
  comments: Type.Array(BopsPublicCommentSchema)
})
export type BopsPublicCommentsEndpoint = Static<
  typeof BopsPublicCommentsEndpointSchema
>

export const BopsPostCommentSchema = Type.Object({
  name: Type.String(),
  address: Type.Optional(Type.String()),
  response: Type.String(),
  summary_tag: PublicCommentSentimentSchema,
  tags: Type.Optional(Type.Array(PublicCommentTopicSchema))
})
export type BopsPostComment = Static<typeof BopsPostCommentSchema>
