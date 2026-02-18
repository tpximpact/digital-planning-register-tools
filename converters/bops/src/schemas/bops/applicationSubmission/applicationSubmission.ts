import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { BopsApplicationSchema } from '../../shared/BopsApplication'

export const BopsApplicationSubmissionEndpointSchema = Type.Object({
  application: BopsApplicationSchema,
  submission: Type.Any()
})
export type BopsApplicationSubmissionEndpoint = Static<
  typeof BopsApplicationSubmissionEndpointSchema
>
