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
import { resolveClientService } from '@dpr/libs'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const applications = (app: Elysia) =>
  app
    .use(resolveClientService)
    .get(`/applications`, async (context) => 'hi', {
      query: PostSubmissionApplicationsQueryParams,
      response: {
        200: PostSubmissionApplicationsResponse
      },
      detail: {
        tags: ['Private', 'Applications'],
        security: [], // Remove this to make endpoint public
        summary: 'Get all applications',
        description:
          'Retrieves a list of all applications, currently uses x-client header to filter by client'
      }
    })
    .get(`/applications/:applicationId`, async (context) => 'hi', {
      params: PostSubmissionApplicationUrlParams,
      response: {
        200: PostSubmissionApplicationResponse
      },
      detail: {
        tags: ['Private', 'Applications'],
        security: [], // Remove this to make endpoint public
        summary: 'Get application by application ID',
        description:
          'Retrieves a single application, currently uses x-client header to filter by client'
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
            tags: ['Public', 'Applications'],
            security: [], // Remove this to make endpoint public
            summary: 'Get all published applications',
            description:
              'Retrieves a list of all applications, currently uses x-client header to filter by client'
          }
        })
        .get(`/applications/:applicationId`, async (context) => 'hi', {
          params: PostSubmissionPublishedApplicationUrlParams,
          response: {
            200: PostSubmissionPublishedApplicationResponse
          },
          detail: {
            tags: ['Public', 'Applications'],
            security: [], // Remove this to make endpoint public
            summary: 'Get published application by application ID',
            description:
              'Retrieves a single application, currently uses x-client header to filter by client'
          }
        })
    )
