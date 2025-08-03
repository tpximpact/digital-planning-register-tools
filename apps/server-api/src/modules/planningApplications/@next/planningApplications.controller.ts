import { Elysia, t } from 'elysia'
import {
  ApiResponseSchema,
  PostSubmissionPlanningApplicationSchema
} from '@apps/server-api/schemas'
import { PlanningApplicationService } from '@apps/server-api/services'
import {
  PlanningApplicationParamsSchema,
  PlanningApplicationResponseSchema,
  PlanningApplicationsQuerySchema,
  PlanningApplicationsResponseSchema
} from './planningApplications.schema'
import { apiRequiredHeaders } from '../../app/app.schema'
import {
  OkResponseObject,
  BadRequestResponseObject
} from '@apps/server-api/libs'

const defaultPath = 'planningApplications'

interface PlanningApplicationsOptions<
  Path extends string = typeof defaultPath
> {
  /**
   * The endpoint to expose the content of the plugin.
   */
  path?: Path
}

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const planningApplications = <Path extends string = typeof defaultPath>({
  path = defaultPath as Path
}: PlanningApplicationsOptions<Path> = {}) => {
  const app = new Elysia({
    name: 'planningApplications',
    prefix: path,
    detail: {
      tags: ['Planning Applications']
    }
  })
    .model({
      // Schemas for schemas section
      PostSubmissionPlanningApplication: PostSubmissionPlanningApplicationSchema
    })
    .get(
      `/public/${defaultPath}`,
      async ({ set, query }) => {
        try {
          const { pagination, applications: data } =
            await PlanningApplicationService.getPlanningApplicationsOffsetPaginated(
              query
            )
          return {
            data,
            pagination,
            status: OkResponseObject
          }
        } catch {
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
        headers: apiRequiredHeaders,
        parse: ['application/json'],
        query: PlanningApplicationsQuerySchema,
        response: {
          200: PlanningApplicationsResponseSchema,
          400: ApiResponseSchema(t.Null(), {
            description: 'Bad Request'
          }),
          500: ApiResponseSchema(t.Null(), {
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
    .get(
      `/public/${defaultPath}/:id`,
      async ({ set, params: { id } }) => {
        if (isNaN(Number(id))) {
          throw new Error('Invalid ID')
        }

        try {
          const application =
            await PlanningApplicationService.getPlanningApplicationById(id)
          return {
            data: application,
            status: OkResponseObject
          }
        } catch {
          set.status = BadRequestResponseObject.code
          return {
            data: null,
            status: {
              ...BadRequestResponseObject,
              detail: 'Unable to fetch planning application'
            }
          }
        }
      },
      {
        headers: apiRequiredHeaders,
        parse: ['application/json'],
        params: PlanningApplicationParamsSchema,
        response: {
          200: PlanningApplicationResponseSchema,
          400: ApiResponseSchema(t.Null(), {
            description: 'Bad Request'
          }),
          500: ApiResponseSchema(t.Null(), {
            description: 'Internal Server Error'
          })
        },
        // transform({ params }) {
        //   const id = +params.id

        //   if (!Number.isNaN(id)) params.id = id
        // },
        detail: {
          summary: 'Get planning application by ID',
          description: 'Retrieve a specific planning application by its ID'
        }
      }
    )

  return app
}

export type { PlanningApplicationsOptions }
export default planningApplications
