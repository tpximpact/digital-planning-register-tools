import { Elysia, t } from 'elysia'
import { StatusCodes } from 'http-status-codes'

export const baseRoute = new Elysia()
  .get(
    '/',
    () => {
      return {
        status: {
          code: StatusCodes.OK,
          message: 'OK',
          details: 'Mock ODP compliant endpoint'
        }
      }
    },
    {
      response: t.Object({
        status: t.Object({
          code: t.Number(),
          message: t.String(),
          details: t.String()
        })
      })
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
          code: StatusCodes.OK,
          message: 'OK'
        }
      }
    },
    {
      response: t.Object({
        data: t.Object({
          uptime: t.Number(),
          date: t.String()
        }),
        status: t.Object({
          code: t.Number(),
          message: t.String()
        })
      })
    }
  )
