import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { standardResponseObjects } from '@dpr/api'

/**
 * Retrieves the API key and URL for a specific client from the environment variables.
 * @param client The client identifier.
 * @returns An object containing the API key and URL for the client.
 */
export const getClientConfig = (client: string) => {
  // const key = `${client.toUpperCase()}_BOPS_API_KEY`
  const url = `${client.toUpperCase()}_BOPS_API_URL`
  // const apiKey = process.env?.[key]
  const apiKey = undefined
  const apiUrl = process.env?.[url]

  // if (!apiKey)
  //   throw new Error(`API Key for client '${client}' not found in .env file.`, {
  //     cause: 'Council not registered'
  //   })
  if (!apiUrl)
    throw new Error(`API URL for client '${client}' not found in .env file.`, {
      cause: 'Council not registered'
    })

  return { apiKey, apiUrl }
}

/**
 * Handles the response from a fetch request.
 * @param response The fetch Response object.
 * @param conversionCallback Optional callback to transform the response.
 * @returns A promise that resolves to the response data or an error object.
 */
const handleResponse = async <T>(
  response: Response,
  conversionCallback?: (response: Response) => unknown
): Promise<T> => {
  const status = {
    code: response.status,
    message: response.statusText
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const detail =
      errorData && typeof errorData === 'object' && 'error' in errorData
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (errorData as any).error?.detail
        : 'An error occurred'
    return {
      data: null,
      status: {
        ...status,
        detail
      }
    } as T
  }

  if (conversionCallback) {
    return (await conversionCallback(response)) as T
  } else {
    const data = await response.json()
    return {
      data,
      status
    } as T
  }
}

/**
 * Handles a GET request to a back-office planning system .
 * It determines the correct API URL and key for the client and makes the request.
 * @TODO connect to database to fetch API URL
 */
export async function handleBopsGetRequest<T>(
  client: string,
  url: string,
  conversionCallback?: (response: Response) => unknown
): Promise<T> {
  const { apiUrl } = getClientConfig(client)
  console.log(`[handleBopsGetRequest] ${apiUrl}${url}`)
  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'GET'
    })
    return await handleResponse<T>(response, conversionCallback)
  } catch (error) {
    return {
      data: null,
      status: {
        code: 500,
        message: 'Internal server error',
        detail: (error as Error).message
      }
    } as T
  }
}

export async function handleBopsPostRequest<T, U>(
  client: string,
  url: string,
  apiData: T
): Promise<U> {
  const { apiKey, apiUrl } = getClientConfig(client)
  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(apiData)
    })
    return await handleResponse<U>(response)
  } catch (error) {
    return {
      data: null,
      status: {
        code: 500,
        message: 'Internal server error',
        detail: (error as Error).message
      }
    } as U
  }
}

/**
 * Gets the status from a fetch Response object.
 * @param response
 * @returns
 */
export function getStatusFromRequest(response: Response): ApiResponseStatus {
  return {
    code: response.status,
    message: response.statusText
  }
}

/**
 * Helper function to wrap fetch calls with error handling.
 * @param fetchFn
 * @param set
 * @param errorDetail
 * @returns
 */
export function withErrorHandling<T>(
  fetchFn: () => Promise<T>,
  setStatus: (code: number) => void,
  errorDetail = 'An error occurred while fetching applications'
): Promise<
  | T
  | {
      data: null
      status: typeof standardResponseObjects.BadRequestResponseObject & {
        detail: string
      }
    }
> {
  return fetchFn().catch((e: unknown) => {
    console.error(errorDetail + ':', e)
    setStatus(standardResponseObjects.BadRequestResponseObject.code)
    return {
      data: null,
      status: {
        ...standardResponseObjects.BadRequestResponseObject,
        detail: `${errorDetail}: ${e instanceof Error ? e.message : String(e)}`
      }
    }
  })
}
