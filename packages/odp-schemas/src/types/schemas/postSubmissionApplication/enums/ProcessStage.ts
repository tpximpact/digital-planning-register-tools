import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type submission = Static<typeof submissionSchema>
export const submissionSchema = Type.Literal('submission', {
  description: 'Submission'
})

export type validation = Static<typeof validationSchema>
export const validationSchema = Type.Literal('validation', {
  description: 'Validation'
})

export type consultation = Static<typeof consultationSchema>
export const consultationSchema = Type.Literal('consultation', {
  description: 'Consultation'
})

export type assessment = Static<typeof assessmentSchema>
export const assessmentSchema = Type.Literal('assessment', {
  description: 'Assessment'
})

export type appeal = Static<typeof appealSchema>
export const appealSchema = Type.Literal('appeal', { description: 'Appeal' })

export type highCourtAppeal = Static<typeof highCourtAppealSchema>
export const highCourtAppealSchema = Type.Literal('highCourtAppeal', {
  description: 'High court appeal'
})

export type ProcessStage = Static<typeof ProcessStageSchema>
export const ProcessStageSchema = Type.Union(
  [
    submissionSchema,
    validationSchema,
    consultationSchema,
    assessmentSchema,
    appealSchema,
    highCourtAppealSchema
  ],
  {
    id: '#ProcessStage',
    description: 'Stages of the planning application process'
  }
)
