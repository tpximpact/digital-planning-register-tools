/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleBopsGetRequest } from '../requests'

export async function documents(
  client: string,
  reference: string,
  searchParams?: any
): Promise<any> {
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
    const request = await handleBopsGetRequest(client, url)
    return request
  } catch (error) {
    console.error('Error fetching documents:', error)
    const err = error as any
    return {
      data: null,
      status: {
        code: err.status || 500,
        message: err.statusText || 'Internal server error',
        detail:
          err.detail || (err instanceof Error ? err.message : 'Unknown error')
      }
    }
  }
}
