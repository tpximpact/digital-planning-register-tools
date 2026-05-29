import { type PostSubmissionPublishedPublicCommentsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import type { PublicCommentRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import { convertBopsCommentToPublicCommentRedacted } from './convertBopsCommentToPublicCommentRedacted'
import {
  PostSubmissionPublishedPublicCommentsResponseChecker,
  PublicCommentSummaryChecker,
  PaginationChecker
} from '@dpr/libs'
/**
 * Converts a BopsPublicCommentsEndpoint object to a PostSubmissionPublishedPublicCommentsResponse.
 * Validates input, summary, pagination, and each comment.
 * Filters out invalid comments and adjusts pagination accordingly.
 */
export const bopsPublicCommentsEndpointToOdp = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  status: ApiResponseStatus
): PostSubmissionPublishedPublicCommentsResponse => {
  if (PostSubmissionPublishedPublicCommentsResponseChecker.Check(input)) {
    return input
  }

  const { summary, comments, pagination } = input

  // Validate pagination and summary
  if (!PaginationChecker.Check(pagination)) {
    console.warn('Invalid Pagination:', pagination)
    throw new Error('Invalid Pagination')
  }
  if (!PublicCommentSummaryChecker.Check(summary)) {
    console.warn('Invalid PublicCommentSummary:', summary)
    throw new Error('Invalid PublicCommentSummary')
  }

  // Convert and filter comments

  const convertedComments: PublicCommentRedacted[] = (comments ?? [])
    .map((comment: unknown): PublicCommentRedacted | undefined => {
      try {
        return convertBopsCommentToPublicCommentRedacted(comment)
      } catch (error) {
        console.warn(
          'Error converting public comment but its taken care of elsewhere:',
          error
        )
        return undefined
      }
    })
    .filter(
      (
        comment: PublicCommentRedacted | undefined
      ): comment is PublicCommentRedacted => comment !== undefined
    )

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

  const results = {
    data: {
      comments: convertedComments,
      summary
    },
    pagination: adjustedPagination,
    status
  }

  if (PostSubmissionPublishedPublicCommentsResponseChecker.Check(results)) {
    return results
  }

  throw new Error('Unable to convert public comment endpoint')
}
