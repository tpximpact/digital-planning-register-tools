import type { PostSubmissionPublishedPublicCommentsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  BopsPublicCommentsEndpoint as BopsPublicCommentsEndpointSchema,
  type BopsPublicCommentsEndpoint
} from '../../schemas/bops/publicComments'
import { Value } from '@sinclair/typebox/value'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { PublicCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { PublicCommentRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { convertBopsPublicComment } from './convertBopsPublicComment'

/**
 * Converts a BopsPublicCommentsEndpoint object to a PostSubmissionPublishedPublicCommentsResponse.
 * Validates input, summary, pagination, and each comment.
 * Filters out invalid comments and adjusts pagination accordingly.
 */
export const bopsPublicCommentsEndpointToOdp = (
  input: BopsPublicCommentsEndpoint,
  status: ApiResponseStatus
): PostSubmissionPublishedPublicCommentsResponse | undefined => {
  // Validate input schema
  if (!Value.Check(BopsPublicCommentsEndpointSchema, input)) {
    console.warn('Invalid BopsPublicCommentsEndpoint:', input)
    return undefined
  }

  const { summary, comments, pagination } = input

  // Validate pagination and summary
  if (!Value.Check(Pagination, pagination)) {
    console.warn('Invalid Pagination:', pagination)
    return undefined
  }
  if (!Value.Check(PublicCommentSummary, summary)) {
    console.warn('Invalid PublicCommentSummary:', summary)
    return undefined
  }

  // Convert and filter comments
  const convertedComments = (comments ?? [])
    .map((comment) => convertBopsPublicComment(comment))
    .filter((comment) => {
      const valid =
        comment !== undefined && Value.Check(PublicCommentRedacted, comment)
      if (!valid) console.warn('Invalid PublicCommentRedacted:', comment)
      return valid
    })

  const difference = (comments?.length ?? 0) - convertedComments.length

  // Adjust pagination if any comments were filtered out
  const adjustedPagination =
    difference > 0
      ? {
          ...pagination,
          totalAvailableItems:
            (pagination?.totalAvailableItems ?? 0) - difference,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalResults: pagination.totalResults - difference
        }
      : pagination

  return {
    data: {
      comments: convertedComments,
      summary
    },
    pagination: adjustedPagination,
    status
  }
}
