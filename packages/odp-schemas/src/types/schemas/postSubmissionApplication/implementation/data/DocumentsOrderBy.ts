import { Type, type Static } from '@sinclair/typebox'

const DocumentsOrderByBaseSchema = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionDocumentsOrderBySchema = DocumentsOrderByBaseSchema
export type PostSubmissionDocumentsOrderBy = Static<
  typeof PostSubmissionDocumentsOrderBySchema
>

export const PostSubmissionPublishedDocumentsOrderBySchema =
  DocumentsOrderByBaseSchema
export type PostSubmissionPublishedDocumentsOrderBy = Static<
  typeof PostSubmissionPublishedDocumentsOrderBySchema
>
