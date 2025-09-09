import type { BopsDocumentsEndpoint } from '../../schemas/documents'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import type { PostSubmissionDocumentsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/documents/documents.ts'
import type { PostSubmissionDocumentsSearchParams } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/documents/documentSearchParams.ts'
import { convertDocumentBopsFile } from './convertDocumentBopsFile'

export const bopsDocumentsEndpointToOdp = (
  input: BopsDocumentsEndpoint,
  searchParams: PostSubmissionDocumentsSearchParams,
  status: ApiResponseStatus
): PostSubmissionDocumentsEndpoint => {
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
