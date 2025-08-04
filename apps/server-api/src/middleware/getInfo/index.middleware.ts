import { Elysia } from 'elysia'
import config from '../../config'
import { DprGetInfoError } from '../../errors'
import { getPathFromRequest } from '@apps/server-api/libs'

/**
 * Plugin for elysia that ensures the request is authenticated.
 */
export const getInfo = new Elysia()
  .state('client', null as string | null)
  .state('service', null as string | null)
  .error({ DPR_GET_INFO_ERROR: DprGetInfoError })
  .onRequest((context) => {
    const reqPath = getPathFromRequest(context.request)

    // No need for client/service headers for '/', documentation or healthcheck routes
    if (
      reqPath === '/' ||
      reqPath.startsWith('/docs') ||
      reqPath === '/healthcheck' ||
      reqPath === '/swagger'
    ) {
      return
    }

    // Client requesting the data eg camden
    const client = context.request.headers.get('x-client')
    // Service making the request eg dpr, bops
    const service = context.request.headers.get('x-service')

    if (config.debug) {
      console.info(
        `[getInfo] ${reqPath}: Client: ${client}, Service: ${service}`
      )
    }

    if (!client || !service) {
      if (config.debug) {
        console.error(
          `[getInfo] ${reqPath}: Missing required headers x-client and x-service`
        )
      }
      throw new DprGetInfoError(
        `Missing required headers x-client and x-service`
      )
    }

    context.store.client = client
    context.store.service = service
  })

export default getInfo
