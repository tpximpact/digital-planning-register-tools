import { Elysia } from 'elysia'
import config from '../../config'
import { DprGetInfoError } from '../../errors'

/**
 * Plugin for elysia that ensures the request is authenticated.
 */
export const getInfo = new Elysia()
  .state('client', null as string | null)
  .state('service', null as string | null)
  .error({ DPR_GET_INFO_ERROR: DprGetInfoError })
  .onRequest((context) => {
    // Client requesting the data eg camden
    let client = context.request.headers.get('x-client')
    // Service making the request eg dpr, bops
    let service = context.request.headers.get('x-service')

    if (!client || !service) {
      if (config.environment === 'development') {
        if (!client) {
          client = 'development-client'
        }
        if (!service) {
          service = 'development-service'
        }
        console.warn(
          `[getInfo] Development environment missing headers defaulting to: Client: ${client}, Service: ${service}`
        )
      }

      if (config.debug) {
        console.error(
          `[getInfo] Missing required headers x-client and x-service`
        )
      }
      throw new DprGetInfoError(
        'Missing required headers x-client and x-service'
      )
    }

    if (config.debug) {
      console.info(
        `[getInfo] Client: ${client}, Service: ${service}, Request URL: ${context.request.url}`
      )
    }

    context.store.client = client
    context.store.service = service
  })

export default getInfo
