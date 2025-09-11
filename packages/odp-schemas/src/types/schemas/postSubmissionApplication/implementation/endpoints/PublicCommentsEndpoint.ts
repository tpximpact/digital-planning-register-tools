import { Type, type Static } from '@sinclair/typebox'
import { PublicComments } from '../../data/Comment'
import { ApiResponse } from '../ApiResponse'
import { CommentSentiment } from '../../enums/CommentSentiment'
import { CommentTopic } from '../../enums/CommentTopic'

/**
 * Endpoint to get a list of post submission applications
 * /api/@next/applications/{id}/publicComments
 */

export const PostSubmissionPublicCommentsEndpoint = ApiResponse(PublicComments)
export type PostSubmissionPublicCommentsEndpoint = Static<
  typeof PostSubmissionPublicCommentsEndpoint
>

/**
 * Search parameters for the endpoint
 */

export type PostSubmissionPublicCommentsSortBy = Static<
  typeof PostSubmissionPublicCommentsSortBy
>
export const PostSubmissionPublicCommentsSortBy = Type.Literal('receivedAt')

export type PostSubmissionPublicCommentsOrderBy = Static<
  typeof PostSubmissionPublicCommentsOrderBy
>
export const PostSubmissionPublicCommentsOrderBy = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export const PostSubmissionPublicCommentsSearchParams = Type.Object({
  page: Type.Number(),
  resultsPerPage: Type.Number(),
  query: Type.Optional(Type.String()),
  sortBy: Type.Optional(PostSubmissionPublicCommentsSortBy),
  orderBy: Type.Optional(PostSubmissionPublicCommentsOrderBy),
  sentiment: Type.Optional(CommentSentiment),
  topic: Type.Optional(CommentTopic),
  publishedAtFrom: Type.Optional(Type.String()),
  publishedAtTo: Type.Optional(Type.String())
})
export type PostSubmissionPublicCommentsSearchParams = Static<
  typeof PostSubmissionPublicCommentsSearchParams
>
