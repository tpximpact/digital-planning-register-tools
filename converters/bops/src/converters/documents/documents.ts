import type { BopsDocumentsEndpoint } from '../../schemas/bops/documents'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import type {
  PostSubmissionPublishedDocumentsResponse,
  PostSubmissionPublishedDocumentsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { convertDocumentBopsFile } from './convertDocumentBopsFile'
import { paginateArray } from '@dpr/libs'
import type { PostSubmissionFile } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PostSubmissionFile'

export const bopsDocumentsEndpointToOdp = (
  input: BopsDocumentsEndpoint,
  searchParams: PostSubmissionPublishedDocumentsQueryParams,
  status: ApiResponseStatus
): PostSubmissionPublishedDocumentsResponse => {
  const allDocuments = (input.files ?? [])
    .map((file) => convertDocumentBopsFile(file))
    .filter((doc) => doc !== undefined)
    .sort((a, b) => {
      const aDate = a?.metadata?.publishedAt
        ? new Date(a.metadata.publishedAt).getTime()
        : 0
      const bDate = b?.metadata?.publishedAt
        ? new Date(b.metadata.publishedAt).getTime()
        : 0
      return bDate - aDate // Most recent first
    })

  const { data, pagination } = paginateArray<PostSubmissionFile>(
    allDocuments,
    searchParams.page,
    searchParams.resultsPerPage
  )

  return {
    data,
    pagination,
    status
  }
}
