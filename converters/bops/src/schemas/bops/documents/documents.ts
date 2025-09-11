import { Type, type Static } from '@sinclair/typebox'
import { BopsApplication } from './../../shared/BopsApplication'
import { BopsFile } from './../../shared/BopsFile'
import '@dpr/odp-schemas/types/shared/formats'

export const BopsDocumentsEndpoint = Type.Object({
  application: BopsApplication,
  files: Type.Array(BopsFile, { uniqueItems: true }),
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
export type BopsDocumentsEndpoint = Static<typeof BopsDocumentsEndpoint>
