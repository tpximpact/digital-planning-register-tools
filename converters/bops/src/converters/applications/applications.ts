import type { PostSubmissionPublishedApplicationsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { Value } from '@sinclair/typebox/value'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse'
import {
  BopsSearchEndpoint as BopsSearchEndpointSchema,
  type BopsSearchEndpoint
} from '../../schemas/bops/search'
import { BopsShowEndpoint } from '../../schemas/bops/show'
import { convertBopsShowEndpoint } from './convertBopsShowEndpoint'

export const bopsSearchEndpointToOdp = (
  input: BopsSearchEndpoint,
  status: ApiResponseStatus
): PostSubmissionPublishedApplicationsResponse | undefined => {
  // Validate input schema
  if (!Value.Check(BopsSearchEndpointSchema, input)) {
    console.warn('Invalid BopsSearchEndpoint:', input)
    return undefined
  }

  const { data, pagination } = input

  // Validate pagination and summary
  if (!Value.Check(Pagination, pagination)) {
    console.warn('Invalid Pagination:', pagination)
    return undefined
  }

  // Convert and filter applications
  const convertedApplications = (data ?? [])
    .map((application) => convertBopsShowEndpoint(application))
    .filter((application) => {
      const valid =
        application !== undefined && Value.Check(BopsShowEndpoint, application)
      if (!valid) console.warn('Invalid BopsShowEndpoint:', application)
      return valid
    })

  const difference = (data?.length ?? 0) - convertedApplications.length

  // Adjust pagination if any applications were filtered out
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
    data: convertedApplications,
    pagination: adjustedPagination,
    status
  }
}
