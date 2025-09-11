import { type Static } from '@sinclair/typebox'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'
import { PublicCommentsRedacted } from '../../../postSubmissionApplication/data/Comment'
import {
  PostSubmissionPublicCommentsOrderBy,
  PostSubmissionPublicCommentsSearchParams,
  PostSubmissionPublicCommentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/PublicCommentsEndpoint'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications/{id}/publicComments
 */

export const PostSubmissionPublishedPublicCommentsEndpoint = ApiResponse(
  PublicCommentsRedacted
)
export type PostSubmissionPublishedPublicCommentsEndpoint = Static<
  typeof PostSubmissionPublishedPublicCommentsEndpoint
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
