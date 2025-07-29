import {
  ApiResponseSchema,
  ApiPaginatedResponseSchema,
  PostSubmissionPlanningApplicationSchema
} from '../../../schemas'
import { t, type Static } from 'elysia'

/**
 * Schema for the /planningApplications API response.
 */
export const PlanningApplicationsResponseSchema = ApiPaginatedResponseSchema(
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
export const PlanningApplicationsQuerySchema = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  resultsPerPage: t.Optional(t.Number({ default: 10 }))
})
export type PlanningApplicationsQuery = Static<
  typeof PlanningApplicationsQuerySchema
>

/**
 * Schema for the /planningApplications API response.
 */
export const PlanningApplicationResponseSchema = ApiResponseSchema(
  PostSubmissionPlanningApplicationSchema,
  {
    description: `Successful response`
  }
)
export type PlanningApplicationResponse = Static<
  typeof PlanningApplicationResponseSchema
>

/**
 * Schema for the /planningApplication params.
 */
export const PlanningApplicationParamsSchema = t.Object({
  id: t.Number()
})
