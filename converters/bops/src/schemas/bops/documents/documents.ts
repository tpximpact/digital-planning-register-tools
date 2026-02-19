import { Type, type Static } from '@sinclair/typebox'
import { BopsApplicationSchema } from './../../shared/BopsApplication'
import { BopsFileSchema } from './../../shared/BopsFile'
import '@dpr/odp-schemas/types/shared/formats'

export const BopsDocumentsEndpointSchema = Type.Object({
  application: BopsApplicationSchema,
  files: Type.Array(BopsFileSchema, { uniqueItems: true }),
  metadata: Type.Object({
    results: Type.Number(),
    totalResults: Type.Number()
  }),
  decisionNotice: Type.Optional(
    Type.Object({
      name: Type.String(),
      url: Type.String({ format: 'uri' })
    })
  )
})
export type BopsDocumentsEndpoint = Static<typeof BopsDocumentsEndpointSchema>
