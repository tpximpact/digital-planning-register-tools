import { type Static } from '@sinclair/typebox'
import {
  PostSubmissionDocumentEndpoint,
  PostSubmissionDocumentParams
} from '../../../postSubmissionApplication/implementation/endpoints/DocumentEndpoint'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedDocumentEndpoint =
  PostSubmissionDocumentEndpoint
export type PostSubmissionPublishedDocumentEndpoint = Static<
  typeof PostSubmissionPublishedDocumentEndpoint
>

/**
 * Endpoint to get a post submission application document
 * /api/@next/public/applications/{id}/document/{id}
 */
export const PostSubmissionPublishedDocumentEndpointApiResponse = ApiResponse(
  PostSubmissionPublishedDocumentEndpoint,
  { description: '#PostSubmissionPublishedDocumentEndpointApiResponse' }
)
export type PostSubmissionPublishedDocumentEndpointApiResponse = Static<
  typeof PostSubmissionPublishedDocumentEndpointApiResponse
>

/**
 * Parameters for the /api/@next/applications/{id}/documents/{id} endpoint
 */

export const PostSubmissionPublishedDocumentParams =
  PostSubmissionDocumentParams
export type PostSubmissionPublishedDocumentParams = Static<
  typeof PostSubmissionPublishedDocumentParams
>
