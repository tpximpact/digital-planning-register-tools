import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import '../../../shared/formats'

export type SubmissionBase = Static<typeof SubmissionBaseSchema>
export const SubmissionBaseSchema = Type.Object({
  submittedAt: Type.String({ format: 'date-time' })
})

export type SubmissionVariants = Static<typeof SubmissionVariantsSchema>
export const SubmissionVariantsSchema = Type.Object({})

export type Submission<T extends TSchema> = Static<
  ReturnType<typeof SubmissionSchema<T>>
>
export const SubmissionSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(SubmissionVariantsSchema),
    Type.Index(SubmissionVariantsSchema, T),
    SubmissionBaseSchema
  )
