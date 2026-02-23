import path from 'path'
import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi, fromTypes } from '@elysiajs/openapi'
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
import type {
  PostSubmissionPublishedApplicationResponse,
  PostSubmissionPublishedApplicationsResponse,
  PostSubmissionPublishedDocumentsResponse,
  PostSubmissionPublishedPublicCommentsResponse,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'

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

  const isProduction = config.environment === 'production' || false

  return (
    new Elysia({
      name: '@dpr/api'
    })
      .use(cors({ origin: true }))
      .use(showRoutes(options.debug))
      // .use(
      //   openapi({
      //     enabled: isProduction ? false : true,
      //     path: '/scalar-docs',
      //     provider: 'scalar',
      //     // exclude: {
      //     //   tags: ['BOPS Handler']
      //     // },
      //     documentation,
      //     references: fromTypes(
      //       isProduction ? path.resolve('dist/types/app.d.ts') : 'src/app.ts',
      //       {
      //         projectRoot: isProduction
      //           ? path.join(import.meta.dir)
      //           : path.join(import.meta.dir, '..'),
      //         tsconfigPath: isProduction
      //           ? path.join(import.meta.dir, 'tsconfig.build.json')
      //           : path.join(import.meta.dir, '..', 'tsconfig.build.json'),
      //         debug: options.debug
      //       }
      //     )
      //   })
      // )
      .use(
        openapi({
          enabled: true,
          path: '/docs',
          provider: 'swagger-ui',
          exclude: {
            paths: ['/']
            //  /^\/api\/handlers\/bops/ Exclude all BOPS handler routes from OpenAPI documentation
          },
          documentation,
          references: fromTypes(
            isProduction ? path.resolve('dist/types/app.d.ts') : 'src/app.ts',
            {
              projectRoot: isProduction
                ? path.join(import.meta.dir)
                : path.join(import.meta.dir, '..'),
              tsconfigPath: isProduction
                ? path.join(import.meta.dir, 'tsconfig.build.json')
                : path.join(import.meta.dir, '..', 'tsconfig.build.json'),
              debug: options.debug
            }
          )
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
                  200: t.Union([
                    t.Ref('applications.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('applications.single.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('documents.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('documents.single.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('publicComments.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('publicComments.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('specialists.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('specialists.single.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedApplicationsResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                query: 'public.applications.all.query',
                response: {
                  200: t.Union([
                    t.Ref('public.applications.all.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedApplicationResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications/${params.applicationId}`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                params: 'public.applications.single.params',
                response: {
                  200: t.Union([
                    t.Ref('public.applications.single.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedDocumentsResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications/${params.applicationId}/documents`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                params: 'public.documents.all.params',
                query: 'public.documents.all.query',
                response: {
                  200: t.Union([
                    t.Ref('public.documents.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('public.documents.single.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedPublicCommentsResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications/${params.applicationId}/publicComments`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                params: 'public.publicComments.all.params',
                query: 'public.publicComments.all.query',
                response: {
                  200: t.Union([
                    t.Ref('public.publicComments.all.response'),
                    t.Ref('empty200')
                  ])
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
                  200: t.Union([
                    t.Ref('public.publicComments.single.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedSpecialistsResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications/${params.applicationId}/specialistComments`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                params: 'public.specialists.all.params',
                query: 'public.specialists.all.query',
                response: {
                  200: t.Union([
                    t.Ref('public.specialists.all.response'),
                    t.Ref('empty200')
                  ])
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
                  case 'bops': {
                    const result =
                      await proxyBopsGet<PostSubmissionPublishedSpecialistResponse>(
                        {
                          baseUrl: API_BASE_URL,
                          path: `/api/handlers/bops/public/applications/${params.applicationId}/specialistComments/${params.specialistId}`,
                          query,
                          client,
                          service
                        }
                      )
                    const { data, status } = result
                    const pagination =
                      'pagination' in result ? result.pagination : undefined
                    return pagination
                      ? { data, pagination, status }
                      : { data, status }
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
                params: 'public.specialists.single.params',
                query: 'public.specialists.single.query',
                response: {
                  200: t.Union([
                    t.Ref('public.specialists.single.response'),
                    t.Ref('empty200')
                  ])
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
