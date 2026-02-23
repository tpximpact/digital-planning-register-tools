import { Type, type Static, type TSchema } from '@sinclair/typebox'
import { AppealDecisionSchema } from '../enums/AppealDecision'
import '../../../shared/formats'
import { PostSubmissionFileRedactedSchema } from './File'

export type AppealBase = Static<typeof AppealBaseSchema>
export const AppealBaseSchema = Type.Object({
  reason: Type.String(),
  lodgedDate: Type.String({ format: 'date' }),
  validatedDate: Type.Optional(Type.String({ format: 'date' })),
  startedDate: Type.Optional(Type.String({ format: 'date' })),
  decisionDate: Type.Optional(Type.String({ format: 'date' })),
  decision: Type.Optional(AppealDecisionSchema),
  files: Type.Optional(Type.Array(PostSubmissionFileRedactedSchema))
})

// type AppealVariants = Static<typeof AppealVariantsSchema>
const AppealVariantsSchema = Type.Object({})

export type Appeal<T extends TSchema> = Static<
  ReturnType<typeof AppealSchema<T>>
>
export const AppealSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(AppealVariantsSchema),
    Type.Index(AppealVariantsSchema, T),
    AppealBaseSchema
  )
