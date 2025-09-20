import { Elysia } from 'elysia'
import {
  PostSubmissionPublishedDocumentsQueryParams,
  PostSubmissionPublishedDocumentsResponse,
  PostSubmissionPublishedDocumentUrlParams,
  PostSubmissionPublishedDocumentResponse,
  PostSubmissionDocumentsUrlParams,
  PostSubmissionDocumentsQueryParams,
  PostSubmissionDocumentsResponse,
  PostSubmissionDocumentUrlParams,
  PostSubmissionDocumentResponse,
  PostSubmissionPublishedDocumentsUrlParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { resolveClientService } from '@dpr/libs'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const documents = (app: Elysia) =>
  app
    .use(resolveClientService)
    .get(`/applications/:applicationId/documents`, async (context) => 'hi', {
      params: PostSubmissionDocumentsUrlParams,
      query: PostSubmissionDocumentsQueryParams,
      response: {
        200: PostSubmissionDocumentsResponse
      },
      detail: {
        tags: ['Private', 'Documents'],
        security: [], // Remove this to make endpoint public
        summary: 'Get all documents for an application',
        description:
          'Retrieves a list of all documents for a specific application, currently uses x-client header to filter by client'
      }
    })
    .get(
      `/applications/:applicationId/documents/:documentId`,
      async (context) => 'hi',
      {
        params: PostSubmissionDocumentUrlParams,
        response: {
          200: PostSubmissionDocumentResponse
        },
        detail: {
          tags: ['Private', 'Documents'],
          security: [], // Remove this to make endpoint public
          summary: 'Get application document by application ID',
          description:
            'Retrieves a single application document, currently uses x-client header to filter by client'
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications/:applicationId/documents`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedDocumentsUrlParams,
            query: PostSubmissionPublishedDocumentsQueryParams,
            response: {
              200: PostSubmissionPublishedDocumentsResponse
            },
            detail: {
              tags: ['Public', 'Documents'],
              security: [], // Remove this to make endpoint public
              summary: 'Get all published documents for an application',
              description:
                'Retrieves a list of all published documents for a specific application, currently uses x-client header to filter by client'
            }
          }
        )
        .get(
          `/applications/:applicationId/documents/:documentId`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedDocumentUrlParams,
            response: {
              200: PostSubmissionPublishedDocumentResponse
            },
            detail: {
              tags: ['Public', 'Documents'],
              security: [], // Remove this to make endpoint public
              summary: 'Get application published document by application ID',
              description:
                'Retrieves a single published application document, currently uses x-client header to filter by client'
            }
          }
        )
    )
