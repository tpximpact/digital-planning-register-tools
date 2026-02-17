import { Type, type Static } from '@sinclair/typebox'

const PublicCommentsOrderByBaseSchema = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionPublicCommentsOrderBySchema =
  PublicCommentsOrderByBaseSchema
export type PostSubmissionPublicCommentsOrderBy = Static<
  typeof PostSubmissionPublicCommentsOrderBySchema
>

export const PostSubmissionPublishedPublicCommentsOrderBySchema =
  PublicCommentsOrderByBaseSchema
export type PostSubmissionPublishedPublicCommentsOrderBy = Static<
  typeof PostSubmissionPublishedPublicCommentsOrderBySchema
>
