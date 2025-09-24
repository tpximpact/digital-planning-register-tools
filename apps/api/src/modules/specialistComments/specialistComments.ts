import { Elysia } from 'elysia'
import {
  PostSubmissionSpecialistsUrlParams,
  PostSubmissionSpecialistsQueryParams,
  PostSubmissionSpecialistsResponse,
  PostSubmissionSpecialistUrlParams,
  PostSubmissionSpecialistResponse,
  PostSubmissionPublishedSpecialistsUrlParams,
  PostSubmissionPublishedSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistUrlParams,
  PostSubmissionPublishedSpecialistResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { resolveClientHeaders } from '../../libs/client-headers'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const specialistComments = (app: Elysia) =>
  app
    .use(resolveClientHeaders)
    .get(
      `/applications/:applicationId/specialistComments`,
      async (context) => 'hi',
      {
        params: PostSubmissionSpecialistsUrlParams,
        query: PostSubmissionSpecialistsQueryParams,
        response: {
          200: PostSubmissionSpecialistsResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get all specialists and their comments for an application',
          description:
            'Retrieves a list of all specialists and their comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId/specialistComments/:specialistId`,
      async (context) => 'hi',
      {
        params: PostSubmissionSpecialistUrlParams,
        response: {
          200: PostSubmissionSpecialistResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get specialist by specialist ID',
          description:
            "Retrieves a single specialist's comments, currently uses x-client header to filter by client"
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications/:applicationId/specialistComments`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedSpecialistsUrlParams,
            query: PostSubmissionPublishedSpecialistsQueryParams,
            response: {
              200: PostSubmissionPublishedSpecialistsResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary:
                'Get all published specialists and their comments for an application',
              description:
                'Retrieves a list of all published specialists and their comments for a specific application, currently uses x-client header to filter by client'
            }
          }
        )
        .get(
          `/applications/:applicationId/specialistComments/:specialistId`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedSpecialistUrlParams,
            response: {
              200: PostSubmissionPublishedSpecialistResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get published specialist by specialist ID',
              description:
                "Retrieves a single published specialist's comments, currently uses x-client header to filter by client"
            }
          }
        )
    )
