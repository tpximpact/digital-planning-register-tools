import { ApiResponseSchema } from '../../schemas'
import type { Static } from 'elysia'
import { t } from 'elysia'

/**
 * Schema for the default API response.
 */
export const DefaultResponseSchema = ApiResponseSchema(t.Null(), {
  description: `Successful response`
})
export type DefaultResponse = Static<typeof DefaultResponseSchema>
/**
 * Schema for the healthcheck response.
 */
export const HealthcheckSchema = t.Object({
  uptime: t.Number(),
  // date: t.Date()
  date: t.String({ format: 'date-time' })
})
export const HealthcheckResponseSchema = ApiResponseSchema(HealthcheckSchema, {
  description: `Successful response`
})

/**
 * This is the schema for the required headers for almost all the API endpoints
 */
export const apiRequiredHeaders = t.Object({
  'x-client': t.String({
    description:
      'Who is requesting the data, ensures the correct data is returned',
    example: 'cavyshire-borough-council'
  }),
  'x-service': t.String({
    description: 'What is requesting the data, mostly for diagnostic purposes',
    example: 'open-api-spec'
  })
})
