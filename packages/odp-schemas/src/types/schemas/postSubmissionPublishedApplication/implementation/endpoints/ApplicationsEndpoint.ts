import { Type, type Static } from '@sinclair/typebox'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'
import { PostSubmissionPublishedApplication } from '../..'
import {
  PostSubmissionApplicationsOrderBy,
  PostSubmissionApplicationsSearchParams,
  PostSubmissionApplicationsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/ApplicationsEndpoint'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications
 */

export const PostSubmissionPublishedApplicationsEndpoint = ApiResponse(
  Type.Array(PostSubmissionPublishedApplication)
)
export type PostSubmissionPublishedApplicationsEndpoint = Static<
  typeof PostSubmissionPublishedApplicationsEndpoint
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
