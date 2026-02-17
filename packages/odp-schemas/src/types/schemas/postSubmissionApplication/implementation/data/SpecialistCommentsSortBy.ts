import { Type, type Static } from '@sinclair/typebox'

const SpecialistCommentsSortByBaseSchema = Type.Union([
  Type.Literal('publishedAt')
])

export const PostSubmissionSpecialistCommentsSortBySchema =
  SpecialistCommentsSortByBaseSchema
export type PostSubmissionSpecialistCommentsSortBy = Static<
  typeof PostSubmissionSpecialistCommentsSortBySchema
>

export const PostSubmissionPublishedSpecialistCommentsSortBySchema =
  SpecialistCommentsSortByBaseSchema
export type PostSubmissionPublishedSpecialistCommentsSortBy = Static<
  typeof PostSubmissionPublishedSpecialistCommentsSortBySchema
>
