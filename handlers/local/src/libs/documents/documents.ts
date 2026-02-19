import type {
  PostSubmissionDocumentsQueryParams,
  PostSubmissionPublishedDocumentsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import type {
  PostSubmissionFile,
  PostSubmissionFileRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/File.js'
import { paginateArray } from '@dpr/libs'
import { filterByPaths } from '../../utils/filter-by-paths'
import { sortBy } from '../../utils/sort-by'
import { getApplication, getPublishedApplication } from '../applications'
import { filterByDateRange } from '../../utils/filter-by-date-range'
import { getByPaths } from '../../utils/get-by-paths'

interface FilterConfig {
  namePaths: string[]
  referencePaths: string[]
  publishedDatePath: string
  typePaths: string[]
  sortPaths: Record<string, string>
}

const defaultFilterConfig: FilterConfig = {
  namePaths: ['name'],
  referencePaths: ['data.application.reference'],
  publishedDatePath: 'metadata.publishedAt',
  typePaths: ['type'],
  sortPaths: {
    publishedAt: 'metadata.publishedAt',
    name: 'name'
  }
}

export const findApplicationDocuments = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication,
  Q extends
    | PostSubmissionDocumentsQueryParams
    | PostSubmissionPublishedDocumentsQueryParams
>(
  query: Q,
  application: T,
  filterConfig: FilterConfig = defaultFilterConfig
) => {
  const allDocuments = application?.files ?? []
  let filtered = filterByPaths<PostSubmissionFile | PostSubmissionFileRedacted>(
    allDocuments,
    query.name,
    filterConfig.namePaths
  )
  filtered = getByPaths(filtered, query.type, filterConfig.typePaths)
  filtered = filterByDateRange(
    filtered,
    query.publishedAtFrom,
    query.publishedAtTo,
    filterConfig.publishedDatePath
  )
  filtered = sortBy(
    filtered,
    query.sortBy,
    query.orderBy,
    filterConfig.sortPaths
  )
  const { data, pagination } = paginateArray<
    PostSubmissionFile | PostSubmissionFileRedacted
  >(filtered, query.page, query.resultsPerPage, allDocuments.length)

  return { data, pagination }
}

export const getAllApplicationDocuments = (
  applicationId: string,
  query: PostSubmissionDocumentsQueryParams
) =>
  findApplicationDocuments<
    PostSubmissionApplication,
    PostSubmissionDocumentsQueryParams
  >(query, getApplication(applicationId))

export const getAllPublishedApplicationDocuments = (
  applicationId: string,
  query: PostSubmissionPublishedDocumentsQueryParams
) =>
  findApplicationDocuments<
    PostSubmissionPublishedApplication,
    PostSubmissionPublishedDocumentsQueryParams
  >(query, getPublishedApplication(applicationId))
