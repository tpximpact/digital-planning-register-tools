import { Type, type Static, type TSchema } from '@sinclair/typebox'
import { AppealDecision } from '../enums/AppealDecision'
import '../../utils'
import { PostSubmissionFile } from './PostSubmissionFile'

type AppealBase = Static<typeof AppealBase>
const AppealBase = Type.Object({
  reason: Type.String(),
  lodgedDate: Type.String({ format: 'date' }),
  validatedDate: Type.Optional(Type.String({ format: 'date' })),
  startedDate: Type.Optional(Type.String({ format: 'date' })),
  decisionDate: Type.Optional(Type.String({ format: 'date' })),
  decision: Type.Optional(AppealDecision),
  files: Type.Optional(Type.Array(PostSubmissionFile))
})

type AppealVariants = Static<typeof AppealVariants>
const AppealVariants = Type.Object({})

export type Appeal<T extends TSchema> = Static<
  ReturnType<typeof AppealSchema<T>>
>
export const AppealSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(AppealVariants),
    Type.Index(AppealVariants, T),
    AppealBase
  )
