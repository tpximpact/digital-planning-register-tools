import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type returned = Static<typeof returnedSchema>
export const returnedSchema = Type.Literal('returned', {
  description: 'returned'
})

export type withdrawn = Static<typeof withdrawnSchema>
export const withdrawnSchema = Type.Literal('withdrawn', {
  description: 'withdrawn'
})

export type determined = Static<typeof determinedSchema>
export const determinedSchema = Type.Literal('determined', {
  description: 'determined'
})

export type undetermined = Static<typeof undeterminedSchema>
export const undeterminedSchema = Type.Literal('undetermined', {
  description: 'undetermined'
})

export type ApplicationStatus = Static<typeof ApplicationStatusSchema>
export const ApplicationStatusSchema = Type.Union(
  [returnedSchema, withdrawnSchema, determinedSchema, undeterminedSchema],
  {
    id: '#ApplicationStatus',
    description: 'Stages of the planning application process'
  }
)
