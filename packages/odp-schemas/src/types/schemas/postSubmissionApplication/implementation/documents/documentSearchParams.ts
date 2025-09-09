import { Type, type Static } from '@sinclair/typebox'
import { PrototypeFileType as FileType } from '../../../prototypeApplication/enums/FileType'

export const PostSubmissionDocumentsSortBy = Type.Union([
  Type.Literal('publishedAt'),
  Type.Literal('name')
])
export type PostSubmissionDocumentsSortBy = Static<
  typeof PostSubmissionDocumentsSortBy
>

export const PostSubmissionDocumentsOrderBy = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])
export type PostSubmissionDocumentsOrderBy = Static<
  typeof PostSubmissionDocumentsOrderBy
>

export const PostSubmissionDocumentsSearchParams = Type.Object({
  page: Type.Number(),
  resultsPerPage: Type.Number(),
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(PostSubmissionDocumentsSortBy),
  orderBy: Type.Optional(PostSubmissionDocumentsOrderBy),
  name: Type.Optional(Type.String()),
  type: Type.Optional(FileType),
  publishedAtFrom: Type.Optional(Type.String()),
  publishedAtTo: Type.Optional(Type.String())
})
export type PostSubmissionDocumentsSearchParams = Static<
  typeof PostSubmissionDocumentsSearchParams
>
