import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { config, documentation } from './config'
import { standardResponses } from './libs/standard-responses'
import { handleErrors } from './libs/handle-errors'

import { app as handlerBops } from '@dpr/handler-bops'
import { showRoutes } from './libs/show-routes'
import { SchemaModel } from './schema'
import { api } from './modules/api'
import { requireClientHeaders } from './libs/client-headers'
import { proxyBopsGet } from './libs/handle-requests'

import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { API_BASE_URL } = ENV

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
          // exclude: {
          //   tags: ['BOPS Handler']
          // },
          documentation
          // references: fromTypes(
          //   ENVIRONMENT === 'production' ? 'dist/index.d.ts' : 'index.ts',
          //   {
          //     projectRoot: path.join('', import.meta.dir),
          //     tsconfigPath: path.join('..', import.meta.dir, 'tsconfig.json')
          //   }
          // )
        })
      )
      .use(
        openapi({
          enabled: true,
          path: '/swagger',
          provider: 'swagger-ui',
          exclude: {
            paths: ['/api/handlers/bops']
          },
          documentation
          // references: fromTypes(
          //   ENVIRONMENT === 'production' ? 'dist/index.d.ts' : 'index.ts',
          //   {
          //     projectRoot: path.join('', import.meta.dir),
          //     tsconfigPath: path.join('..', import.meta.dir, 'tsconfig.json')
          //   }
          // )
        })
      )
      .use(standardResponses)
      .use(SchemaModel)
      .use(handleErrors(options))
      // .group('/api/@next', (app) => {
      //   return app
      //     .use(applications)
      //     .use(documents)
      //     .use(publicComments)
      //     .use(specialistComments)
      // })
      .group('/api/handlers/bops', (app) => {
        return app.use(
          handlerBops({
            debug: options.debug,
            enabled: true
          })
        )
      })
      // .use(api)
      .use(requireClientHeaders)
      .group(
        '/api/@next',
        {
          // handler: true,
          detail: {
            tags: ['Private']
          }
        },
        (app) =>
          app
            .use(api)
            .get(
              `/applications`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                query: 'applications.all.query',
                response: {
                  200: 'applications.all.response'
                },
                detail: {
                  tags: ['Private'],
                  summary: 'Get applications',
                  description:
                    'Retrieves an unredacted list of all applications, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'applications.single.params',
                response: {
                  200: 'applications.single.response'
                },
                detail: {
                  summary: 'Get application',
                  description:
                    'Retrieves a single unredacted application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'documents.all.params',
                query: 'documents.all.query',
                response: {
                  200: 'documents.all.response'
                },
                detail: {
                  summary: 'Get documents',
                  description:
                    'Retrieves a list of all unredacted documents for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents/:documentId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'documents.single.params',
                response: {
                  200: 'documents.single.response'
                },
                detail: {
                  summary: 'Get document',
                  description:
                    'Retrieves a single unredacted application document information, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'publicComments.all.params',
                query: 'publicComments.all.query',
                response: {
                  200: 'publicComments.all.response'
                },
                detail: {
                  summary: 'Get public comments',
                  description:
                    'Retrieves a list of all public comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments/:publicCommentId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'publicComments.all.params',
                response: {
                  200: 'publicComments.all.response'
                },
                detail: {
                  summary: 'Get public comment',
                  description:
                    'Retrieves a single application public comment, currently uses x-client header to filter by client'
                }
              }
            )
            .post(
              `/applications/:applicationId/publicComments`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'publicComments.submit.params',
                body: 'publicComments.submit.body',
                response: {
                  200: 'empty200'
                },
                detail: {
                  security: [], // Remove this to make endpoint public
                  summary: 'Send public comment',
                  description:
                    'Creates a new public comment for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'specialists.all.params',
                query: 'specialists.all.query',
                response: {
                  200: 'specialists.all.response'
                },
                detail: {
                  summary: 'Get specialist comments',
                  description:
                    'Retrieves a list of all specialists and their comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments/:specialistId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'specialists.single.params',
                response: {
                  200: 'specialists.single.response'
                },
                detail: {
                  summary: 'Get specialist',
                  description:
                    "Retrieves a single specialist's comments, currently uses x-client header to filter by client"
                }
              }
            )
      )
      .group(
        '/api/@next/public',
        {
          // handler: true,
          detail: {
            tags: ['Public']
          }
        },
        (app) =>
          app
            .get(
              `/applications`,
              async ({ handler, client, service, query }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                query: 'public.applications.all.query',
                response: {
                  200: 'public.applications.all.response'
                },
                detail: {
                  summary: 'Get published applications',
                  description:
                    'Retrieves a redacted list of all applications, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId`,
              async ({ handler, client, service, query, params }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications/${params.applicationId}`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.applications.single.params',
                response: {
                  200: 'public.applications.single.response'
                },
                detail: {
                  summary: 'Get published application',
                  description:
                    'Retrieves a single redacted application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents`,
              async ({ handler, client, service, query, params }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications/${params.applicationId}/documents`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.documents.all.params',
                query: 'public.documents.all.query',
                response: {
                  200: 'public.documents.all.response'
                },
                detail: {
                  summary: 'Get published documents',
                  description:
                    'Retrieves a list of all redacted documents for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents/:documentId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.documents.single.params',
                response: {
                  200: 'public.documents.single.response'
                },
                detail: {
                  summary: 'Get published document',
                  description:
                    'Retrieves a single redacted application document information, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments`,
              async ({ handler, client, service, query, params }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications/${params.applicationId}/publicComments`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.publicComments.all.params',
                query: 'public.publicComments.all.query',
                response: {
                  200: 'public.publicComments.all.response'
                },
                detail: {
                  summary: 'Get published public comments',
                  description:
                    'Retrieves a list of all published public comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments/:publicCommentId`,
              async ({ handler }) => {
                switch (handler) {
                  case 'bops':
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: 'Not currently handled'
                      }
                    }
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.publicComments.single.params',
                response: {
                  200: 'public.publicComments.single.response'
                },
                detail: {
                  summary: 'Get published public comment',
                  description:
                    'Retrieves a single published application public comment, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments`,
              async ({ handler, client, service, query, params }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications/${params.applicationId}/specialistComments`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.specialists.all.params',
                query: 'public.specialists.all.query',
                response: {
                  200: 'public.specialists.all.response'
                },
                detail: {
                  tags: ['Public'],
                  security: [], // Remove this to make endpoint public
                  summary: 'Get published specialist comments',
                  description:
                    'Retrieves a list of all published specialists and their comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments/:specialistId`,
              async ({ handler, client, service, query, params }) => {
                switch (handler) {
                  case 'bops':
                    return proxyBopsGet({
                      baseUrl: API_BASE_URL,
                      path: `/api/handlers/bops/public/applications/${params.applicationId}/specialistComments/${params.specialistId}`,
                      query,
                      client,
                      service
                    })
                  default:
                    return {
                      data: null,
                      status: {
                        code: 200,
                        message: '@TODO implement example data endpoint'
                      }
                    }
                }
              },
              {
                params: 'public.specialists.single.params',
                query: 'public.specialists.single.query',
                response: {
                  200: 'public.specialists.single.response'
                },
                detail: {
                  tags: ['Public'],
                  security: [], // Remove this to make endpoint public
                  summary: 'Get published specialist',
                  description:
                    "Retrieves a single published specialist's comments, currently uses x-client header to filter by client"
                }
              }
            )
      )
  )
}

export { app }
export type App = typeof app
