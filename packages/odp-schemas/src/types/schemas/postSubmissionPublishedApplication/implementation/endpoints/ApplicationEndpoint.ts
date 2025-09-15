import { Type, type Static } from '@sinclair/typebox'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'
import { PostSubmissionPublishedApplication } from '../..'

/**
 * Endpoint to get a post submission application
 * /api/@next/public/applications/{id}
 */

export const PostSubmissionPublishedApplicationEndpoint = ApiResponse(
  PostSubmissionPublishedApplication
)
export type PostSubmissionPublishedApplicationEndpoint = Static<
  typeof PostSubmissionPublishedApplicationEndpoint
>

/**
 * Parameters for the endpoint
 */

export const PostSubmissionPublishedApplicationParams = Type.Object({
  id: Type.String()
})
export type PostSubmissionPublishedApplicationParams = Static<
  typeof PostSubmissionPublishedApplicationParams
>
