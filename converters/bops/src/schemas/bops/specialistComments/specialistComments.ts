import { Type, type Static } from '@sinclair/typebox'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { SpecialistCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { SpecialistCommentSentiment } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'
import '@dpr/odp-schemas/types/shared/formats'

export const BopsSpecialistComment = Type.Object({
  id: Type.Number(),
  sentiment: SpecialistCommentSentiment,
  comment: Type.String(),
  receivedAt: Type.String({ format: 'date-time' })
})
export type BopsSpecialistComment = Static<typeof BopsSpecialistComment>

export const BopsSpecialistCommentsEndpoint = Type.Object({
  pagination: Pagination,
  summary: SpecialistCommentSummary,
  comments: Type.Array(BopsSpecialistComment)
})
export type BopsSpecialistCommentsEndpoint = Static<
  typeof BopsSpecialistCommentsEndpoint
>
