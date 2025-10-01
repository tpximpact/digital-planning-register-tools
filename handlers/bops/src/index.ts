import { Elysia } from 'elysia'
import { fetchAllApplications, fetchApplication } from './modules/applications'
import { fetchAllApplicationDocuments } from './modules/documents'
import { fetchAllApplicationPublicComments } from './modules/publicComments'
import {
  fetchAllApplicationSpecialistComments,
  fetchApplicationSpecialistComment
} from './modules/specialistComments'
import {
  handleErrors,
  resolveClientHeaders,
  SchemaModel,
  standardResponses
} from '@dpr/api'
import { withErrorHandling } from './libs/requests'

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
    .use(standardResponses)
    .use(SchemaModel)
    .use(handleErrors(options))
    .use(resolveClientHeaders)
    .get(
      `/public/applications`,
      async ({ query, client, set }) => {
        return withErrorHandling(
          () => fetchAllApplications(client, query),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching applications'
        )
        // try {
        //   return await fetchAllApplications(client, query)
        // } catch (e) {
        //   console.error('Error fetching applications:', e)
        //   set.status = standardResponseObjects.BadRequestResponseObject.code
        //   return {
        //     data: null,
        //     status: {
        //       ...standardResponseObjects.BadRequestResponseObject,
        //       detail: `An error occurred while fetching applications: ${
        //         e instanceof Error ? e.message : String(e)
        //       }`
        //     }
        //   }
        // }
      },
      {
        query: 'public.applications.all.query',
        response: {
          200: 'public.applications.all.response'
        },
        detail: {
          summary: 'Get published applications',
          description:
            'Retrieves a redacted list of all applications, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/public/applications/:applicationId`,
      async ({ client, params: { applicationId }, set }) => {
        return withErrorHandling(
          () => fetchApplication(client, applicationId),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching application'
        )
        // try {
        //   return await fetchApplication(client, applicationId)
        // } catch (e) {
        //   console.error('Error fetching applications:', e)
        //   set.status = standardResponseObjects.BadRequestResponseObject.code
        //   return {
        //     data: null,
        //     status: {
        //       ...standardResponseObjects.BadRequestResponseObject,
        //       detail: `An error occurred while fetching applications: ${
        //         e instanceof Error ? e.message : String(e)
        //       }`
        //     }
        //   }
        // }
      },
      {
        params: 'public.applications.single.params',
        response: {
          200: 'public.applications.single.response'
        },
        detail: {
          summary: 'Get published application',
          description:
            'Retrieves a single redacted application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/public/applications/:applicationId/documents`,
      async ({ client, params: { applicationId }, query, set }) =>
        withErrorHandling(
          () => fetchAllApplicationDocuments(client, applicationId, query),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching documents'
        ),
      {
        params: 'public.documents.all.params',
        query: 'public.documents.all.query',
        response: {
          200: 'public.documents.all.response'
        },
        detail: {
          summary: 'Get published documents',
          description:
            'Retrieves a list of all redacted documents for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/public/applications/:applicationId/publicComments`,
      async ({ client, params: { applicationId }, query, set }) =>
        withErrorHandling(
          () => fetchAllApplicationPublicComments(client, applicationId, query),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching public comments'
        ),
      {
        params: 'public.publicComments.all.params',
        query: 'public.publicComments.all.query',
        response: {
          200: 'public.publicComments.all.response'
        },
        detail: {
          summary: 'Get published public comments',
          description:
            'Retrieves a list of all published public comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/public/applications/:applicationId/specialistComments`,
      async ({ client, params: { applicationId }, query, set }) =>
        withErrorHandling(
          () =>
            fetchAllApplicationSpecialistComments(client, applicationId, query),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching specialist comments'
        ),
      {
        params: 'public.specialists.all.params',
        query: 'public.specialists.all.query',
        response: {
          200: 'public.specialists.all.response'
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
      `/public/applications/:applicationId/specialistComments/:specialistId`,
      async ({ client, params: { applicationId, specialistId }, set, query }) =>
        withErrorHandling(
          () =>
            fetchApplicationSpecialistComment(
              client,
              applicationId,
              specialistId,
              query
            ),
          (code) => {
            set.status = code
          },
          'An error occurred while fetching specialists comments'
        ),
      {
        params: 'public.specialists.single.params',
        query: 'public.specialists.single.query',
        response: {
          200: 'public.specialists.single.response'
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
}

export { app }
export type App = typeof app
