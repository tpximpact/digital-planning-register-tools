import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'

// type LocalPlanningAuthorityBase = Static<
//   typeof LocalPlanningAuthorityBaseSchema
// >
const LocalPlanningAuthorityBaseSchema = Type.Object({
  publicCommentsAcceptedUntilDecision: Type.Boolean()
})

// type LocalPlanningAuthorityVariants = Static<
//   typeof LocalPlanningAuthorityVariantsSchema
// >
const LocalPlanningAuthorityVariantsSchema = Type.Object({})

export type LocalPlanningAuthority<T extends TSchema> = Static<
  ReturnType<typeof LocalPlanningAuthoritySchema<T>>
>
export const LocalPlanningAuthoritySchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(LocalPlanningAuthorityVariantsSchema),
    Type.Index(LocalPlanningAuthorityVariantsSchema, T),
    LocalPlanningAuthorityBaseSchema
  )
