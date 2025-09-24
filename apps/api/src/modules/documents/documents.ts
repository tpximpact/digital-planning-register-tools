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
import { resolveClientHeaders } from '../../libs/client-headers'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const documents = (app: Elysia) =>
  app
    .use(resolveClientHeaders)
    .get(`/applications/:applicationId/documents`, async (context) => 'hi', {
      params: PostSubmissionDocumentsUrlParams,
      query: PostSubmissionDocumentsQueryParams,
      response: {
        200: PostSubmissionDocumentsResponse
      },
      detail: {
        tags: ['Private'],
        security: [], // Remove this to make endpoint public
        summary: 'Get all unredacted documents for an application',
        description:
          'Retrieves a list of all unredacted documents for a specific application, currently uses x-client header to filter by client'
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
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary:
            'Get unredacted application document information by application ID',
          description:
            'Retrieves a single unredacted application document information, currently uses x-client header to filter by client'
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
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get all redacted documents for an application',
              description:
                'Retrieves a list of all redacted documents for a specific application, currently uses x-client header to filter by client'
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
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary:
                'Get redacted application document information by application ID',
              description:
                'Retrieves a single redacted application document information, currently uses x-client header to filter by client'
            }
          }
        )
    )
