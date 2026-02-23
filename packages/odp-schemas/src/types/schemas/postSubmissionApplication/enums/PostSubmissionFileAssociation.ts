import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type application = Static<typeof applicationSchema>
export const applicationSchema = Type.Literal('application')

export type appeal = Static<typeof appealSchema>
export const appealSchema = Type.Literal('appeal')

export type specialistComment = Static<typeof specialistCommentSchema>
export const specialistCommentSchema = Type.Literal('specialistComment')

export type publicComment = Static<typeof publicCommentSchema>
export const publicCommentSchema = Type.Literal('publicComment')

export type PostSubmissionFileAssociation = Static<
  typeof PostSubmissionFileAssociationSchema
>
export const PostSubmissionFileAssociationSchema = Type.Union(
  [
    applicationSchema,
    appealSchema,
    specialistCommentSchema,
    publicCommentSchema
  ],
  {
    id: '#PostSubmissionFileAssociation',
    description: 'Type of file association for a post'
  }
)
