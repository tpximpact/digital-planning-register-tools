import { type PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
import {
  type PostSubmissionPublishedApplicationsResponse,
  PostSubmissionPublishedApplicationsResponseSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { Value } from '@sinclair/typebox/value'
import { PaginationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { convertBopsApplicationToOdp } from './application'
/**
 * Converts a BopsPublicCommentsEndpoint object to a PostSubmissionPublishedPublicCommentsResponse.
 * Validates input, summary, pagination, and each comment.
 * Filters out invalid comments and adjusts pagination accordingly.
 */
export const bopsApplicationsEndpointToOdp = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  status: ApiResponseStatus
): PostSubmissionPublishedApplicationsResponse => {
  if (Value.Check(PostSubmissionPublishedApplicationsResponseSchema, input)) {
    return input as PostSubmissionPublishedApplicationsResponse
  }

  const { data: applications, pagination } = input

  // console.log('Raw applications endpoint response:', input)

  // Validate pagination and summary
  if (!Value.Check(PaginationSchema, pagination)) {
    console.warn('Invalid Pagination:', pagination)
    throw new Error('Invalid Pagination')
  }

  // Convert and filter comments

  const convertedApplications: PostSubmissionPublishedApplication[] = (
    applications ?? []
  )
    .map(
      (
        application: unknown
      ): PostSubmissionPublishedApplication | undefined => {
        try {
          return convertBopsApplicationToOdp(application)
        } catch (error) {
          console.warn(
            'Error converting application but its taken care of elsewhere:',
            error
          )
          return undefined
        }
      }
    )
    .filter(
      (
        application: PostSubmissionPublishedApplication | undefined
      ): application is PostSubmissionPublishedApplication =>
        application !== undefined
    )

  const difference = (applications?.length ?? 0) - convertedApplications.length

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
    data: convertedApplications,
    pagination: adjustedPagination,
    status
  }

  if (Value.Check(PostSubmissionPublishedApplicationsResponseSchema, results)) {
    return results
  }

  throw new Error('Unable to convert applications endpoint')
}
