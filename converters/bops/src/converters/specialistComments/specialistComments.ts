import type { PostSubmissionPublishedSpecialistsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  BopsSpecialistCommentsEndpoint as BopsSpecialistCommentsEndpointSchema,
  type BopsSpecialistCommentsEndpoint
} from '../../schemas/bops/specialistComments'
import { Value } from '@sinclair/typebox/value'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { SpecialistCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { SpecialistRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { convertBopsSpecialistComment } from './convertBopsSpecialistComment'

/**
 * Converts a BopsPublicCommentsEndpoint object to a PostSubmissionPublishedPublicCommentsResponse.
 * Validates input, summary, pagination, and each comment.
 * Filters out invalid comments and adjusts pagination accordingly.
 */
export const bopsSpecialistCommentsEndpointToOdp = (
  input: BopsSpecialistCommentsEndpoint,
  status: ApiResponseStatus
): PostSubmissionPublishedSpecialistsResponse => {
  // Validate input schema
  if (!Value.Check(BopsSpecialistCommentsEndpointSchema, input)) {
    console.warn('Invalid BopsSpecialistCommentsEndpoint:', input)
    throw new Error('Invalid BopsSpecialistCommentsEndpoint')
  }

  const { summary, comments, pagination } = input

  // Validate pagination and summary
  if (!Value.Check(Pagination, pagination)) {
    console.warn('Invalid Pagination:', pagination)
    throw new Error('Invalid Pagination')
  }
  if (!Value.Check(SpecialistCommentSummary, summary)) {
    console.warn('Invalid SpecialistCommentSummary:', summary)
    throw new Error('Invalid SpecialistCommentSummary')
  }

  // Convert and filter comments
  const convertedComments = (comments ?? [])
    .map((comment) => convertBopsSpecialistComment(comment))
    .filter((comment) => {
      const valid =
        comment !== undefined && Value.Check(SpecialistRedacted, comment)
      if (!valid) console.warn('Invalid SpecialistRedacted:', comment)
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
