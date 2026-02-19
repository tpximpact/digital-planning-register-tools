import { Type, type Static } from '@sinclair/typebox'

const ApplicationsOrderByBaseSchema = Type.Union(
  [Type.Literal('asc'), Type.Literal('desc')],
  {
    default: 'desc'
  }
)

export const PostSubmissionApplicationsOrderBySchema =
  ApplicationsOrderByBaseSchema
export type PostSubmissionApplicationsOrderBy = Static<
  typeof PostSubmissionApplicationsOrderBySchema
>

export const PostSubmissionPublishedApplicationsOrderBySchema =
  ApplicationsOrderByBaseSchema
export type PostSubmissionPublishedApplicationsOrderBy = Static<
  typeof PostSubmissionPublishedApplicationsOrderBySchema
>
