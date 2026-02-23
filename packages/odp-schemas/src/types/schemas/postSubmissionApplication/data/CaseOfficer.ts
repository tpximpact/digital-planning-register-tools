import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'

export type CaseOfficerBase = Static<typeof CaseOfficerBaseSchema>
export const CaseOfficerBaseSchema = Type.Object({
  name: Type.String()
})

// type CaseOfficerVariants = Static<typeof CaseOfficerVariantsSchema>
const CaseOfficerVariantsSchema = Type.Object({})

export type CaseOfficer<T extends TSchema> = Static<
  ReturnType<typeof CaseOfficerSchema<T>>
>
export const CaseOfficerSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(CaseOfficerVariantsSchema),
    Type.Index(CaseOfficerVariantsSchema, T),
    CaseOfficerBaseSchema
  )
