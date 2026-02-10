import { Elysia } from 'elysia'
import {
  // PostSubmissionPublishedDocumentsQueryParams,
  // PostSubmissionPublishedDocumentsResponse,
  // PostSubmissionPublishedDocumentUrlParams,
  // PostSubmissionPublishedDocumentResponse,
  PostSubmissionDocumentsUrlParams,
  PostSubmissionDocumentsQueryParams,
  PostSubmissionDocumentsResponse,
  PostSubmissionDocumentUrlParams,
  PostSubmissionDocumentResponse
  // PostSubmissionPublishedDocumentsUrlParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { standardResponseObjects } from '@dpr/api'
import {
  getAllApplicationDocuments,
  // getAllPublishedApplicationDocuments,
  getApplicationDocument
  // getPublishedApplicationDocument
} from 'handlers/local/src'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const documents = (app: Elysia) =>
  app
    .get(
      `/applications/:applicationId/documents`,
      async (context) => {
        try {
          const { data, pagination } = getAllApplicationDocuments(
            context.params.applicationId,
            context.query
          )
          return {
            data,
            pagination,
            status: standardResponseObjects.OkResponseObject
          }
        } catch (e) {
          console.error(e)
          return {
            data: null,
            status: {
              ...standardResponseObjects.InternalServerErrorResponseObject,
              detail: 'Failed to generate example applications'
            }
          }
        }
      },
      {
        params: PostSubmissionDocumentsUrlParams,
        query: PostSubmissionDocumentsQueryParams,
        response: {
          200: PostSubmissionDocumentsResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get documents',
          description:
            'Retrieves a list of all unredacted documents for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId/documents/:documentId`,
      async (context) => {
        try {
          const data = getApplicationDocument(
            context.params.applicationId,
            context.params.documentId
          )
          return {
            data,
            status: standardResponseObjects.OkResponseObject
          }
        } catch (e) {
          console.error(e)
          return {
            data: null,
            status: {
              ...standardResponseObjects.InternalServerErrorResponseObject,
              detail: 'Failed to generate example applications'
            }
          }
        }
      },
      {
        params: PostSubmissionDocumentUrlParams,
        response: {
          200: PostSubmissionDocumentResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get document',
          description:
            'Retrieves a single unredacted application document information, currently uses x-client header to filter by client'
        }
      }
    )
    .group('/public', (app) => app)
