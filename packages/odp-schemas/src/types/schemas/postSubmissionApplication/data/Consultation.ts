import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'

// type ConsultationBase = Static<typeof ConsultationBaseSchema>
const ConsultationBaseSchema = Type.Object({
  startDate: Type.String({ format: 'date' }),
  endDate: Type.String({ format: 'date' }),
  siteNotice: Type.Boolean({ todo: 'expiry and extensions?' })
})

// type ConsultationVariants = Static<typeof ConsultationVariantsSchema>
const ConsultationVariantsSchema = Type.Object({})

export type Consultation<T extends TSchema> = Static<
  ReturnType<typeof ConsultationSchema<T>>
>
export const ConsultationSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(ConsultationVariantsSchema),
    Type.Index(ConsultationVariantsSchema, T),
    ConsultationBaseSchema
  )
