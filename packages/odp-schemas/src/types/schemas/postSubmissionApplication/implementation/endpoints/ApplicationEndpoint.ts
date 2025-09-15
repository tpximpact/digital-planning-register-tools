import { Type, type Static } from '@sinclair/typebox'
import { ApiResponse } from '../ApiResponse'
import { PostSubmissionApplication } from '../..'

/**
 * Endpoint to get a post submission application
 * /api/@next/applications/{id}
 */

export const PostSubmissionApplicationEndpoint = ApiResponse(
  PostSubmissionApplication
)
export type PostSubmissionApplicationEndpoint = Static<
  typeof PostSubmissionApplicationEndpoint
>

/**
 * Parameters for the endpoint
 */

export const PostSubmissionApplicationParams = Type.Object({
  id: Type.String()
})
export type PostSubmissionApplicationParams = Static<
  typeof PostSubmissionApplicationParams
>
