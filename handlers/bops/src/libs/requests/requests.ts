/**
 * Retrieves the API key and URL for a specific client from the environment variables.
 * @param client The client identifier.
 * @returns An object containing the API key and URL for the client.
 */
export const getClientConfig = (client: string) => {
  const key = `${client.toUpperCase()}_BOPS_API_KEY`
  const url = `${client.toUpperCase()}_BOPS_API_URL`
  const apiKey = process.env?.[key]
  const apiUrl = process.env?.[url]

  if (!apiKey)
    throw new Error(`API Key for client '${client}' not found in .env file.`, {
      cause: 'Council not registered'
    })
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
    return {
      data: null,
      status: {
        ...status,
        detail: errorData?.error?.detail || 'An error occurred'
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
