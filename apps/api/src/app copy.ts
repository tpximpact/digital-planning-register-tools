import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { config } from './config'
import { standardResponses } from './libs/standard-responses'
import { handleErrors } from './libs/handle-errors'

import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { requireClientHeaders } from './libs/client-headers'

import { app as handlerBops } from '@dpr/handler-bops'

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
  return new Elysia({
    name: '@dpr/api'
  })
    .use(cors({ origin: true }))
    .use(
      openapi({
        enabled: true,
        path: '/docs',
        // provider: 'swagger-ui',
        provider: 'scalar',
        // provider: 'swagger-ui',
        swagger: {
          persistAuthorization: true
        },
        scalar: {},
        references: {},
        // exclude: {
        //   // staticFile: true,
        //   // paths: ['/', '/*']
        //   // methods: ['OPTIONS']
        //   // tags: ['default']
        // },
        documentation: {
          info: {
            title: 'Digital planning data schema',
            description: 'This is the API documentation for the ODP schema',
            version: '3.1.0'
          },
          externalDocs: {
            description: 'Digital planning data schema',
            url: 'https://github.com/theopensystemslab/digital-planning-data-schemas'
          },
          // components: {
          //   securitySchemes: {
          //     basicAuth: {
          //       type: 'http',
          //       scheme: 'basic'
          //     }
          //   }
          // },
          // security: [{ basicAuth: [] }],
          tags: [
            {
              name: 'Internal',
              description: 'Internal endpoints, for DPR use',
              externalDocs: {
                description: 'Find more info here',
                url: 'https://planningregister.org'
              }
            },
            {
              name: 'Public',
              description:
                'Endpoints that do not require authentication and return non-sensitive data'
            },
            {
              name: 'Private',
              description:
                'Endpoints that require authentication and return sensitive data'
            },
            {
              name: 'BOPS Handler',
              description:
                'Handler for BOPS data source that convert requests and responses (e.g. BOPS, etc.)'
            }
          ]
        }
      })
    )
    .use(standardResponses)
    .use(requireClientHeaders)
    .get(
      '/',
      () => {
        return {
          data: null,
          status: {
            code: 200,
            message: 'OK'
          }
        }
      },
      {
        response: 'empty200'
      }
    )
    .get('/bad-request', ({ set }) => {
      set.status = 400
      return {
        data: null,
        status: {
          code: 400,
          message: 'Bad Request'
        }
      }
    })
    .get('/not-found', ({ set }) => {
      set.status = 404
      return {
        data: null,
        status: {
          code: 404,
          message: 'Not Found'
        }
      }
    })
    .get('/internal-server-error', ({ set }) => {
      set.status = 500
      return {
        data: null,
        status: {
          code: 500,
          message: 'Internal Server Error'
        }
      }
    })
    .group('/api/@next', (app) => {
      return app
        .use(applications)
        .use(documents)
        .use(publicComments)
        .use(specialistComments)
    })
    .group('/api/handlers/bops', (app) => {
      return app.use(
        handlerBops({
          debug: options.debug,
          enabled: true,
          openApiEnabled: false
        })
      )
    })
    .use(handleErrors)
}

export { app }
export type App = typeof app
