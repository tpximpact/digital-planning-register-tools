import type {
  PostSubmissionPublicCommentsQueryParams,
  PostSubmissionPublishedPublicCommentsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { paginateArray } from '@dpr/libs'
import { filterByPaths } from '../utils/filter-by-paths'
import { sortBy } from '../utils/sort-by'
import { getApplication, getPublishedApplication } from '../applications'
import type { PostSubmissionFile } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/File.js'
import { filterByDateRange } from '../utils/filter-by-date-range'
import { getByPaths } from '../utils/get-by-paths'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'

interface FilterConfig {
  contentsPaths: string[]
  referencePaths: string[]
  publishedDatePath: string
  typePaths: string[]
  sortPaths: Record<string, string>
}

const defaultFilterConfig: FilterConfig = {
  contentsPaths: ['comment', 'commentRedacted'],
  referencePaths: ['data.application.reference'],
  publishedDatePath: 'metadata.publishedAt',
  typePaths: ['type'],
  sortPaths: {
    publishedAt: 'metadata.publishedAt',
    name: 'name'
  }
}

export const findApplicationPublicComments = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication,
  Q extends
    | PostSubmissionPublicCommentsQueryParams
    | PostSubmissionPublishedPublicCommentsQueryParams
>(
  query: Q,
  application: T,
  filterConfig: FilterConfig = defaultFilterConfig
) => {
  const summary = application?.comments?.public?.summary
  const allPublicComments = application?.comments?.public?.comments ?? []

  const filtered = filterByPaths(
    allPublicComments,
    query.query,
    filterConfig.contentsPaths
  )
  // filtered = getByPaths(filtered, query.type, filterConfig.typePaths)
  // filtered = filterByDateRange(
  //   filtered,
  //   query.publishedAtFrom,
  //   query.publishedAtTo,
  //   filterConfig.publishedDatePath
  // )
  // filtered = sortBy(
  //   filtered,
  //   query.sortBy,
  //   query.orderBy,
  //   filterConfig.sortPaths
  // )
  const { data, pagination } = paginateArray<PostSubmissionFile>(
    filtered,
    query.page,
    query.resultsPerPage,
    allPublicComments.length
  )

  console.log({
    data: {
      summary,
      data
    },
    pagination
  })
  return {
    data: {
      summary,
      data
    },
    pagination
  }
}

export const getAllApplicationPublicComments = (
  applicationId: string,
  query: PostSubmissionPublicCommentsQueryParams
) =>
  findApplicationPublicComments<
    PostSubmissionApplication,
    PostSubmissionPublicCommentsQueryParams
  >(query, getApplication(applicationId))

export const getAllPublishedApplicationPublicComments = (
  applicationId: string,
  query: PostSubmissionPublishedPublicCommentsQueryParams
) =>
  findApplicationPublicComments<
    PostSubmissionPublishedApplication,
    PostSubmissionPublishedPublicCommentsQueryParams
  >(query, getPublishedApplication(applicationId))
