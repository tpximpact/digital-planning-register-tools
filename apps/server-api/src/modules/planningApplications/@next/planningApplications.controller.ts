import { Elysia } from 'elysia'
import { PostSubmissionPlanningApplicationSchema } from '@apps/server-api/schemas'
import { PlanningApplicationService } from '@apps/server-api/services'
import {
  PlanningApplicationParamsSchema,
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
      async ({ set }) => {
        try {
          const applications =
            await PlanningApplicationService.getAllPlanningApplications()
          return {
            data: applications,
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
          200: PlanningApplicationsResponseSchema
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
      ({ set, params: { id } }) => {
        if (isNaN(Number(id))) {
          throw new Error('Invalid ID')
        }

        try {
          const application =
            PlanningApplicationService.getPlanningApplicationById(id)
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
              detail: 'Unable to fetch planning applications'
            }
          }
        }
      },
      {
        headers: apiRequiredHeaders,
        parse: ['application/json'],
        params: PlanningApplicationParamsSchema,

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
