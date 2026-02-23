import { CloneType, Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import { ProcessStageSchema } from '../enums/ProcessStage'
import { ApplicationStatusSchema } from '../enums/ApplicationStatus'
import '../../../shared/formats'

// type ApplicationBase = Static<typeof ApplicationBaseSchema>
const ApplicationBaseSchema = Type.Object({
  reference: Type.String({
    todo: 'this needs to be added into other application schemas'
  }),
  stage: CloneType(ProcessStageSchema, {
    todo: 'certain application types do not have a consultation phase'
  }),
  status: ApplicationStatusSchema,
  withdrawnAt: Type.Optional(Type.String({ format: 'date-time' })),
  withdrawnReason: Type.Optional(Type.String()),
  publishedAt: Type.Optional(Type.String({ format: 'date-time' }))
})

// type ApplicationVariants = Static<typeof ApplicationVariantsSchema>
const ApplicationVariantsSchema = Type.Object({})

export type Application<T extends TSchema> = Static<
  ReturnType<typeof ApplicationSchema<T>>
>
export const ApplicationSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(ApplicationVariantsSchema),
    Type.Index(ApplicationVariantsSchema, T),
    ApplicationBaseSchema
  )
