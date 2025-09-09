/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Use proper types here instead of any

import { Elysia, t } from 'elysia'
import { search } from './v2/search'
import { show } from './v2/show'
import { documents } from './v2/documents'
import { publicComments } from './v2/publicComments'
import { specialistComments } from './v2/specialistComments'
import { applicationSubmission } from './v2/applicationSubmission'
import type {
  SearchParamsApplication,
  SearchParamsComments,
  SearchParamsDocuments
} from './types'

export const bopsHandlers = new Elysia({ name: 'bops-handlers' })
  .get(
    '/search',
    async ({ query, headers, error }) => {
      const client = headers['x-client']

      try {
        const apiResponse = await search(
          client,
          query as SearchParamsApplication
        )

        if (!apiResponse || !apiResponse.data) {
          return { data: [], pagination: apiResponse?.pagination }
        }

        return {
          data: apiResponse?.data,
          pagination: apiResponse?.pagination
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
      query: t.Object({
        page: t.Optional(t.Numeric({ default: 1 })),
        maxresults: t.Optional(t.Numeric({ default: 10 })),
        query: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        orderBy: t.Optional(t.String()),
        reference: t.Optional(t.String()),
        description: t.Optional(t.String()),
        applicationType: t.Optional(t.String()),
        applicationStatus: t.Optional(t.String()),
        councilDecision: t.Optional(t.String())
        // unsure about these date types, leaving commented out for now
        // dateType: t.Optional(t.String()),
        // dateRange: t.Optional(t.String()),
        // dateRangeFrom: t.Optional(t.String()),
        // dateRangeTo: t.Optional(t.String())
      }),
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
        const apiResponse = await show(client, params.reference)

        if (!apiResponse?.data) {
          return error(404, 'Application not found')
        }

        return apiResponse?.data
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
  .get(
    '/:reference/documents',
    async ({ params, query, headers, error }) => {
      try {
        const client = headers['x-client']
        const apiResponse = await documents(
          client,
          params.reference,
          query as SearchParamsDocuments
        )

        if (!apiResponse || !apiResponse.data) {
          return { data: [], pagination: apiResponse?.pagination }
        }

        return {
          data: apiResponse?.data,
          pagination: apiResponse?.pagination
        }
      } catch (e: any) {
        return error(
          e.status || 500,
          e.detail || 'Failed to retrieve documents'
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
      }),
      query: t.Object({
        page: t.Optional(t.Numeric()),
        resultsPerPage: t.Optional(t.Numeric()),
        name: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        orderBy: t.Optional(t.String()),
        type: t.Optional(t.String()),
        publishedAtFrom: t.Optional(t.String()),
        publishedAtTo: t.Optional(t.String())
      })
    }
  )
  .get(
    '/:reference/comments/public',
    async ({ params, query, headers, error }) => {
      const client = headers['x-client']

      try {
        const apiResponse = await publicComments(
          client,
          params.reference,
          query as SearchParamsComments
        )

        if (!apiResponse || !apiResponse.data) {
          return { data: [], pagination: apiResponse?.pagination }
        }

        return {
          data: apiResponse?.data,
          pagination: apiResponse?.pagination
        }
      } catch (e: any) {
        return error(
          e.status || 500,
          e.detail || 'Failed to retrieve public comments'
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
      }),
      query: t.Object({
        page: t.Optional(t.Numeric()),
        resultsPerPage: t.Optional(t.Numeric()),
        query: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        orderBy: t.Optional(t.String()),
        sentiment: t.Optional(t.String()),
        topic: t.Optional(t.String()),
        publishedAtFrom: t.Optional(t.String()),
        publishedAtTo: t.Optional(t.String())
      })
    }
  )
  .get(
    '/:reference/comments/specialist',
    async ({ params, query, headers, error }) => {
      try {
        const client = headers['x-client']
        const apiResponse = await specialistComments(
          client,
          params.reference,
          query as SearchParamsComments
        )

        if (!apiResponse || !apiResponse.data) {
          return { data: [], pagination: apiResponse?.pagination }
        }

        return {
          data: apiResponse?.data,
          pagination: apiResponse?.pagination
        }
      } catch (e: any) {
        return error(
          e.status || 500,
          e.detail || 'Failed to retrieve specialist comments'
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
      }),
      query: t.Object({
        page: t.Optional(t.Numeric()),
        resultsPerPage: t.Optional(t.Numeric()),
        query: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        orderBy: t.Optional(t.String()),
        sentiment: t.Optional(t.String()),
        publishedAtFrom: t.Optional(t.String()),
        publishedAtTo: t.Optional(t.String())
      })
    }
  )
  .get(
    '/:reference/submission',
    async ({ params, headers, error }) => {
      const client = headers['x-client']

      try {
        const apiResponse = await applicationSubmission(
          client,
          params.reference
        )

        if (!apiResponse?.data) {
          return error(404, 'Application not found')
        }

        return apiResponse.data
      } catch (e: any) {
        return error(
          e.status || 500,
          e.detail || 'Failed to retrieve application submission details'
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
