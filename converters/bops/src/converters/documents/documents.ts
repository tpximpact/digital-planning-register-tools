import type { BopsDocumentsEndpoint } from '../../schemas/documents'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import type { PostSubmissionPublishedDocumentsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/documents/documents.ts'
import type { PostSubmissionPublishedDocumentsSearchParams } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/documents/documentsSearchParams.ts'
import { convertDocumentBopsFile } from './convertDocumentBopsFile'

export const bopsDocumentsEndpointToOdp = (
  input: BopsDocumentsEndpoint,
  searchParams: PostSubmissionPublishedDocumentsSearchParams,
  status: ApiResponseStatus
): PostSubmissionPublishedDocumentsEndpoint => {
  const documents = input.files || []
  const bopsPagination = input.metadata || { totalResults: 0 }
  const totalResults = bopsPagination.totalResults

  const convertedDocuments = documents.map((file) =>
    convertDocumentBopsFile(file)
  )
  const allDocuments = [...convertedDocuments]

  const resultsPerPage = searchParams.resultsPerPage ?? 10
  const currentPage = searchParams.page ?? 1

  // Calculate shown documents
  const startIdx = ((currentPage ?? 1) - 1) * (resultsPerPage ?? 10)
  const endIdx = startIdx + (resultsPerPage ?? 10)
  const data = allDocuments.slice(startIdx, endIdx)

  const finalTotalAvailableItems = totalResults
  const finalTotalResults = data.length
  const totalPages = Math.ceil(finalTotalAvailableItems / resultsPerPage)

  // put together valid pagination
  const pagination = {
    resultsPerPage,
    currentPage,
    totalPages,
    totalResults: finalTotalResults,
    totalAvailableItems: finalTotalAvailableItems
  }

  return {
    data: data.length > 0 ? data : null,
    pagination,
    status
  }
}
