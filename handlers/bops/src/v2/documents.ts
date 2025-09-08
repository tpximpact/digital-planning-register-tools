import type { ApiResponse } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.js'
import { handleBopsGetRequest } from '../requests'
import type { SearchParamsDocuments } from '../types'

export async function documents<T>(
  client: string,
  reference: string,
  searchParams?: SearchParamsDocuments
): Promise<ApiResponse<T> | null> {
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
    const request = await handleBopsGetRequest<ApiResponse<T>>(client, url)
    return request
  } catch (error) {
    console.error('Error fetching application documents:', error)
    let detail = 'Unknown error'
    if (error instanceof Error) {
      detail = error.message
    }
    return {
      data: null,
      status: {
        code: 500,
        message: 'Internal server error',
        detail
      }
    }
  }
}
