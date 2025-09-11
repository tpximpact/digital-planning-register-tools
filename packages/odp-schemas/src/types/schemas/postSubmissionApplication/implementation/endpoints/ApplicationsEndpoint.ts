import { Type, type Static } from '@sinclair/typebox'
import { ApiResponse } from '../ApiResponse'
import { PostSubmissionApplication } from '../..'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/applications
 */

export const PostSubmissionApplicationsEndpoint = ApiResponse(
  Type.Array(PostSubmissionApplication)
)
export type PostSubmissionApplicationsEndpoint = Static<
  typeof PostSubmissionApplicationsEndpoint
>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionApplicationsSortBy = Static<
  typeof PostSubmissionApplicationsSortBy
>
export const PostSubmissionApplicationsSortBy = Type.Union([
  Type.Literal('receivedAt'),
  Type.Literal('councilDecisionDate')
])

export type PostSubmissionApplicationsOrderBy = Static<
  typeof PostSubmissionApplicationsOrderBy
>
export const PostSubmissionApplicationsOrderBy = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionApplicationsSearchParams = Type.Object({
  page: Type.Number(),
  resultsPerPage: Type.Number(),
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(PostSubmissionApplicationsSortBy),
  orderBy: Type.Optional(PostSubmissionApplicationsOrderBy),
  reference: Type.Optional(Type.String())
})
export type PostSubmissionApplicationsSearchParams = Static<
  typeof PostSubmissionApplicationsSearchParams
>
