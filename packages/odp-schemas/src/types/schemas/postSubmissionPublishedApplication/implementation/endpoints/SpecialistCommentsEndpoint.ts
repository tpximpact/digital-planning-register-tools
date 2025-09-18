import { type Static } from '@sinclair/typebox'
import { SpecialistCommentsRedacted } from '../../../postSubmissionApplication/data/Comment'
import {
  PostSubmissionSpecialistCommentsOrderBy,
  PostSubmissionSpecialistCommentsSearchParams,
  PostSubmissionSpecialistCommentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/SpecialistCommentsEndpoint'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'

/**
 * The data returned by the ApiResponse
 */
export const PostSubmissionPublishedSpecialistCommentsEndpoint =
  SpecialistCommentsRedacted
export type PostSubmissionPublishedSpecialistCommentsEndpoint = Static<
  typeof PostSubmissionPublishedSpecialistCommentsEndpoint
>

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications/{id}/specialistComments
 */
export const PostSubmissionPublishedSpecialistCommentsEndpointApiResponse =
  ApiResponse(PostSubmissionPublishedSpecialistCommentsEndpoint)
export type PostSubmissionPublishedSpecialistCommentsEndpointApiResponse =
  Static<typeof PostSubmissionPublishedSpecialistCommentsEndpointApiResponse>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionPublishedSpecialistCommentsSortBy = Static<
  typeof PostSubmissionPublishedSpecialistCommentsSortBy
>
export const PostSubmissionPublishedSpecialistCommentsSortBy =
  PostSubmissionSpecialistCommentsSortBy

export type PostSubmissionPublishedSpecialistCommentsOrderBy = Static<
  typeof PostSubmissionPublishedSpecialistCommentsOrderBy
>
export const PostSubmissionPublishedSpecialistCommentsOrderBy =
  PostSubmissionSpecialistCommentsOrderBy

export const PostSubmissionPublishedSpecialistCommentsSearchParams =
  PostSubmissionSpecialistCommentsSearchParams
export type PostSubmissionPublishedSpecialistCommentsSearchParams = Static<
  typeof PostSubmissionPublishedSpecialistCommentsSearchParams
>
