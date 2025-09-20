import { Elysia, t } from 'elysia'
import {
  PostSubmissionPublicCommentPostUrlParams,
  PostSubmissionPublicCommentPostBody,
  PostSubmissionPublicCommentsUrlParams,
  PostSubmissionPublicCommentsQueryParams,
  PostSubmissionPublicCommentsResponse,
  PostSubmissionPublishedPublicCommentsQueryParams,
  PostSubmissionPublishedPublicCommentsUrlParams,
  PostSubmissionPublishedPublicCommentsResponse,
  PostSubmissionPublicCommentUrlParams,
  PostSubmissionPublicCommentResponse,
  PostSubmissionPublishedPublicCommentUrlParams,
  PostSubmissionPublishedPublicCommentResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { OkResponseObject, resolveClientService } from '@dpr/libs'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { ReasonPhrases } from 'http-status-codes'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const publicComments = (app: Elysia) =>
  app
    .use(resolveClientService)
    .get(
      `/applications/:applicationId/publicComments`,
      async (context) => 'hi',
      {
        params: PostSubmissionPublicCommentsUrlParams,
        query: PostSubmissionPublicCommentsQueryParams,
        response: {
          200: PostSubmissionPublicCommentsResponse
        },
        detail: {
          tags: ['Private', 'Public Comments'],
          security: [], // Remove this to make endpoint public
          summary: 'Get all public comments for an application',
          description:
            'Retrieves a list of all public comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId/publicComments/:publicCommentId`,
      async (context) => 'hi',
      {
        params: PostSubmissionPublicCommentUrlParams,
        response: {
          200: PostSubmissionPublicCommentResponse
        },
        detail: {
          tags: ['Private', 'Public Comments'],
          security: [], // Remove this to make endpoint public
          summary: 'Get application public comment by application ID',
          description:
            'Retrieves a single application public comment, currently uses x-client header to filter by client'
        }
      }
    )
    .post(
      `/applications/:applicationId/publicComments`,
      async (context) => 'hi',
      {
        params: PostSubmissionPublicCommentPostUrlParams,
        body: PostSubmissionPublicCommentPostBody,
        response: {
          200: ApiResponse(t.Null(), {
            title: ReasonPhrases.OK,
            description: ReasonPhrases.OK,
            examples: [
              {
                data: null,
                status: OkResponseObject
              }
            ]
          })
        },
        detail: {
          tags: ['Private', 'Public Comments'],
          security: [], // Remove this to make endpoint public
          summary: 'Post a new public comment for an application',
          description:
            'Creates a new public comment for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications/:applicationId/publicComments`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedPublicCommentsUrlParams,
            query: PostSubmissionPublishedPublicCommentsQueryParams,
            response: {
              200: PostSubmissionPublishedPublicCommentsResponse
            },
            detail: {
              tags: ['Public', 'Public Comments'],
              security: [], // Remove this to make endpoint public
              summary: 'Get all published public comments for an application',
              description:
                'Retrieves a list of all published public comments for a specific application, currently uses x-client header to filter by client'
            }
          }
        )
        .get(
          `/applications/:applicationId/publicComments/:publicCommentId`,
          async (context) => 'hi',
          {
            params: PostSubmissionPublishedPublicCommentUrlParams,
            response: {
              200: PostSubmissionPublishedPublicCommentResponse
            },
            detail: {
              tags: ['Public', 'Public Comments'],
              security: [], // Remove this to make endpoint public
              summary:
                'Get published application public comment by application ID',
              description:
                'Retrieves a single published application public comment, currently uses x-client header to filter by client'
            }
          }
        )
    )
