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
import { standardResponseObjects } from '../../libs/standard-responses'
import {
  getAllApplications,
  getApplication,
  getAllPublishedApplications,
  getPublishedApplication
} from '@dpr/handler-local'
/**
 * Plugin for elysia that generates the planning applications API.
 */
export const applications = (app: Elysia) =>
  app
    .get(
      `/applications`,
      async (context) => {
        try {
          const { data, pagination } = getAllApplications(context.query)
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
        query: PostSubmissionApplicationsQueryParams,
        response: {
          200: PostSubmissionApplicationsResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get applications',
          description:
            'Retrieves an unredacted list of all applications, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId`,
      async (context) => {
        try {
          const data = getApplication(context.params.applicationId)
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
        params: PostSubmissionApplicationUrlParams,
        response: {
          // 200: PostSubmissionApplicationResponse
        },
        detail: {
          tags: ['Private'],
          security: [], // Remove this to make endpoint public
          summary: 'Get application',
          description:
            'Retrieves a single unredacted application, currently uses x-client header to filter by client'
        }
      }
    )
    .group('/public', (app) =>
      app
        .get(
          `/applications`,
          async (context) => {
            try {
              const { data, pagination } = getAllPublishedApplications(
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
            query: PostSubmissionPublishedApplicationsQueryParams,
            response: {
              200: PostSubmissionPublishedApplicationsResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get published applications',
              description:
                'Retrieves a redacted list of all applications, currently uses x-client header to filter by client'
            }
          }
        )
        .get(
          `/applications/:applicationId`,
          async (context) => {
            try {
              const data = getPublishedApplication(context.params.applicationId)
              console.log(data)
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
            params: PostSubmissionPublishedApplicationUrlParams,
            response: {
              200: PostSubmissionPublishedApplicationResponse
            },
            detail: {
              tags: ['Public'],
              security: [], // Remove this to make endpoint public
              summary: 'Get published application',
              description:
                'Retrieves a single redacted application, currently uses x-client header to filter by client'
            }
          }
        )
    )
