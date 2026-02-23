import { Type, type Static } from '@sinclair/typebox'

const DocumentsSortByBaseSchema = Type.Union([
  Type.Literal('publishedAt'),
  Type.Literal('name')
])

export const PostSubmissionDocumentsSortBySchema = DocumentsSortByBaseSchema
export type PostSubmissionDocumentsSortBy = Static<
  typeof PostSubmissionDocumentsSortBySchema
>

export const PostSubmissionPublishedDocumentsSortBySchema = DocumentsSortByBaseSchema
export type PostSubmissionPublishedDocumentsSortBy = Static<
  typeof PostSubmissionPublishedDocumentsSortBySchema
>
