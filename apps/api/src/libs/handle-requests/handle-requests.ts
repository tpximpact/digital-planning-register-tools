import { standardResponseObjects } from '../standard-responses'
import { createUrlSearchParams } from '@dpr/libs'
import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { DEBUG } = ENV
/**
 * Proxies a GET request to a BOPS handler, forwarding headers and query params.
 * @param baseUrl The base URL for the BOPS handler (e.g. http://localhost:4000/api/handlers/bops)
 * @param path The path to append (e.g. /public/applications/:applicationId/publicComments)
 * @param query Query params object
 * @param client x-client header value
 * @param service x-service header value
 */
export async function proxyBopsGet({
  baseUrl,
  path,
  query,
  client,
  service
}: {
  baseUrl: string
  path: string
  query?: Record<string, unknown>
  client: string
  service: string
}) {
  try {
    const url = `${baseUrl}${path}${
      query ? `?${createUrlSearchParams(query).toString()}` : ''
    }`
    if (DEBUG) {
      console.log(
        `[ProxyBopsGet][proxyBopsGet] Proxying GET request to BOPS handler at ${url} for client ${client} via service ${service}`
      )
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-client': client,
        'x-service': `DPR on behalf of ${service}`
      }
    })
    return await response.json()
  } catch (error) {
    return {
      data: null,
      status: {
        code: 500,
        message: 'Failed to fetch from BOPS handler',
        detail: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

/**
 * Helper function to wrap fetch calls with error handling.
 * @param fetchFn
 * @param set
 * @param errorDetail
 * @returns
 */
export function handleRequests<T>(
  fetchFn: (client: string, service: string) => Promise<T>,
  setStatus: (code: number) => void,
  errorDetail = 'An error occurred while fetching applications',
  client = '',
  service = ''
): Promise<
  | T
  | {
      data: null
      status: typeof standardResponseObjects.BadRequestResponseObject & {
        detail: string
      }
    }
> {
  return fetchFn(client, service).catch((e: unknown) => {
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
