import {
  ApiResponseSchema,
  PostSubmissionPlanningApplicationSchema
} from '@apps/server-api/schemas'
import { t, type Static } from 'elysia'

/**
 * Schema for the /planningApplications API response.
 */
export const PlanningApplicationsResponseSchema = ApiResponseSchema(
  t.Array(PostSubmissionPlanningApplicationSchema),
  {
    description: `Successful response`
  }
)
export type PlanningApplicationsResponse = Static<
  typeof PlanningApplicationsResponseSchema
>

/**
 * Schema for the /planningApplications queries.
 */
export const PlanningApplicationsQuerySchema = t.Optional(
  t.Object({
    page: t.Optional(t.Number({ default: 1 })),
    resultsPerPage: t.Optional(t.Number({ default: 10 }))
  })
)

/**
 * Schema for the /planningApplication params.
 */
export const PlanningApplicationParamsSchema = t.Object({
  id: t.Number()
})
