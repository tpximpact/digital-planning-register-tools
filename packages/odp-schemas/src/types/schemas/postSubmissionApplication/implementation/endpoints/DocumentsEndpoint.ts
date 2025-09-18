import { Type, type Static } from '@sinclair/typebox'
import { PostSubmissionFile } from '../../data/PostSubmissionFile'
import { PrototypeFileType as FileType } from '../../../prototypeApplication/enums/FileType'
import { ApiResponse } from '../ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionDocumentsEndpoint = Type.Array(PostSubmissionFile)
export type PostSubmissionDocumentsEndpoint = Static<
  typeof PostSubmissionDocumentsEndpoint
>

/**
 * Endpoint to get a list of post submission application documents
 * /api/@next/applications/{id}/documents
 */
export const PostSubmissionDocumentsEndpointApiResponse = ApiResponse(
  Type.Union([PostSubmissionDocumentsEndpoint, Type.Null()]),
  { description: '#PostSubmissionDocumentsEndpointApiResponse' }
)
export type PostSubmissionDocumentsEndpointApiResponse = Static<
  typeof PostSubmissionDocumentsEndpointApiResponse
>

/**
 * Search parameters for the endpoint
 */

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
  page: Type.Number({ default: 1, minimum: 1 }),
  resultsPerPage: Type.Number({ default: 10, minimum: 1, maximum: 50 }),
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
