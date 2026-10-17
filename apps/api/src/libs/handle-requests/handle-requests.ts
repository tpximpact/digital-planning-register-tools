import { standardResponseObjects } from '../standard-responses'
import { createUrlSearchParams } from '@dpr/libs'
import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { DEBUG } = ENV

/**
 * Retrieves the API key and URL for a specific client from the environment variables.
 * @param client The client identifier.
 * @returns An object containing the API key and URL for the client.
 */
export const getClientConfig = (client: string) => {
  // const key = `${client.toUpperCase()}_API_KEY`
  const url = `${client.toUpperCase().replace('-', '_')}_API_URL`
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

export const notHandled = {
  data: null,
  status: { code: 200, message: 'Not currently handled' }
}

export const notImplemented = {
  data: null,
  status: { code: 200, message: '@TODO implement example data endpoint' }
}

/** Every field is optional because handler responses mark `status` and `pagination` as optional. */
interface EnvelopeSource {
  data?: unknown
  status?: unknown
  pagination?: unknown
}

/**
 * Normalise a handler result into the standard response envelope.
 * Only includes `pagination` when the handler returned one.
 */
export const toEnvelope = <T extends EnvelopeSource>(result: T) => {
  const { data, status, pagination } = result
  return pagination ? { data, pagination, status } : { data, status }
}

/**
 * Picks the implementation for the current handler. Handlers that are not
 * registered fall back to the shared example response, so each route only
 * declares the handlers it really supports.
 */
export type HandlerMap = Record<string, () => unknown>

export const dispatch = (handler: string, handlers: HandlerMap) => {
  const fn = Object.hasOwn(handlers, handler) ? handlers[handler] : undefined
  return fn ? fn() : notImplemented
}

/**
 * Placeholder map for routes without a real implementation yet.
 * Hoisted so no object is allocated per request. Replace it with an
 * inline map when a route gets a bops or external implementation.
 */
export const unhandled: HandlerMap = { bops: () => notHandled }

/** Wraps a bops fetcher so its result is always returned as an envelope. */
export const envelope =
  <T extends EnvelopeSource>(fn: () => Promise<T>) =>
  async () =>
    toEnvelope(await fn())

/**
 * headers that must not be forwarded
 * accept-encoding is dropped so fetch decodes the body itself, which avoids
 * returning a decoded body with a stale content-encoding header.
 */
const STRIPPED_HEADERS = [
  'host',
  'content-length',
  'connection',
  'accept-encoding'
] as const

const API_PREFIX = '/api/@next'

/**
 * Forwards the incoming request to the client's own API, keeping the method and
 * query string. The upstream path is the request path without the API prefix, so
 * `/api/@next/public/applications/1` goes to `<apiUrl>/public/applications/1` and
 * the private routes keep their own paths. Because nothing is typed by hand per
 * route, a public route can not end up on a private upstream path.
 *
 * Pass the parsed `body` for routes that have one (Elysia has already consumed
 * the request stream by then). The upstream Response is returned as is, so
 * Elysia streams it through.
 */
export const proxy = (client: string, request: Request, body?: unknown) => {
  const { apiUrl } = getClientConfig(client)
  const { pathname, search } = new URL(request.url)

  const start = pathname.indexOf(API_PREFIX)
  const path =
    start === -1 ? pathname : pathname.slice(start + API_PREFIX.length)

  const headers = new Headers(request.headers)
  for (const name of STRIPPED_HEADERS) headers.delete(name)

  const hasBody = body !== undefined
  if (hasBody) headers.set('content-type', 'application/json')

  const url = `${apiUrl}${path}${search}`
  if (DEBUG) console.info(`[handle-requests][proxy] ${request.method} ${url}`)

  return fetch(url, {
    method: request.method,
    headers,
    body: hasBody ? JSON.stringify(body) : undefined
  })
}

/**
 * @deprecated
 * Proxies a GET request to a BOPS handler, forwarding headers and query params.
 * @param baseUrl The base URL for the BOPS handler (e.g. http://localhost:4000/api/handlers/bops)
 * @param path The path to append (e.g. /public/applications/:applicationId/publicComments)
 * @param query Query params object
 * @param client x-client header value
 * @param service x-service header value
 */
export async function proxyBopsGet<T>({
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
}): Promise<
  | T
  | {
      data: null
      status: typeof standardResponseObjects.BadRequestResponseObject & {
        detail: string
      }
    }
> {
  try {
    const url = `${baseUrl}${path}${
      query ? `?${createUrlSearchParams(query).toString()}` : ''
    }`
    if (DEBUG) {
      console.info(
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
    const data = await response.json()
    return data as T
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
 * @deprecated
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
