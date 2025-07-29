import type { Static } from 'elysia'
import { t } from 'elysia'

/**
 * Schema for a planning application.
 */
export const PostSubmissionPlanningApplicationSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  // createdAt: t.Date(),
  createdAt: t.String({ format: 'date-time' }),
  // updatedAt: t.Date()
  updatedAt: t.String({ format: 'date-time' })
})

/**
 * Type for a planning application.
 */
export type PostSubmissionPlanningApplication = Static<
  typeof PostSubmissionPlanningApplicationSchema
>
