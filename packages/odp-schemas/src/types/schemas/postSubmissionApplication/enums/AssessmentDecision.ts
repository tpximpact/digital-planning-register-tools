import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type granted = Static<typeof grantedSchema>
export const grantedSchema = Type.Literal('granted', { description: 'Granted' })

export type refused = Static<typeof refusedSchema>
export const refusedSchema = Type.Literal('refused', { description: 'Refused' })

export type AssessmentDecision = Static<typeof AssessmentDecisionSchema>
export const AssessmentDecisionSchema = Type.Union(
  [grantedSchema, refusedSchema],
  {
    id: '#AssessmentDecision',
    description: 'Types of comments'
  }
)
