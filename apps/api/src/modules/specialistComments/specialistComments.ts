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
import { standardResponseObjects } from '../../libs/standard-responses'
import {
  getAllApplicationSpecialistComments,
  getAllPublishedApplicationSpecialistComments,
  getApplicationSpecialistComment,
  getPublishedApplicationSpecialistComment
} from '@dpr/handler-local'

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const specialistComments = (app: Elysia) =>
  app
    .get(
      `/applications/:applicationId/specialistComments`,
      async (context) => {
        try {
          const { data, pagination } = getAllApplicationSpecialistComments(
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
        params: PostSubmissionSpecialistsUrlParams,
        query: PostSubmissionSpecialistsQueryParams,
        response: {
          200: PostSubmissionSpecialistsResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get specialist comments',
          description:
            'Retrieves a list of all specialists and their comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId/specialistComments/:specialistId`,
      async (context) => {
        try {
          const data = getApplicationSpecialistComment(
            context.params.applicationId,
            context.params.specialistId
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
        params: PostSubmissionSpecialistUrlParams,
        response: {
          200: PostSubmissionSpecialistResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get specialist',
          description:
            "Retrieves a single specialist's comments, currently uses x-client header to filter by client"
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications/:applicationId/specialistComments`,
          async (context) => {
            try {
              const { data, pagination } =
                getAllPublishedApplicationSpecialistComments(
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
            params: PostSubmissionPublishedSpecialistsUrlParams,
            query: PostSubmissionPublishedSpecialistsQueryParams,
            response: {
              200: PostSubmissionPublishedSpecialistsResponse
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
          `/applications/:applicationId/specialistComments/:specialistId`,
          async (context) => {
            try {
              const data = getPublishedApplicationSpecialistComment(
                context.params.applicationId,
                context.params.specialistId
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
            params: PostSubmissionPublishedSpecialistUrlParams,
            response: {
              200: PostSubmissionPublishedSpecialistResponse
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
    )
