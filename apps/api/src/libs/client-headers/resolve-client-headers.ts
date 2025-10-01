import type Elysia from 'elysia'
import { ClientHeadersError } from './client-headers.error'
import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { DEBUG } = ENV

/**
 * Plugin to add client and service to the context object
 * NB you will need to include require headers as well
 * to make sure everythings all present and correct
 *
 * @param app
 * @returns
 */
export const resolveClientHeaders = (app: Elysia) =>
  app.resolve(({ headers: { 'x-client': client, 'x-service': service } }) => {
    if (!client || !service) {
      if (DEBUG) {
        return { client: 'camden', service: 'testing' }
      } else {
        throw new ClientHeadersError(
          '[ClientHeadersError][resolveClientHeaders] Missing x-client or x-service header'
        )
      }
    }
    return { client, service }
  })
