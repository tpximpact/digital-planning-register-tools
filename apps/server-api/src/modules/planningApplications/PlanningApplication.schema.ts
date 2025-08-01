import type { Static } from 'elysia'
import { t } from 'elysia'
import {
  ApiPaginatedResponseSchema,
  ApiResponseSchema
} from '../app/app.schema'

export const PlanningApplicationSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date()
})

export type PlanningApplication = Static<typeof PlanningApplicationSchema>

export const PlanningApplicationResponseSchema = ApiResponseSchema(
  PlanningApplicationSchema
)

export type PlanningApplicationResponse = Static<
  typeof PlanningApplicationResponseSchema
>

export const PlanningApplicationPaginatedResponseSchema =
  ApiPaginatedResponseSchema(PlanningApplicationSchema)

export type PlanningApplicationPaginatedResponse = Static<
  typeof PlanningApplicationPaginatedResponseSchema
>
