import { Type, type Static } from '@sinclair/typebox'
import { PostSubmissionPublishedApplication } from '../..'
import {
  PostSubmissionApplicationsOrderBy,
  PostSubmissionApplicationsSearchParams,
  PostSubmissionApplicationsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/ApplicationsEndpoint'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'
/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedApplicationsEndpoint = Type.Array(
  PostSubmissionPublishedApplication
)
export type PostSubmissionPublishedApplicationsEndpoint = Static<
  typeof PostSubmissionPublishedApplicationsEndpoint
>

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications
 */
export const PostSubmissionPublishedApplicationsEndpointApiResponse =
  ApiResponse(
    Type.Union([PostSubmissionPublishedApplicationsEndpoint, Type.Null()])
  )
export type PostSubmissionPublishedApplicationsEndpointApiResponse = Static<
  typeof PostSubmissionPublishedApplicationsEndpointApiResponse
>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionPublishedApplicationsSortBy = Static<
  typeof PostSubmissionPublishedApplicationsSortBy
>
export const PostSubmissionPublishedApplicationsSortBy =
  PostSubmissionApplicationsSortBy

export type PostSubmissionPublishedApplicationsOrderBy = Static<
  typeof PostSubmissionPublishedApplicationsOrderBy
>
export const PostSubmissionPublishedApplicationsOrderBy =
  PostSubmissionApplicationsOrderBy

export const PostSubmissionPublishedApplicationsSearchParams =
  PostSubmissionApplicationsSearchParams
export type PostSubmissionPublishedApplicationsSearchParams = Static<
  typeof PostSubmissionPublishedApplicationsSearchParams
>
