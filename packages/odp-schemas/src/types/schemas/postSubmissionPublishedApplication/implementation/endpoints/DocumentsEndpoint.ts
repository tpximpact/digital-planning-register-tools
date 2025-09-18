import { Type, type Static } from '@sinclair/typebox'
import {
  PostSubmissionDocumentsOrderBy,
  PostSubmissionDocumentsSearchParams,
  PostSubmissionDocumentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/DocumentsEndpoint'
import { PostSubmissionFile } from '../../../postSubmissionApplication/data/PostSubmissionFile'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedDocumentsEndpoint =
  Type.Array(PostSubmissionFile)
export type PostSubmissionPublishedDocumentsEndpoint = Static<
  typeof PostSubmissionPublishedDocumentsEndpoint
>

/**
 * Endpoint to get a list of post submission application documents
 * /api/@next/applications/{id}/documents
 */
export const PostSubmissionPublishedDocumentsEndpointApiResponse = ApiResponse(
  Type.Union([PostSubmissionPublishedDocumentsEndpoint, Type.Null()]),
  { description: '#PostSubmissionPublishedDocumentsEndpointApiResponse' }
)
export type PostSubmissionPublishedDocumentsEndpointApiResponse = Static<
  typeof PostSubmissionPublishedDocumentsEndpointApiResponse
>

/**
 * Search parameters for the endpoint
 */

export const PostSubmissionPublishedDocumentsSortBy =
  PostSubmissionDocumentsSortBy
export type PostSubmissionPublishedDocumentsSortBy = Static<
  typeof PostSubmissionPublishedDocumentsSortBy
>

export const PostSubmissionPublishedDocumentsOrderBy =
  PostSubmissionDocumentsOrderBy
export type PostSubmissionPublishedDocumentsOrderBy = Static<
  typeof PostSubmissionPublishedDocumentsOrderBy
>

export const PostSubmissionPublishedDocumentsSearchParams =
  PostSubmissionDocumentsSearchParams
export type PostSubmissionPublishedDocumentsSearchParams = Static<
  typeof PostSubmissionPublishedDocumentsSearchParams
>
