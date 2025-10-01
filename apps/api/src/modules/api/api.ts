import { Elysia } from 'elysia'
import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { DEBUG } = ENV

/**
 * this macro adds the name of the handler to every route add handler: true to the route options
 * it also checks for the presence of x-client and x-service headers
 * and throws an error if they are missing (unless DEBUG is true)
 */
export const api = new Elysia({ name: 'Api.Service' }).macro({
  handler: {
    beforeHandle({ request }) {
      const client = request.headers.get('x-client')
      const service = request.headers.get('x-service')
      if (!client || !service) {
        if (DEBUG) {
          console.warn(
            `[API][handler] missing client or service header, allowing due to debug mode`
          )
        } else {
          console.error(`[API][handler] missing client or service header`)
          throw new Error('[API][handler] missing client or service header')
        }
      }
    },
    resolve({ request: { headers } }) {
      let handler = undefined
      const client = headers.get('x-client')
      const service = headers.get('x-service')

      // Returns 'local' for cavyshire-borough-council or cavyshire-borough.
      // Returns 'bops' for anything else (with a placeholder for a future DB call).
      // If client is missing, throws an error unless debug is true, in which case it defaults to 'local'.
      if (!client) {
        if (DEBUG) {
          console.warn(
            `[API][handler] missing client header, defaulting to 'local' due to debug mode`
          )
          handler = 'local'
          // Optionally log service as well
        } else {
          console.error(`[API][handler] missing client header`)
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

      console.log(
        `[API][handler] request from ${client ?? 'unknown'} via ${
          service ?? 'unknown'
        } using API handler: ${handler}`
      )

      // Add these to the context
      return {
        client,
        service,
        handler
      }
    }
  }
})
