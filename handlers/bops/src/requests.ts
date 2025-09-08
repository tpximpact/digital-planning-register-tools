interface ClientConfig {
  endpoint: string
}

/**
 * Converts a client identifier (e.g., "camden-council")
 * into the format needed for environment variables (e.g., "CAMDEN_COUNCIL").
 */
function normaliseClientForEnv(clientIdentifier: string): string {
  return clientIdentifier.replace(/-/g, '_').toUpperCase()
}

/**
 * Fetches the configuration for a given council from the admin service.
 */
async function getCouncilConfig(council: string): Promise<ClientConfig | null> {
  try {
    const response = await fetch(
      `${process.env.ADMIN_API_URL}/api/internal/clients/${council}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`
        }
      }
    )
    console.log(response, 'response from admin service')

    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Admin service returned status ${response.status}`)
    }

    const config: ClientConfig = await response.json()

    return config
  } catch (error) {
    console.error(
      `Failed to fetch config for ${council} from admin service:`,
      error
    )
    return null
  }
}

/**
 * Handles a GET request to a back-office planning system .
 * It determines the correct API URL and key for the client and makes the request.
 */
export async function handleBopsGetRequest<T>(
  client: string,
  url: string
): Promise<T> {
  let apiUrl: string | undefined

  const dbConfig = await getCouncilConfig(client)
  if (dbConfig) {
    apiUrl = dbConfig.endpoint
    console.log(`Using API URL from DB for client ${client}: ${apiUrl}`)
  } else {
    const normalisedName = normaliseClientForEnv(client)
    const envUrlVar = `${normalisedName}_BOPS_API_URL}`
    apiUrl = process.env[envUrlVar]
    console.log(`Using API URL from .env for client ${client}: ${apiUrl}`)
  }

  if (!apiUrl) {
    throw new Error(
      `API URL for client '${client}' not found in database or .env file.`
    )
  }

  const normalisedNameForKey = normaliseClientForEnv(client)
  const envApiKeyVar = `${normalisedNameForKey}_BOPS_API_KEY`
  const apiKey = process.env[envApiKeyVar]
  if (!apiKey) {
    throw new Error(`API Key for client '${client}' not found in .env file.`)
  }

  const fullUrl = `${apiUrl}${url}`

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw {
      status: response.status,
      statusText: response.statusText,
      detail: errorData
    }
  }

  const data = await response.json()
  return {
    data,
    status: {
      code: response.status,
      message: response.statusText
    }
  } as T
}
