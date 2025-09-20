import type { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination'

export const paginateArray = <T>(
  data: T[],
  page: number,
  resultsPerPage: number
): {
  data: T[]
  pagination: Pagination
} => {
  // Type and value checks
  if (!Array.isArray(data)) throw new TypeError('data must be an array')
  if (typeof page !== 'number' || isNaN(page) || page < 1) page = 1
  if (typeof resultsPerPage !== 'number' || isNaN(resultsPerPage))
    resultsPerPage = 10

  // Clamp resultsPerPage to reasonable bounds
  const MAX_RESULTS_PER_PAGE = 1000
  const safeResultsPerPage = Math.max(
    1,
    Math.min(resultsPerPage, MAX_RESULTS_PER_PAGE)
  )

  const totalResults = data.length
  const totalPages = Math.max(1, Math.ceil(totalResults / safeResultsPerPage))
  const currentPage = page > totalPages ? totalPages : Math.max(1, page)
  const start = (currentPage - 1) * safeResultsPerPage
  const end = start + safeResultsPerPage
  const paginatedData = data.slice(start, end)

  const pagination: Pagination = {
    resultsPerPage: safeResultsPerPage,
    currentPage,
    totalPages,
    totalResults,
    totalAvailableItems: totalResults
  }
  return {
    data: paginatedData,
    pagination
  }
}
