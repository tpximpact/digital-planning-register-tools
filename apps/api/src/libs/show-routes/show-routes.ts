import type Elysia from 'elysia'
import { t } from 'elysia'

/**
 * Plugin to show all routes in the application.
 *
 * @param app
 * @returns
 */
export const showRoutes = (debug: boolean) => (app: Elysia) => {
  if (debug) {
    app.get(
      '/',
      ({ headers, query }) => {
        const applicationId = query.applicationId
        return app.routes.map((route) => {
          let path = `http://${headers.host}${route.path}`
          path = applicationId
            ? path.replace(':applicationId', applicationId)
            : path
          return {
            method: route.method,
            path
          }
        })
      },
      {
        query: t.Object({
          applicationId: t.Optional(t.String())
        }),
        description: 'Show all routes in the application'
      }
    )
  }
  return app
}
