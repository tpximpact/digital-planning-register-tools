import type Elysia from 'elysia'
import { ClientHeaders } from './client-headers.schema'
import { resolveClientHeaders } from './resolve-client-headers'

/**
 * Plugin to require the headers and add them to the context
 * NB The guard allows null as it converts it to "null"
 * the resolveHeaders plugin adds the values to the app context (and can be used on its own if needed)
 * @param app
 * @returns
 */
export const requireClientHeaders = (app: Elysia) =>
  app
    .guard({
      headers: ClientHeaders
    })
    .use(resolveClientHeaders)
