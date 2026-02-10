import { Elysia } from 'elysia'
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
import { standardResponseObjects } from '@dpr/api'
import {
  getAllApplicationPublicComments,
  getAllPublishedApplicationPublicComments,
  getApplicationPublicComment,
  getPublishedApplicationPublicComment
} from 'handlers/local/src'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const publicComments = (app: Elysia) =>
  app
    .get(
      `/applications/:applicationId/publicComments`,
      async (context) => {
        try {
          const { data, pagination } = getAllApplicationPublicComments(
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
        params: PostSubmissionPublicCommentsUrlParams,
        query: PostSubmissionPublicCommentsQueryParams,
        response: {
          200: PostSubmissionPublicCommentsResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get public comments',
          description:
            'Retrieves a list of all public comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId/publicComments/:publicCommentId`,
      async (context) => {
        try {
          const data = getApplicationPublicComment(
            context.params.applicationId,
            context.params.publicCommentId
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
        params: PostSubmissionPublicCommentUrlParams,
        response: {
          200: PostSubmissionPublicCommentResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get public comment',
          description:
            'Retrieves a single application public comment, currently uses x-client header to filter by client'
        }
      }
    )
    .post(
      `/applications/:applicationId/publicComments`,
      async (_context) => {
        return {
          data: null,
          status: standardResponseObjects.OkResponseObject
        }
      },
      {
        params: PostSubmissionPublicCommentPostUrlParams,
        body: PostSubmissionPublicCommentPostBody,
        response: {
          200: 'empty200'
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Send public comment',
          description:
            'Creates a new public comment for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications/:applicationId/publicComments`,
          async (context) => {
            try {
              const { data, pagination } =
                getAllPublishedApplicationPublicComments(
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
            params: PostSubmissionPublishedPublicCommentsUrlParams,
            query: PostSubmissionPublishedPublicCommentsQueryParams,
            response: {
              200: PostSubmissionPublishedPublicCommentsResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get published public comments',
              description:
                'Retrieves a list of all published public comments for a specific application, currently uses x-client header to filter by client'
            }
          }
        )
        .get(
          `/applications/:applicationId/publicComments/:publicCommentId`,
          async (context) => {
            try {
              const data = getPublishedApplicationPublicComment(
                context.params.applicationId,
                context.params.publicCommentId
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
            params: PostSubmissionPublishedPublicCommentUrlParams,
            response: {
              200: PostSubmissionPublishedPublicCommentResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get published public comment',
              description:
                'Retrieves a single published application public comment, currently uses x-client header to filter by client'
            }
          }
        )
    )
