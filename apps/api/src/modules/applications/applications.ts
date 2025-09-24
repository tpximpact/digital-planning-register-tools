import { Elysia } from 'elysia'
import {
  PostSubmissionPublishedApplicationsQueryParams,
  PostSubmissionPublishedApplicationsResponse,
  PostSubmissionPublishedApplicationUrlParams,
  PostSubmissionPublishedApplicationResponse,
  PostSubmissionApplicationsQueryParams,
  PostSubmissionApplicationsResponse,
  PostSubmissionApplicationUrlParams,
  PostSubmissionApplicationResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { resolveClientHeaders } from '../../libs/client-headers'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const applications = (app: Elysia) =>
  app
    .use(resolveClientHeaders)
    .get(`/applications`, async (context) => 'hi', {
      query: PostSubmissionApplicationsQueryParams,
      response: {
        200: PostSubmissionApplicationsResponse
      },
      detail: {
        tags: ['Private'],
        security: [], // Remove this to make endpoint public
        summary: 'Get all private applications',
        description:
          'Retrieves an unredacted list of all applications, currently uses x-client header to filter by client'
      }
    })
    .get(`/applications/:applicationId`, async (context) => 'hi', {
      params: PostSubmissionApplicationUrlParams,
      response: {
        200: PostSubmissionApplicationResponse
      },
      detail: {
        tags: ['Private'],
        security: [], // Remove this to make endpoint public
        summary: 'Get private application by application ID',
        description:
          'Retrieves a single unredacted application, currently uses x-client header to filter by client'
      }
    })
    .group('/public', (app) =>
      app
        .get(`/applications`, async (context) => 'hi', {
          query: PostSubmissionPublishedApplicationsQueryParams,
          response: {
            200: PostSubmissionPublishedApplicationsResponse
          },
          detail: {
            tags: ['Public'],
            security: [], // Remove this to make endpoint public
            summary: 'Get all published applications',
            description:
              'Retrieves a redacted list of all applications, currently uses x-client header to filter by client'
          }
        })
        .get(`/applications/:applicationId`, async (context) => 'hi', {
          params: PostSubmissionPublishedApplicationUrlParams,
          response: {
            200: PostSubmissionPublishedApplicationResponse
          },
          detail: {
            tags: ['Public'],
            security: [], // Remove this to make endpoint public
            summary: 'Get published application by application ID',
            description:
              'Retrieves a single redacted application, currently uses x-client header to filter by client'
          }
        })
    )
