import { PostSubmissionApplicationParams } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/endpoints/ApplicationEndpoint.ts'
import {
  PostSubmissionDocumentEndpoint,
  PostSubmissionDocumentParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/endpoints/DocumentEndpoint.ts'
import {
  PostSubmissionDocumentsEndpoint,
  PostSubmissionDocumentsSearchParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/endpoints/DocumentsEndpoint.ts'
import { PostSubmissionPublishedApplicationParams } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/ApplicationEndpoint.ts'
import {
  PostSubmissionPublishedDocumentEndpoint,
  PostSubmissionPublishedDocumentParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/DocumentEndpoint.ts'
import {
  PostSubmissionPublishedDocumentsEndpoint,
  PostSubmissionPublishedDocumentsSearchParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/DocumentsEndpoint.ts'
import { Elysia } from 'elysia'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const documents = () => {
  return new Elysia({
    name: 'documents',
    detail: {
      tags: ['Documents']
    }
  })
    .model({
      // Schemas for schemas section

      // all public documents & the search params
      PostSubmissionPublishedDocumentsEndpoint:
        PostSubmissionPublishedDocumentsEndpoint,
      PostSubmissionPublishedApplicationParams:
        PostSubmissionPublishedApplicationParams,
      PostSubmissionPublishedDocumentsSearchParams:
        PostSubmissionPublishedDocumentsSearchParams,

      // all private documents & the search params
      PostSubmissionDocumentsEndpoint: PostSubmissionDocumentsEndpoint,
      PostSubmissionApplicationParams: PostSubmissionApplicationParams,
      PostSubmissionDocumentsSearchParams: PostSubmissionDocumentsSearchParams,

      // single public document & the query params
      PostSubmissionPublishedDocumentEndpoint:
        PostSubmissionPublishedDocumentEndpoint,
      PostSubmissionPublishedDocumentParams:
        PostSubmissionPublishedDocumentParams,

      // single private document & the query params
      PostSubmissionDocumentEndpoint: PostSubmissionDocumentEndpoint,
      PostSubmissionDocumentParams: PostSubmissionDocumentParams
    })
    .get(
      `/applications/:applicationId/documents`,
      async () => {
        // do stuff
      },
      {
        params: PostSubmissionApplicationParams
      }
    )
    .get(
      `/applications/:applicationId/documents/:documentId`,
      async () => {
        // do stuff
      },
      {
        params: PostSubmissionDocumentParams
      }
    )
    .get(
      `/public/applications/:applicationId/documents`,
      async () => {
        // do stuff
      },
      {
        params: PostSubmissionPublishedApplicationParams
      }
    )
    .get(
      `/public/applications/:applicationId/documents/:documentId`,
      async () => {
        // do stuff
      },
      {
        params: PostSubmissionPublishedDocumentParams
      }
    )

    .get('/health', () => 'OK', {
      detail: {
        summary: 'Health Check',
        description: 'Simple health check endpoint to verify service is running'
      }
    })
  // .get(
  //   '/:reference/documents',
  //   async ({ params, query, headers, error }) => {
  //     try {
  //       const client = headers['x-client']

  //       const documentsData = await documents(
  //         client,
  //         params.reference,
  //         query as SearchParamsDocuments
  //       )

  //       if (!documentsData) {
  //         return error(404, 'Documents not found for this application.')
  //       }
  //       return documentsData
  //     } catch (e) {
  //       console.error('An error occurred while fetching documents:', e)
  //       return error(500, 'An unexpected error occurred')
  //     }
  //   },
  //   {
  //     headers: t.Object({
  //       'x-client': t.String(),
  //       'x-service': t.String()
  //     }),
  //     query: t.Object({
  //       page: t.Optional(t.Numeric()),
  //       resultsPerPage: t.Optional(t.Numeric()),
  //       name: t.Optional(t.String()),
  //       sortBy: t.Optional(t.String()),
  //       orderBy: t.Optional(t.String()),
  //       type: t.Optional(t.String()),
  //       publishedAtFrom: t.Optional(t.String()),
  //       publishedAtTo: t.Optional(t.String())
  //     })
  //   }
  // )

  //   .get(
  //     `/public/${defaultPath}`,
  //     async ({ set, query }) => {
  //       try {
  //         const { pagination, applications: data } =
  //           await PlanningApplicationService.getPlanningApplicationsOffsetPaginated(
  //             query
  //           )
  //         return {
  //           data,
  //           pagination,
  //           status: OkResponseObject
  //         }
  //       } catch {
  //         set.status = BadRequestResponseObject.code
  //         return {
  //           data: null,
  //           status: {
  //             ...BadRequestResponseObject,
  //             detail: 'Unable to fetch planning applications'
  //           }
  //         }
  //       }
  //     },
  //     {
  //       headers: apiRequiredHeaders,
  //       parse: ['application/json'],
  //       query: PlanningApplicationsQuerySchema,
  //       response: {
  //         200: PlanningApplicationsResponseSchema,
  //         400: ApiResponseSchema(t.Null(), {
  //           description: 'Bad Request'
  //         }),
  //         500: ApiResponseSchema(t.Null(), {
  //           description: 'Internal Server Error'
  //         })
  //       },
  //       detail: {
  //         security: [], // Remove this to make endpoint public
  //         summary: 'Get all private planning applications',
  //         description: 'Retrieve a list of all private planning applications'
  //       }
  //     }
  //   )
  //   .get(
  //     `/public/${defaultPath}/:id`,
  //     async ({ set, params: { id } }) => {
  //       if (isNaN(Number(id))) {
  //         throw new Error('Invalid ID')
  //       }

  //       try {
  //         const application =
  //           await PlanningApplicationService.getPlanningApplicationById(id)
  //         return {
  //           data: application,
  //           status: OkResponseObject
  //         }
  //       } catch {
  //         set.status = BadRequestResponseObject.code
  //         return {
  //           data: null,
  //           status: {
  //             ...BadRequestResponseObject,
  //             detail: 'Unable to fetch planning application'
  //           }
  //         }
  //       }
  //     },
  //     {
  //       headers: apiRequiredHeaders,
  //       parse: ['application/json'],
  //       params: PlanningApplicationParamsSchema,
  //       response: {
  //         200: PlanningApplicationResponseSchema,
  //         400: ApiResponseSchema(t.Null(), {
  //           description: 'Bad Request'
  //         }),
  //         500: ApiResponseSchema(t.Null(), {
  //           description: 'Internal Server Error'
  //         })
  //       },
  //       // transform({ params }) {
  //       //   const id = +params.id

  //       //   if (!Number.isNaN(id)) params.id = id
  //       // },
  //       detail: {
  //         summary: 'Get planning application by ID',
  //         description: 'Retrieve a specific planning application by its ID'
  //       }
  //     }
  //   )

  // return app
}

export default documents
