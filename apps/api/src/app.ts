import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { config } from './config'
import { standardResponses } from './libs/standard-responses'
import { handleErrors } from './libs/handle-errors'

import {
  // app as handlerBops,
  fetchAllApplications as fetchAllBopsApplications,
  fetchApplication as fetchBopsApplication,
  fetchAllApplicationDocuments as fetchAllBopsApplicationDocuments,
  fetchAllApplicationPublicComments as fetchAllBopsApplicationPublicComments,
  fetchAllApplicationSpecialistComments as fetchAllBopsApplicationSpecialistComments,
  fetchApplicationSpecialistComment as fetchBopsApplicationSpecialistComment
} from '@dpr/handler-bops'
import { showRoutes } from './libs/show-routes'
import { SchemaModel } from './schema'
import { api } from './modules/api'
import { requireClientHeaders } from './libs/client-headers'
import { docs } from './modules/open-api'

/**
 * @file Types for authentication middleware
 */
export interface ApiOptions {
  enabled: boolean
  debug: boolean
  prefix?: string
  generateDocs?: boolean
}

const defaultOptions: ApiOptions = {
  enabled: true,
  debug: config.debug || false,
  prefix: ''
}

const notHandled = {
  data: null,
  status: { code: 200, message: 'Not currently handled' }
}
const bopsHandler = <T>(
  handler: string,
  fn: () => Promise<T>,
  fallback: T = {
    data: null,
    status: { code: 200, message: '@TODO implement example data endpoint' }
  } as T
) => {
  switch (handler) {
    case 'bops':
      return fn()
    default:
      return fallback
  }
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
      name: '@dpr/api',
      serve: {
        // no built-in option, but you can skip per route
      },
      normalize: false // disables some internal processing
    })
      .derive(() => ({
        _memBefore: process.memoryUsage().heapUsed
      }))
      .onAfterHandle(({ request, _memBefore }) => {
        if (options.debug) {
          const delta = Math.round(
            (process.memoryUsage().heapUsed - _memBefore) / 1024
          )
          const url = new URL(request.url)
          console.log(
            `[memory] ${request.method} ${url.pathname} +${delta}KB heap`
          )
        }
      })
      .use(cors({ origin: true }))
      .use(showRoutes(options.debug))
      .use(docs(isProduction, options.debug))
      .use(standardResponses)
      .use(SchemaModel)
      .use(handleErrors(options))
      .get('/health', () => {
        return {
          status: 'ok'
        }
      })
      // .group('/api/@next', (app) => {
      //   return app
      //     .use(applications)
      //     .use(documents)
      //     .use(publicComments)
      //     .use(specialistComments)
      // })
      // .group('/api/handlers/bops', (app) => {
      //   return app.use(
      //     handlerBops({
      //       debug: options.debug,
      //       enabled: true
      //     })
      //   )
      // })
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
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                query: 'applications.all.query',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('applications.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
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
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'applications.single.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('applications.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get application',
                  description:
                    'Retrieves a single unredacted application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'documents.all.params',
                query: 'documents.all.query',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('documents.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get documents',
                  description:
                    'Retrieves a list of all unredacted documents for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents/:documentId`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'documents.single.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('documents.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get document',
                  description:
                    'Retrieves a single unredacted application document information, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'publicComments.all.params',
                query: 'publicComments.all.query',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('publicComments.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get public comments',
                  description:
                    'Retrieves a list of all public comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments/:publicCommentId`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'publicComments.all.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('publicComments.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get public comment',
                  description:
                    'Retrieves a single application public comment, currently uses x-client header to filter by client'
                }
              }
            )
            .post(
              `/applications/:applicationId/publicComments`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'publicComments.submit.params',
                body: 'publicComments.submit.body',
                ...(options.generateDocs && {
                  response: {
                    200: 'empty200'
                  }
                }),
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
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'specialists.all.params',
                query: 'specialists.all.query',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('specialists.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get specialist comments',
                  description:
                    'Retrieves a list of all specialists and their comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments/:specialistId`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'specialists.single.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('specialists.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
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
              async ({ handler, client, query }) => {
                switch (handler) {
                  case 'bops': {
                    const result = await fetchAllBopsApplications(client, query)
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
                query: 'applications.all.query',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.applications.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published applications',
                  description:
                    'Retrieves a redacted list of all applications, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId`,
              async ({ handler, client, params }) => {
                switch (handler) {
                  case 'bops': {
                    const result = await fetchBopsApplication(
                      client,
                      params.applicationId
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
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.applications.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published application',
                  description:
                    'Retrieves a single redacted application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents`,
              async ({ handler, client, query, params }) => {
                switch (handler) {
                  case 'bops': {
                    const result = await fetchAllBopsApplicationDocuments(
                      client,
                      params.applicationId,
                      query
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
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.documents.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published documents',
                  description:
                    'Retrieves a list of all redacted documents for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/documents/:documentId`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'public.documents.single.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.documents.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published document',
                  description:
                    'Retrieves a single redacted application document information, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments`,
              async ({ handler, client, query, params }) => {
                switch (handler) {
                  case 'bops': {
                    const result = await fetchAllBopsApplicationPublicComments(
                      client,
                      params.applicationId,
                      query
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
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.publicComments.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published public comments',
                  description:
                    'Retrieves a list of all published public comments for a specific application, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/publicComments/:publicCommentId`,
              async ({ handler }) =>
                bopsHandler(handler, async () => notHandled),
              {
                params: 'public.publicComments.single.params',
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.publicComments.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
                detail: {
                  summary: 'Get published public comment',
                  description:
                    'Retrieves a single published application public comment, currently uses x-client header to filter by client'
                }
              }
            )
            .get(
              `/applications/:applicationId/specialistComments`,
              async ({ handler, client, query, params }) => {
                switch (handler) {
                  case 'bops': {
                    const result =
                      await fetchAllBopsApplicationSpecialistComments(
                        client,
                        params.applicationId,
                        query
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
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.specialists.all.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
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
              async ({ handler, client, query, params }) => {
                switch (handler) {
                  case 'bops': {
                    const result = await fetchBopsApplicationSpecialistComment(
                      client,
                      params.applicationId,
                      params.specialistId,
                      query
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
                ...(options.generateDocs && {
                  response: {
                    200: t.Union([
                      t.Ref('public.specialists.single.response'),
                      t.Ref('empty200')
                    ])
                  }
                }),
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
