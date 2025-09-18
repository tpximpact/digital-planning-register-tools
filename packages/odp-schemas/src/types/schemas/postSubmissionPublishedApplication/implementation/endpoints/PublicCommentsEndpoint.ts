import { type Static } from '@sinclair/typebox'
import { PublicCommentsRedacted } from '../../../postSubmissionApplication/data/Comment'
import {
  PostSubmissionPublicCommentsOrderBy,
  PostSubmissionPublicCommentsSearchParams,
  PostSubmissionPublicCommentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/PublicCommentsEndpoint'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedPublicCommentsEndpoint =
  PublicCommentsRedacted
export type PostSubmissionPublishedPublicCommentsEndpoint = Static<
  typeof PostSubmissionPublishedPublicCommentsEndpoint
>

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications/{id}/publicComments
 */
export const PostSubmissionPublishedPublicCommentsEndpointApiResponse =
  ApiResponse(PostSubmissionPublishedPublicCommentsEndpoint)
export type PostSubmissionPublishedPublicCommentsEndpointApiResponse = Static<
  typeof PostSubmissionPublishedPublicCommentsEndpointApiResponse
>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionPublishedPublicCommentsSortBy = Static<
  typeof PostSubmissionPublishedPublicCommentsSortBy
>
export const PostSubmissionPublishedPublicCommentsSortBy =
  PostSubmissionPublicCommentsSortBy

export type PostSubmissionPublishedPublicCommentsOrderBy = Static<
  typeof PostSubmissionPublishedPublicCommentsOrderBy
>
export const PostSubmissionPublishedPublicCommentsOrderBy =
  PostSubmissionPublicCommentsOrderBy

export const PostSubmissionPublishedPublicCommentsSearchParams =
  PostSubmissionPublicCommentsSearchParams
export type PostSubmissionPublishedPublicCommentsSearchParams = Static<
  typeof PostSubmissionPublishedPublicCommentsSearchParams
>
