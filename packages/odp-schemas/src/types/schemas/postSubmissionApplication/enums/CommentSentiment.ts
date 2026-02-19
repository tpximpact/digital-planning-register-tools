import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type Objection = Static<typeof ObjectionSchema>
export const ObjectionSchema = Type.Literal('objection', {
  description: 'Objection comment'
})

export type Neutral = Static<typeof NeutralSchema>
export const NeutralSchema = Type.Literal('neutral', {
  description: 'Neutral comment'
})

export type Supportive = Static<typeof SupportiveSchema>
export const SupportiveSchema = Type.Literal('supportive', {
  description: 'Supportive comment'
})

export type PublicCommentSentiment = Static<typeof PublicCommentSentimentSchema>
export const PublicCommentSentimentSchema = Type.Union(
  [ObjectionSchema, NeutralSchema, SupportiveSchema],
  {
    id: '#PublicCommentSentiment',
    description: 'Types of comments'
  }
)

export type Approved = Static<typeof ApprovedSchema>
export const ApprovedSchema = Type.Literal('approved', {
  description: 'Approved'
})

export type AmendmentsNeeded = Static<typeof AmendmentsNeededSchema>
export const AmendmentsNeededSchema = Type.Literal('amendmentsNeeded', {
  description: 'Amendments needed'
})

export type Objected = Static<typeof ObjectedSchema>
export const ObjectedSchema = Type.Literal('objected', {
  description: 'Objected'
})

export type SpecialistCommentSentiment = Static<
  typeof SpecialistCommentSentimentSchema
>
export const SpecialistCommentSentimentSchema = Type.Union(
  [ApprovedSchema, AmendmentsNeededSchema, ObjectedSchema],
  {
    id: '#SpecialistCommentSentiment',
    description: 'Types of comments'
  }
)
