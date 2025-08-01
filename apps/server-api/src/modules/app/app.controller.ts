import { Elysia, t } from 'elysia'
import { ApiResponseSchema } from './app.schema'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const appSetup = new Elysia({
  tags: ['Internal']
})
  .model({
    apiResponse: ApiResponseSchema(t.Null()),
    apiPaginatedResponse: ApiResponseSchema(t.Null()),
    healthcheckResponse: ApiResponseSchema(
      t.Object({
        uptime: t.Number(),
        date: t.Date()
      })
    )
  })
  .get(
    '/',
    () => {
      console.log('App > /')
      return {
        data: null,
        status: {
          code: StatusCodes.OK,
          message: ReasonPhrases.OK,
          details: 'Mock ODP compliant endpoint'
        }
      }
    },
    {
      response: 'apiResponse'
    }
  )
  .get(
    '/healthcheck',
    () => {
      console.log('App > /healthcheck')
      return {
        data: {
          uptime: process.uptime(),
          date: new Date()
        },
        status: {
          code: StatusCodes.OK,
          message: ReasonPhrases.OK
        }
      }
    },
    {
      response: 'healthcheckResponse'
    }
  )
