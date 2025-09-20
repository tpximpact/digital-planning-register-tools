import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'

import {
  BadRequestResponseObject,
  InternalServerErrorResponseObject,
  OkResponseObject,
  setupEndpoint
} from '@dpr/libs'
import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { ReasonPhrases } from 'http-status-codes'
import { openapiConfig } from './modules/openapi'
import { handleErrors } from './modules/handleErrors'
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
  debug: false,
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
    .use(openapi(openapiConfig))
    .use(setupEndpoint)
    .model({
      '200': ApiResponse(t.Null(), {
        title: ReasonPhrases.OK,
        description: ReasonPhrases.OK,
        examples: [
          {
            data: null,
            status: OkResponseObject
          }
        ]
      }),
      '400': ApiResponse(t.Null(), {
        title: ReasonPhrases.BAD_REQUEST,
        description: ReasonPhrases.BAD_REQUEST,
        examples: [
          {
            data: null,
            status: BadRequestResponseObject
          }
        ]
      }),
      '500': ApiResponse(t.Null(), {
        title: ReasonPhrases.INTERNAL_SERVER_ERROR,
        description: ReasonPhrases.INTERNAL_SERVER_ERROR,
        examples: [
          {
            data: null,
            status: InternalServerErrorResponseObject
          }
        ]
      })
    })
    .guard({
      response: {
        400: '400',
        500: '500'
      },
      parse: ['application/json']
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
          enabled: true
        })
      )
    })
    .use(handleErrors)
}

export { app }
export type App = typeof app
