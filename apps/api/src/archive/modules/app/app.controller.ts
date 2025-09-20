import { Elysia, t } from 'elysia'

import { DefaultResponseSchema, HealthcheckResponseSchema } from './app.schema'
import { OkResponseObject } from '../../libs'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'

export const appSetup = new Elysia({
  name: 'appSetup',
  tags: ['Internal']
})
  .model({
    // Sets up the schemas section to show what we would like an apiResponse to be
    ApiResponse: ApiResponse(t.Union([t.Any(), t.Null()]), {
      description: 'Default API response schema'
    })
  })
  .get(
    '/',
    () => {
      return {
        data: null,
        status: {
          ...OkResponseObject,
          detail: 'ODP compliant API'
        }
      }
    },
    {
      detail: {
        security: []
      },
      // parse: ['application/json'],
      response: DefaultResponseSchema
    }
  )
  .get(
    '/healthcheck',
    () => {
      return {
        data: {
          uptime: process.uptime(),
          date: new Date().toISOString()
        },
        status: {
          ...OkResponseObject
        }
      }
    },
    {
      detail: {
        security: []
      },
      // parse: ['application/json'],
      response: HealthcheckResponseSchema
    }
  )
