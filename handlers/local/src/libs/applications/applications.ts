import type {
  PostSubmissionApplicationsQueryParams,
  PostSubmissionPublishedApplicationsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import { fetchAllData } from '../../utils/fetch-all-data'
import { paginateArray } from '@dpr/libs'
import { filterByPaths } from '../../utils/filter-by-paths'
import { sortBy } from '../../utils/sort-by'

interface ApplicationFilterConfig {
  queryPaths: string[]
  referencePaths: string[]
  sortPaths: Record<string, string>
}

const defaultFilterConfig: ApplicationFilterConfig = {
  queryPaths: [
    'data.application.reference',
    'submission.data.property.address.postcode',
    'submission.data.proposal.description',
    'submission.data.proposal.address.postcode'
  ],
  referencePaths: ['data.application.reference'],
  sortPaths: {
    receivedAt: 'data.validation.receivedAt',
    publishedAt: 'data.application.publishedAt'
  }
}

export const findApplications = <
  T,
  Q extends
    | PostSubmissionApplicationsQueryParams
    | PostSubmissionPublishedApplicationsQueryParams
>(
  query: Q,
  fetchFn: () => T[],
  filterConfig: ApplicationFilterConfig = defaultFilterConfig
) => {
  const allApplications = fetchFn()

  let filtered = filterByPaths(
    allApplications,
    query.query,
    filterConfig.queryPaths
  )
  filtered = filterByPaths(
    filtered,
    query.reference,
    filterConfig.referencePaths
  )
  filtered = sortBy(
    filtered,
    query.sortBy,
    query.orderBy,
    filterConfig.sortPaths
  )

  const { data, pagination } = paginateArray<T>(
    filtered,
    query.page,
    query.resultsPerPage,
    allApplications.length
  )

  return { data, pagination }
}

export const allApplications = fetchAllData<PostSubmissionApplication>(false)
export const allPublishedApplications =
  fetchAllData<PostSubmissionPublishedApplication>(
    true,
    (file) => !file.includes('01-submission')
  )

export const getAllApplications = (
  query: PostSubmissionApplicationsQueryParams
) =>
  findApplications<
    PostSubmissionApplication,
    PostSubmissionApplicationsQueryParams
  >(query, () => fetchAllData<PostSubmissionApplication>(false))

export const getAllPublishedApplications = (
  query: PostSubmissionPublishedApplicationsQueryParams
) =>
  findApplications<
    PostSubmissionPublishedApplication,
    PostSubmissionPublishedApplicationsQueryParams
  >(query, () =>
    fetchAllData<PostSubmissionPublishedApplication>(
      true,
      (file) =>
        !file.includes('01-submission') &&
        !file.includes('02-validation-01-invalid')
    )
  )
