import type { ApiResponse } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.js'
import { handleBopsGetRequest } from '../requests'

export async function show<T>(
  client: string,
  reference: string
): Promise<ApiResponse<T> | null> {
  try {
    const request = await handleBopsGetRequest<ApiResponse<T>>(
      client,
      `public/planning_applications/${reference}`
    )

    return request
  } catch (error) {
    console.error('Error fetching application data:', error)
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
