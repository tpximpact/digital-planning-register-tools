import { Type, type Static } from '@sinclair/typebox'

const SpecialistCommentsOrderByBaseSchema = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionSpecialistCommentsOrderBySchema =
  SpecialistCommentsOrderByBaseSchema
export type PostSubmissionSpecialistCommentsOrderBy = Static<
  typeof PostSubmissionSpecialistCommentsOrderBySchema
>

export const PostSubmissionPublishedSpecialistCommentsOrderBySchema =
  SpecialistCommentsOrderByBaseSchema
export type PostSubmissionPublishedSpecialistCommentsOrderBy = Static<
  typeof PostSubmissionPublishedSpecialistCommentsOrderBySchema
>
