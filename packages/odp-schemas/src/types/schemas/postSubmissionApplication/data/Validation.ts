import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import '../../../shared/formats'

export type ValidationBase = Static<typeof ValidationBaseSchema>
const ValidationBaseSchema = Type.Object({
  receivedAt: Type.String({ format: 'date-time' }),
  validatedAt: Type.Optional(Type.String({ format: 'date-time' })),
  isValid: Type.Optional(Type.Boolean())
})

export type ValidationVariants = Static<typeof ValidationVariantsSchema>
const ValidationVariantsSchema = Type.Object({})

export type Validation<T extends TSchema> = Static<
  ReturnType<typeof ValidationSchema<T>>
>
export const ValidationSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(ValidationVariantsSchema),
    Type.Index(ValidationVariantsSchema, T),
    ValidationBaseSchema
  )
