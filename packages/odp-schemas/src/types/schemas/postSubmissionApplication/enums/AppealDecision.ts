import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type allowed = Static<typeof allowedSchema>
export const allowedSchema = Type.Literal('allowed', { description: 'allowed' })

export type dismissed = Static<typeof dismissedSchema>
export const dismissedSchema = Type.Literal('dismissed', {
  description: 'dismissed'
})

export type splitDecision = Static<typeof splitDecisionSchema>
export const splitDecisionSchema = Type.Literal('splitDecision', {
  description: 'splitDecision'
})

export type withdrawn = Static<typeof withdrawnSchema>
export const withdrawnSchema = Type.Literal('withdrawn', {
  description: 'withdrawn'
})

export type AppealDecision = Static<typeof AppealDecisionSchema>
export const AppealDecisionSchema = Type.Union(
  [allowedSchema, dismissedSchema, splitDecisionSchema, withdrawnSchema],
  { id: '#AppealDecision', description: 'Types of comments' }
)
