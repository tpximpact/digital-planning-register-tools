import { Type, type Static } from '@sinclair/typebox'

const ApplicationsSortByBaseSchema = Type.Union(
  [Type.Literal('publishedAt'), Type.Literal('receivedAt')],
  {
    default: 'publishedAt'
  }
)

export const PostSubmissionApplicationsSortBySchema = ApplicationsSortByBaseSchema
export type PostSubmissionApplicationsSortBy = Static<
  typeof PostSubmissionApplicationsSortBySchema
>

export const PostSubmissionPublishedApplicationsSortBySchema = ApplicationsSortByBaseSchema
export type PostSubmissionPublishedApplicationsSortBy = Static<
  typeof PostSubmissionPublishedApplicationsSortBySchema
>
