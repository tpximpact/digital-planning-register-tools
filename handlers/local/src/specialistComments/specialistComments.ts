import type {
  PostSubmissionSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { paginateArray } from '@dpr/libs'
import { filterByPaths } from '../utils/filter-by-paths'
import { getApplication, getPublishedApplication } from '../applications'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import type {
  Specialist,
  SpecialistRedacted
} from 'packages/odp-schemas/src/types/schemas/postSubmissionApplication/data/SpecialistComment'

interface FilterConfig {
  contentsPaths: string[]
  referencePaths: string[]
  publishedDatePath: string
  typePaths: string[]
  sortPaths: Record<string, string>
}

// @TODO
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

export const findApplicationSpecialists = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication,
  Q extends
    | PostSubmissionSpecialistsQueryParams
    | PostSubmissionPublishedSpecialistsQueryParams
>(
  query: Q,
  application: T,
  filterConfig: FilterConfig = defaultFilterConfig
) => {
  const summary = application?.comments?.public?.summary
  const allSpecialistComments =
    application?.comments?.specialist?.comments ?? []

  const filtered = filterByPaths<Specialist | SpecialistRedacted>(
    allSpecialistComments,
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
  const { data, pagination } = paginateArray<Specialist | SpecialistRedacted>(
    filtered,
    query.page,
    query.resultsPerPage,
    allSpecialistComments.length
  )

  return {
    data: {
      summary,
      data
    },
    pagination
  }
}

export const getAllApplicationSpecialistComments = (
  applicationId: string,
  query: PostSubmissionSpecialistsQueryParams
) =>
  findApplicationSpecialists<
    PostSubmissionApplication,
    PostSubmissionSpecialistsQueryParams
  >(query, getApplication(applicationId))

export const getAllPublishedApplicationSpecialistComments = (
  applicationId: string,
  query: PostSubmissionPublishedSpecialistsQueryParams
) =>
  findApplicationSpecialists<
    PostSubmissionPublishedApplication,
    PostSubmissionPublishedSpecialistsQueryParams
  >(query, getPublishedApplication(applicationId))
