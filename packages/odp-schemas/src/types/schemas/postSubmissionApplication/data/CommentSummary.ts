import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import {
  PublicCommentSentimentSchema,
  SpecialistCommentSentimentSchema
} from '../enums/CommentSentiment'

// type CommentSummaryBase = Static<typeof CommentSummaryBaseSchema>
const CommentSummaryBaseSchema = Type.Object({
  totalComments: Type.Number()
})

export type PublicCommentSummary = Static<typeof PublicCommentSummarySchema>
export const PublicCommentSummarySchema = Type.Composite(
  [
    CommentSummaryBaseSchema,
    Type.Object({
      sentiment: Type.Record(PublicCommentSentimentSchema, Type.Number())
    })
  ],
  { id: '#PublicCommentsSummary' }
)

export type SpecialistCommentSummary = Static<
  typeof SpecialistCommentSummarySchema
>
export const SpecialistCommentSummarySchema = Type.Composite(
  [
    CommentSummaryBaseSchema,
    Type.Object({
      totalConsulted: Type.Number(),
      sentiment: Type.Record(SpecialistCommentSentimentSchema, Type.Number())
    })
  ],
  { id: '#SpecialistCommentsSummary' }
)
