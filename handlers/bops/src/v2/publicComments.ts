/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Use proper types here instead of any

import { handleBopsGetRequest } from '../requests'

export async function publicComments(
  client: string,
  reference: string
): Promise<any> {
  try {
    const request = await handleBopsGetRequest(
      client,
      `public/planning_applications/${reference}/comments/public`
    )

    return request
  } catch (error) {
    console.error('Error fetching application data:', error)
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
