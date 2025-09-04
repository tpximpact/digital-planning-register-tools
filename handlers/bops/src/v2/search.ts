import { handleBopsGetRequest } from '../requests'

// TODO: Use proper types here instead of any
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function search(client: string, searchParams?: any): Promise<any> {
  let url = `public/planning_applications/search`

  if (searchParams) {
    const params = new URLSearchParams()
    for (const key in searchParams) {
      if (searchParams[key] !== undefined && searchParams[key] !== null) {
        params.append(key, searchParams[key].toString())
      }
    }
    url = `${url}?${params.toString()}`
  }

  const request = await handleBopsGetRequest(client, url)
  const applications = request.data || []
  const pagination = request.pagination || {}

  return {
    ...request,
    data: {
      applications,
      pagination
    }
  }
}
