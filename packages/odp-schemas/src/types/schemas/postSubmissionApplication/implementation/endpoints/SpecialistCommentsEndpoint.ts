import { Type, type Static } from '@sinclair/typebox'
import { SpecialistComments } from '../../data/Comment'
import { ApiResponse } from '../ApiResponse'
import { SpecialistCommentSentiment } from '../../enums/CommentSentiment'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/applications/{id}/specialistComments
 */
export const PostSubmissionSpecialistCommentsEndpoint =
  ApiResponse(SpecialistComments)
export type PostSubmissionSpecialistCommentsEndpoint = Static<
  typeof PostSubmissionSpecialistCommentsEndpoint
>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionSpecialistCommentsSortBy = Static<
  typeof PostSubmissionSpecialistCommentsSortBy
>
export const PostSubmissionSpecialistCommentsSortBy = Type.Literal('receivedAt')

export type PostSubmissionSpecialistCommentsOrderBy = Static<
  typeof PostSubmissionSpecialistCommentsOrderBy
>
export const PostSubmissionSpecialistCommentsOrderBy = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionSpecialistCommentsSearchParams = Type.Object({
  page: Type.Number(),
  resultsPerPage: Type.Number(),
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(PostSubmissionSpecialistCommentsSortBy),
  orderBy: Type.Optional(PostSubmissionSpecialistCommentsOrderBy),
  sentiment: Type.Optional(SpecialistCommentSentiment),
  publishedAtFrom: Type.Optional(Type.String()),
  publishedAtTo: Type.Optional(Type.String())
})
export type PostSubmissionSpecialistCommentsSearchParams = Static<
  typeof PostSubmissionSpecialistCommentsSearchParams
>
