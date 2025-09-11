import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { BopsApplication } from '../../shared/BopsApplication'

export const BopsApplicationSubmissionEndpoint = Type.Object({
  application: BopsApplication,
  submission: Type.Any()
})
export type BopsApplicationSubmissionEndpoint = Static<
  typeof BopsApplicationSubmissionEndpoint
>
