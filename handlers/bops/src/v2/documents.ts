import type { ApiResponse } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.js'
import { handleBopsGetRequest } from '../requests'
import type { SearchParamsDocuments } from '../types/types'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse'
import type { PostSubmissionDocumentsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/documents'
import { bopsDocumentsEndpointToOdp } from '@dpr/converter-bops/converters/documents/index.ts'
import type { BopsDocumentsEndpoint } from '@dpr/converter-bops/schemas/documents/documents.ts'

export async function documents(
  client: string,
  reference: string,
  searchParams?: SearchParamsDocuments
): Promise<PostSubmissionDocumentsEndpoint | null> {
  let url = `public/planning_applications/${reference}/documents`

  if (searchParams) {
    const params = new URLSearchParams({
      page: searchParams?.page?.toString(),
      resultsPerPage: searchParams?.resultsPerPage?.toString() ?? '10'
    })

    if (searchParams.name) {
      params.append('name', searchParams.name)
    }
    if (searchParams.sortBy) {
      params.append('sortBy', searchParams.sortBy)
    }
    if (searchParams.orderBy) {
      params.append('orderBy', searchParams.orderBy)
    }
    if (searchParams.type) {
      params.append('type', searchParams.type)
    }
    if (searchParams.publishedAtFrom && searchParams.publishedAtTo) {
      params.append('publishedAtFrom', searchParams.publishedAtFrom)
      params.append('publishedAtTo', searchParams.publishedAtTo)
    }
    url = `${url}?${params.toString()}`
  }

  try {
    const request = await handleBopsGetRequest<
      ApiResponse<BopsDocumentsEndpoint>
    >(client, url)
    if (!request || !request.data) {
      return null
    }

    const convertedData = bopsDocumentsEndpointToOdp(
      request.data,
      searchParams as SearchParamsDocuments,
      request.status as ApiResponseStatus
    )
    return convertedData
  } catch (error) {
    console.error('Error fetching application documents:', error)
    return null
  }
}
