import type { PostSubmissionFile } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PostSubmissionFile.ts'
import { convertDocumentBopsFile } from '@dpr/converter-bops/converters/documents/convertDocumentBopsFile.ts'
import type { BopsDocumentsEndpoint } from '@dpr/converter-bops/schemas/bops/documents/documents.ts'
import { paginateArray } from '@dpr/libs'
import type { PostSubmissionPublishedDocumentsQueryParams } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'

/**
 * Filters, sorts, and paginates Bops document results based on query parameters.
 *
 * @param bopsResponse - The raw BopsDocumentsEndpoint response.
 * @param query - Query parameters for filtering, sorting, and pagination.
 * @param response - The HTTP response object (for status).
 * @returns An object containing paginated, filtered, and sorted documents, pagination info, and status.
 */
export const filterResults = (
  bopsResponse: BopsDocumentsEndpoint,
  query: PostSubmissionPublishedDocumentsQueryParams,
  response: Response
) => {
  let filtered = false

  const allDocuments: PostSubmissionFile[] = (bopsResponse.files ?? [])
    .map((file) => convertDocumentBopsFile(file))
    .filter((doc): doc is PostSubmissionFile => !!doc)

  const filteredDocuments = allDocuments.filter((doc) => {
    if (!doc) return false

    // Filter by publishedAt range if both are provided
    const publishedAtFrom = query.publishedAtFrom
    const publishedAtTo = query.publishedAtTo
    if (publishedAtFrom && publishedAtTo && doc.metadata?.publishedAt) {
      const publishedAt = new Date(doc.metadata.publishedAt).getTime()
      const from = new Date(publishedAtFrom).getTime()
      const to = new Date(publishedAtTo).getTime()
      if (publishedAt < from || publishedAt > to) {
        filtered = true
        return false
      }
    }

    // Filter by type
    const type = query.type
    if (type) {
      if (!doc.type.includes(type)) {
        filtered = true
        return false
      }
    }

    return true
  })

  const sortBy = query.sortBy === 'name' ? 'name' : 'metadata.publishedAt'
  const orderBy = query.orderBy === 'asc' ? 'asc' : 'desc'
  const sortedDocuments = sortResults(filteredDocuments, sortBy, orderBy)

  const { data, pagination } = paginateArray<PostSubmissionFile>(
    sortedDocuments,
    query.page,
    query.resultsPerPage
  )

  return {
    data,
    pagination: {
      ...pagination,
      ...(filtered
        ? { totalAvailableItems: allDocuments.length }
        : { totalAvailableItems: pagination.totalResults })
    },
    status: {
      code: response.status,
      message: response.statusText
    }
  }
}

/**
 * Sorts an array of PostSubmissionFile documents by published date or name.
 *
 * @param docs - Array of PostSubmissionFile documents.
 * @param sortBy - Field to sort by ('metadata.publishedAt' or 'name').
 * @param orderBy - Sort order ('asc' or 'desc').
 * @returns The sorted array of documents.
 */
export const sortResults = (
  docs: PostSubmissionFile[],
  sortBy: 'metadata.publishedAt' | 'name' = 'metadata.publishedAt',
  orderBy: 'asc' | 'desc' = 'desc'
) => {
  return docs.sort((a, b) => {
    let aValue: number | string = ''
    let bValue: number | string = ''

    if (sortBy === 'metadata.publishedAt') {
      aValue = a?.metadata?.publishedAt
        ? new Date(a.metadata.publishedAt).getTime()
        : 0
      bValue = b?.metadata?.publishedAt
        ? new Date(b.metadata.publishedAt).getTime()
        : 0
    } else if (sortBy === 'name') {
      aValue = a?.name ?? ''
      bValue = b?.name ?? ''
    }

    if (aValue < bValue) return orderBy === 'asc' ? -1 : 1
    if (aValue > bValue) return orderBy === 'asc' ? 1 : -1
    return 0
  })
}
