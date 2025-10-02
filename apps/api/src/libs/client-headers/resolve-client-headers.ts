import type Elysia from 'elysia'
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
  app.resolve(({ request }) => {
    if (DEBUG) {
      console.log(`[ClientHeadersError][resolveClientHeaders] request received`)
    }

    let client = request.headers.get('x-client')
    let service = request.headers.get('x-service') ?? 'unknown'
    let handler = request.headers.get('x-handler')

    // Returns 'local' for cavyshire-borough-council or cavyshire-borough.
    // Returns 'bops' for anything else (with a placeholder for a future DB call).
    // If client is missing, throws an error unless debug is true, in which case it defaults to 'local'.
    if (!client) {
      if (DEBUG) {
        console.warn(
          `[ClientHeadersWarning][resolveClientHeaders] missing client header, defaulting to 'local' due to debug mode`
        )
        handler = 'local'
        client = 'cavyshire-borough-council'
        service = 'testing'
        // Optionally log service as well
      } else {
        console.error(
          `[ClientHeadersError][resolveClientHeaders] missing or invalid client header; unable to determine required handler`
        )
        throw new Error(
          'Missing or invalid client header; unable to determine required handler'
        )
      }
    } else if (
      client === 'cavyshire-borough-council' ||
      client === 'cavyshire-borough'
    ) {
      handler = 'local'
    } else {
      // Placeholder for future DB lookup for handler
      // e.g. context.handler = await fetchHandlerFromDB(client)
      handler = 'bops'
    }

    if (DEBUG) {
      console.log(
        `[ClientHeadersError][resolveClientHeaders] request from ${
          client ?? 'unknown'
        } via ${service ?? 'unknown'} using API handler: ${handler}`
      )
    }

    // Add these to the context
    return {
      client,
      service,
      handler
    }
  })
