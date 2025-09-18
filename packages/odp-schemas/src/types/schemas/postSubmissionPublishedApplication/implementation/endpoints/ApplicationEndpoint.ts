import { type Static } from '@sinclair/typebox'
import { PostSubmissionPublishedApplication } from '../..'
import { PostSubmissionApplicationParams } from '../../../postSubmissionApplication/implementation/endpoints/ApplicationEndpoint'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedApplicationEndpoint =
  PostSubmissionPublishedApplication
export type PostSubmissionPublishedApplicationEndpoint = Static<
  typeof PostSubmissionPublishedApplicationEndpoint
>

/**
 * Endpoint to get a post submission application
 * /api/@next/public/applications/{applicationId}
 */
export const PostSubmissionPublishedApplicationEndpointApiResponse =
  ApiResponse(PostSubmissionPublishedApplicationEndpoint)
export type PostSubmissionPublishedApplicationEndpointApiResponse = Static<
  typeof PostSubmissionPublishedApplicationEndpointApiResponse
>

/**
 * Parameters for the end point
 * /api/@next/public/applications/{applicationId} endpoint
 */

export const PostSubmissionPublishedApplicationParams =
  PostSubmissionApplicationParams
export type PostSubmissionPublishedApplicationParams = Static<
  typeof PostSubmissionPublishedApplicationParams
>
