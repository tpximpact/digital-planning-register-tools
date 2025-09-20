import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import {
  BadRequestResponseObject,
  InternalServerErrorResponseObject,
  setupEndpoint
} from '@dpr/libs'
import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { ReasonPhrases } from 'http-status-codes'

/**
 * @file Types for authentication middleware
 */
export interface HandlerBopsOptions {
  enabled: boolean
  debug: boolean
  prefix?: string
}

const defaultOptions: HandlerBopsOptions = {
  enabled: true,
  debug: false,
  prefix: ''
}

const app = (userOptions?: HandlerBopsOptions) => {
  const options: HandlerBopsOptions = {
    ...defaultOptions,
    ...userOptions
  }

  if (options.debug) {
    console.info(`[handler BOPS] options: ${JSON.stringify(options)}`)
  }
  return new Elysia({
    name: 'handler BOPS',
    detail: {
      tags: ['BOPS Handler']
    }
  })
    .use(
      openapi({
        path: '/bopsHandler',
        documentation: {
          components: {
            securitySchemes: {
              basicAuth: {
                type: 'http',
                scheme: 'basic'
              }
            },
            parameters: {
              xClient: {
                name: 'x-client',
                in: 'header',
                required: true,
                schema: { type: 'string' },
                description: 'Client identifier'
              },
              xService: {
                name: 'x-service',
                in: 'header',
                required: true,
                schema: { type: 'string' },
                description: 'Service identifier'
              }
            }
          },
          security: [{ basicAuth: [] }]
        }
      })
    )
    .use(setupEndpoint)
    .model({
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
    .use(applications)
    .use(documents)
    .use(publicComments)
    .use(specialistComments)
    .onError((context) => {
      console.log('context', context)
    })
}

export { app }
export type App = typeof app
