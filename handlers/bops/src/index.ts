/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Use proper types here instead of any

import { Elysia, t } from 'elysia'
import { search } from './v2/search'
import { show } from './v2/show'

interface ApiResponse {
  data: any
  pagination?: any
  status: any
}

export const bopsHandlers = new Elysia({ name: 'bops-handlers' })
  .get(
    '/search',
    async ({ query, headers, error }) => {
      const client = headers['x-client']

      try {
        const apiResponse = (await search(client, query)) as ApiResponse

        if (!apiResponse.data) {
          return { data: [], pagination: apiResponse.pagination }
        }

        return {
          data: apiResponse.data.applications,
          pagination: apiResponse.pagination
        }
      } catch (e: any) {
        console.error('[bops-handlers] An error occurred in /search:', e)
        return error(
          e.status || 500,
          e.detail || 'Failed to search applications'
        )
      }
    },
    {
      headers: t.Object({
        'x-client': t.String({
          description:
            'Who is requesting the data, ensures the correct data is returned',
          example: 'cavyshire-borough-council'
        }),
        'x-service': t.String({
          description:
            'What is requesting the data, mostly for diagnostic purposes',
          example: 'open-api-spec'
        })
      })
    }
  )
  .get(
    '/:reference',
    async ({ params, headers, error }) => {
      const client = headers['x-client']

      try {
        const apiResponse = (await show(
          client,
          params.reference
        )) as ApiResponse

        if (!apiResponse.data) {
          return error(404, 'Application not found')
        }

        return apiResponse.data
      } catch (e: any) {
        return error(
          e.status || 500,
          e.detail || 'Failed to retrieve application'
        )
      }
    },
    {
      headers: t.Object({
        'x-client': t.String({
          description:
            'Who is requesting the data, ensures the correct data is returned',
          example: 'cavyshire-borough-council'
        }),
        'x-service': t.String({
          description:
            'What is requesting the data, mostly for diagnostic purposes',
          example: 'open-api-spec'
        })
      })
    }
  )
