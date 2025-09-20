import { Elysia, t } from 'elysia'

import { ApplicationService } from '../../../services'
import {
  ApplicationParamsSchema,
  ApplicationResponseSchema,
  ApplicationsQuerySchema,
  ApplicationsResponseSchema
} from './applications.schema'
import { apiRequiredHeaders } from '../../app/app.schema'
import { OkResponseObject, BadRequestResponseObject } from '../../../libs'
import { PostSubmissionApplicationsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/endpoints/ApplicationsEndpoint.ts'
import {
  PostSubmissionPublishedApplicationsEndpoint,
  PostSubmissionPublishedApplicationsSearchParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/ApplicationsEndpoint.ts'
import { PostSubmissionApplicationEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/endpoints/ApplicationEndpoint.ts'
import {
  PostSubmissionPublishedApplicationEndpoint,
  PostSubmissionPublishedApplicationParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/ApplicationEndpoint.ts'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication'

const defaultPath = 'applications'

interface ApplicationsOptions<Path extends string = typeof defaultPath> {
  /**
   * The endpoint to expose the content of the plugin.
   */
  path?: Path
}

/**
 * Plugin for elysia that generates the applications API.
 */
export const applications = <Path extends string = typeof defaultPath>({
  path = defaultPath as Path
}: ApplicationsOptions<Path> = {}) => {
  return new Elysia({
    name: 'applications',
    detail: {
      tags: ['Applications']
    }
  })
    .model({
      // Schemas for schemas section
      privateApplications: PostSubmissionApplicationsEndpoint,
      privateApplication: PostSubmissionApplicationEndpoint,
      publicApplications: PostSubmissionPublishedApplicationsEndpoint,
      publicApplication: PostSubmissionPublishedApplicationEndpoint
    })
    .group('/public', (app) => {
      return app.get(
        `/${path}`,
        async ({ set, query }) => {
          console.log('sup')
          try {
            const { pagination, applications: data } =
              await ApplicationService.getApplicationsOffsetPaginated(query)
            return {
              data,
              pagination,
              status: OkResponseObject
            }
          } catch {
            console.log('helloodododo')
            set.status = BadRequestResponseObject.code
            return {
              data: null,
              status: {
                ...BadRequestResponseObject,
                detail: 'Unable to fetch planning applications'
              }
            }
          }
        },
        {
          // headers: apiRequiredHeaders,
          // parse: ['application/json'],
          query: PostSubmissionPublishedApplicationsSearchParams,
          response: {
            200: PostSubmissionPublishedApplicationsEndpoint,
            400: ApiResponse(t.Null(), {
              description: 'Bad Request'
            }),
            500: ApiResponse(t.Null(), {
              description: 'Internal Server Error'
            })
          },
          detail: {
            security: [], // Remove this to make endpoint public
            summary: 'Get all private planning applications',
            description: 'Retrieve a list of all private planning applications'
          }
        }
      )
      // .get(
      //   `/${path}/:id`,
      //   async ({ set, params: { id } }) => {
      //     if (isNaN(Number(id))) {
      //       throw new Error('Invalid ID')
      //     }

      //     try {
      //       const application =
      //         await ApplicationService.getApplicationById(id)
      //       return {
      //         data: application,
      //         status: OkResponseObject
      //       }
      //     } catch {
      //       set.status = BadRequestResponseObject.code
      //       return {
      //         data: null,
      //         status: {
      //           ...BadRequestResponseObject,
      //           detail: 'Unable to fetch planning application'
      //         }
      //       }
      //     }
      //   },
      //   {
      //     headers: apiRequiredHeaders,
      //     parse: ['application/json'],
      //     params: PostSubmissionPublishedApplicationParams,
      //     response: {
      //       200: PostSubmissionPublishedApplicationEndpoint,
      //       400: ApiResponse(t.Null(), {
      //         description: 'Bad Request'
      //       }),
      //       500: ApiResponse(t.Null(), {
      //         description: 'Internal Server Error'
      //       })
      //     },
      //     // transform({ params }) {
      //     //   const id = +params.id

      //     //   if (!Number.isNaN(id)) params.id = id
      //     // },
      //     detail: {
      //       summary: 'Get planning application by ID',
      //       description: 'Retrieve a specific planning application by its ID'
      //     }
      //   }
      // )
    })
}

export type { ApplicationsOptions }
export default applications
