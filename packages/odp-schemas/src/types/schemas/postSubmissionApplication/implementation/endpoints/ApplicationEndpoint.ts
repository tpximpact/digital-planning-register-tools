import { Type, type Static } from '@sinclair/typebox'
import { PostSubmissionApplication } from '../..'
import { ApiResponse } from '../ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionApplicationEndpoint = PostSubmissionApplication
export type PostSubmissionApplicationEndpoint = Static<
  typeof PostSubmissionApplicationEndpoint
>

/**
 * Endpoint to get a post submission application
 * /api/@next/applications/{applicationId}
 */
export const PostSubmissionApplicationEndpointApiResponse = ApiResponse(
  PostSubmissionApplicationEndpoint
)
export type PostSubmissionApplicationEndpointApiResponse = Static<
  typeof PostSubmissionApplicationEndpointApiResponse
>

/**
 * Parameters for the endpoint
 * /api/@next/applications/{applicationId} endpoint
 */

export const PostSubmissionApplicationParams = Type.Object({
  applicationId: Type.String()
})
export type PostSubmissionApplicationParams = Static<
  typeof PostSubmissionApplicationParams
>
