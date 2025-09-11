import { type Static } from '@sinclair/typebox'
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
