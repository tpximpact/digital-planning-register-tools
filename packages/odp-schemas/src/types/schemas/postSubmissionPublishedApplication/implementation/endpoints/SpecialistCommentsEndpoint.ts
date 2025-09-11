import { type Static } from '@sinclair/typebox'
import { ApiResponse } from '../../../postSubmissionApplication/implementation/ApiResponse'
import { SpecialistCommentsRedacted } from '../../../postSubmissionApplication/data/Comment'
import {
  PostSubmissionSpecialistCommentsOrderBy,
  PostSubmissionSpecialistCommentsSearchParams,
  PostSubmissionSpecialistCommentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/SpecialistCommentsEndpoint'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/public/applications/{id}/specialistComments
 */
export const PostSubmissionPublishedSpecialistCommentsEndpoint = ApiResponse(
  SpecialistCommentsRedacted
)
export type PostSubmissionPublishedSpecialistCommentsEndpoint = Static<
  typeof PostSubmissionPublishedSpecialistCommentsEndpoint
>

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
