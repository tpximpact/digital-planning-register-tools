import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { config, documentation } from './config'
import { standardResponses } from './libs/standard-responses'
import { handleErrors } from './libs/handle-errors'

import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { requireClientHeaders } from './libs/client-headers'

import { app as handlerBops } from '@dpr/handler-bops'
import { showRoutes } from './libs/show-routes'

/**
 * @file Types for authentication middleware
 */
export interface ApiOptions {
  enabled: boolean
  debug: boolean
  prefix?: string
}

const defaultOptions: ApiOptions = {
  enabled: true,
  debug: config.debug || false,
  prefix: ''
}

const app = (userOptions?: ApiOptions) => {
  const options: ApiOptions = {
    ...defaultOptions,
    ...userOptions
  }

  if (options.debug) {
    console.info(`[@dpr/api] options: ${JSON.stringify(options)}`)
  }
  return (
    new Elysia({
      name: '@dpr/api'
    })
      .use(cors({ origin: true }))
      .use(showRoutes(options.debug))
      .use(
        openapi({
          enabled: true,
          path: '/docs',
          provider: 'scalar',
          documentation
        })
      )
      .use(
        openapi({
          enabled: true,
          path: '/swagger',
          provider: 'swagger-ui',
          documentation
        })
      )
      .use(standardResponses)
      .group('/api/@next', (app) => {
        return app
          .use(applications)
          .use(documents)
          .use(publicComments)
          .use(specialistComments)
      })
      // .group('/api/handlers/bops', (app) => {
      //   return app.use(
      //     handlerBops({
      //       debug: options.debug,
      //       enabled: true
      //     })
      //   )
      // })
      .use(handleErrors)
  )
}

export { app }
export type App = typeof app
