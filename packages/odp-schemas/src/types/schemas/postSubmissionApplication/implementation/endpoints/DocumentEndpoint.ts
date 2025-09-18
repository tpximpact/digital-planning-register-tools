import { Type, type Static } from '@sinclair/typebox'
import { PostSubmissionFile } from '../../data/PostSubmissionFile'
import { ApiResponse } from '../ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionDocumentEndpoint = PostSubmissionFile
export type PostSubmissionDocumentEndpoint = Static<
  typeof PostSubmissionDocumentEndpoint
>

/**
 * Endpoint to get a post submission application document
 * /api/@next/applications/{id}/document/{id}
 */
export const PostSubmissionDocumentEndpointApiResponse = ApiResponse(
  PostSubmissionDocumentEndpoint,
  { description: '#PostSubmissionDocumentEndpointApiResponse' }
)
export type PostSubmissionDocumentEndpointApiResponse = Static<
  typeof PostSubmissionDocumentEndpointApiResponse
>

/**
 * Parameters for the /api/@next/applications/{id}/documents/{id} endpoint
 */

export const PostSubmissionDocumentParams = Type.Object({
  applicationId: Type.String(),
  documentId: Type.String()
})
export type PostSubmissionDocumentParams = Static<
  typeof PostSubmissionDocumentParams
>
