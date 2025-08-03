import { Elysia, t } from 'elysia'
import PlanningApplicationService from '../PlanningApplication.service'
import {
  PlanningApplicationSchema,
  PlanningApplicationResponseSchema,
  PlanningApplicationPaginatedResponseSchema
} from '../PlanningApplication.schema'

const defaultPath = '/planningApplications'

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
    tags: ['Planning Applications']
  })
    .model({
      planningApplication: PlanningApplicationSchema,
      planningApplicationResponse: PlanningApplicationResponseSchema,
      planningApplicationPaginatedResponse:
        PlanningApplicationPaginatedResponseSchema
    })
    .get(
      '/',
      async ({ set }) => {
        console.log('Planning Applications > /')
        try {
          const applications =
            await PlanningApplicationService.getAllPlanningApplications()

          return {
            status: 'success',
            data: applications
          }
        } catch (error) {
          console.error(error)
          set.status = 500
          return { status: 'error', message: 'Internal Server Error' }
        }
      },
      {
        // response: 'apiResponse',
        // response: {
        //   200: t.Object({
        //     status: t.String(),
        //     data: t.Array(PlanningApplicationSchema)
        //   }),
        //   500: t.Object({
        //     status: t.String(),
        //     message: t.String()
        //   })
        // },
        detail: {
          summary: 'Get all planning applications',
          description: 'Retrieve a list of all planning applications'
        }
      }
    )
    .get(
      '/:id',
      ({ params: { id } }) => {
        console.log(`Planning Applications > /${id}`)
        if (isNaN(Number(id))) {
          throw new Error('Invalid ID')
        }

        const application =
          PlanningApplicationService.getPlanningApplicationById(id)
        return application
      },
      {
        params: t.Object({
          id: t.Number()
        }),
        transform({ params }) {
          const id = +params.id

          if (!Number.isNaN(id)) params.id = id
        },
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
