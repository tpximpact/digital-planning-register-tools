import { type PostSubmissionPublishedSpecialistsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import type { SpecialistRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { convertBopsSpecialistToSpecialistRedacted } from './convertBopsSpecialistToSpecialistRedacted'
import {
  PaginationChecker,
  PostSubmissionPublishedSpecialistsResponseChecker,
  SpecialistCommentSummaryChecker
} from '@dpr/libs'

/**
 * Converts a BopsPublicCommentsEndpoint object to a PostSubmissionPublishedPublicCommentsResponse.
 * Validates input, summary, pagination, and each comment.
 * Filters out invalid comments and adjusts pagination accordingly.
 */
export const bopsSpecialistCommentsEndpointToOdp = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  status: ApiResponseStatus
): PostSubmissionPublishedSpecialistsResponse => {
  if (PostSubmissionPublishedSpecialistsResponseChecker.Check(input)) {
    return input
  }

  const {
    data: { summary, comments: specialists },
    pagination
  } = input

  // Validate pagination and summary
  if (!PaginationChecker.Check(pagination)) {
    console.warn('Invalid Pagination:', pagination)
    throw new Error('Invalid Pagination')
  }
  if (!SpecialistCommentSummaryChecker.Check(summary)) {
    console.warn('Invalid SpecialistCommentSummary:', summary)
    throw new Error('Invalid SpecialistCommentSummary')
  }

  // Convert and filter specialists

  const convertedSpecialists: SpecialistRedacted[] = (specialists ?? [])
    .map((specialist: unknown): SpecialistRedacted | undefined => {
      try {
        return convertBopsSpecialistToSpecialistRedacted(specialist)
      } catch (error) {
        console.warn(
          'Error converting specialist comment but its taken care of elsewhere:',
          error
        )
        return undefined
      }
    })
    .filter(
      (
        specialist: SpecialistRedacted | undefined
      ): specialist is SpecialistRedacted => specialist !== undefined
    )

  const difference = (specialists?.length ?? 0) - convertedSpecialists.length

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
      comments: convertedSpecialists,
      summary
    },
    pagination: adjustedPagination,
    status
  }

  if (PostSubmissionPublishedSpecialistsResponseChecker.Check(results)) {
    return results
  }

  throw new Error('Unable to convert specialist endpoint')
}
