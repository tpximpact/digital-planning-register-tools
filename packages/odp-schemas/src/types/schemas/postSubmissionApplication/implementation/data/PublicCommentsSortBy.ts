import { Type, type Static } from '@sinclair/typebox'

const PublicCommentsSortByBaseSchema = Type.Union([Type.Literal('publishedAt')])

export const PostSubmissionPublicCommentsSortBySchema =
  PublicCommentsSortByBaseSchema
export type PostSubmissionPublicCommentsSortBy = Static<
  typeof PostSubmissionPublicCommentsSortBySchema
>

export const PostSubmissionPublishedPublicCommentsSortBySchema =
  PublicCommentsSortByBaseSchema
export type PostSubmissionPublishedPublicCommentsSortBy = Static<
  typeof PostSubmissionPublishedPublicCommentsSortBySchema
>
