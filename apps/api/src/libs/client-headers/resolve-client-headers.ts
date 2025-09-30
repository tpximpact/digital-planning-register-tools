import type Elysia from 'elysia'
import { ClientHeadersError } from './client-headers.error'

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
      throw new ClientHeadersError(
        '[ClientHeadersError][resolveClientHeaders] Missing x-client or x-service header'
      )
    }
    return { client, service }
  })
