import type { DprCommentSubmission } from './types/definitions'
import { getCouncilConfig } from './util/getCouncilConfig'
import { normaliseClientForEnv } from './util/normaliseClientForEnv'

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

export async function handleBopsPostRequest<T>(
  client: string,
  url: string,
  apiData: DprCommentSubmission
): Promise<T> {
  let apiUrl: string | undefined

  const dbConfig = await getCouncilConfig(client)
  if (dbConfig) {
    apiUrl = dbConfig.endpoint
  } else {
    const normalisedName = normaliseClientForEnv(client)
    const envUrlVar = `${normalisedName}_BOPS_API_URL`
    apiUrl = process.env[envUrlVar]
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
  console.log(fullUrl, 'fullUrl')
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(apiData)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.log('RAW ERROR RESPONSE FROM BOPS API:', errorText)

    throw {
      status: response.status,
      statusText: response.statusText,
      detail: errorText
    }
  }
  const responseData = await response.json()

  const data = JSON.parse(responseData)
  return {
    data,
    status: {
      code: response.status,
      message: response.statusText
    }
  } as T
}
