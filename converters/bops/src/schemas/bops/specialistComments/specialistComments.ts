import { Type, type Static } from '@sinclair/typebox'
import { PaginationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { SpecialistCommentSummarySchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { SpecialistCommentSentimentSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'
import '@dpr/odp-schemas/types/shared/formats'

export const BopsSpecialistCommentSchema = Type.Object({
  id: Type.Number(),
  sentiment: SpecialistCommentSentimentSchema,
  comment: Type.String(),
  receivedAt: Type.String({ format: 'date-time' })
})
export type BopsSpecialistComment = Static<typeof BopsSpecialistCommentSchema>

export const BopsSpecialistCommentsEndpointSchema = Type.Object({
  pagination: PaginationSchema,
  summary: SpecialistCommentSummarySchema,
  comments: Type.Array(BopsSpecialistCommentSchema)
})
export type BopsSpecialistCommentsEndpoint = Static<
  typeof BopsSpecialistCommentsEndpointSchema
>
