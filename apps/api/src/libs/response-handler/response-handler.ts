import type { OffsetPagination } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.js'
import { standardResponseObjects } from '../standard-responses'

/**
 * Generic response handler for API endpoints.
 * @param handler - A function that returns either { data, pagination } or just { data }
 * @param opts - Options object, e.g. { paginated: true }
 *
 * @example
 * // For paginated endpoint
 * return handleApiResponse(
 *   () => getAllApplications(context.query),
 *   { paginated: true, errorDetail: 'Failed to generate example applications' }
 * )
 *
 * // For non-paginated endpoint
 * return handleApiResponse(
 *   () => getSomethingSimple(),
 *   { errorDetail: 'Failed to get something simple' }
 * )
 */
export async function handleApiResponse<T>(
  handler: () =>
    | Promise<{ data: T; pagination?: OffsetPagination }>
    | { data: T; pagination?: OffsetPagination },
  opts: { paginated?: boolean; errorDetail?: string } = {}
) {
  try {
    const result = await handler()
    if (opts.paginated) {
      return {
        data: result.data,
        pagination: result.pagination,
        status: standardResponseObjects.OkResponseObject
      }
    }
    return {
      data: result.data,
      status: standardResponseObjects.OkResponseObject
    }
  } catch (e) {
    console.error(e)
    return {
      data: null,
      status: {
        ...standardResponseObjects.InternalServerErrorResponseObject,
        detail: opts.errorDetail || 'Internal server error'
      }
    }
  }
}
