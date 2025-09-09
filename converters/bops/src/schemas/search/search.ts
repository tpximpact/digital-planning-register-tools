import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { BopsShowEndpoint } from '../show'

export const BopsSearchEndpoint = Type.Object({
  pagination: Pagination,
  data: Type.Union([
    Type.Null(),
    Type.Array(BopsShowEndpoint, { uniqueItems: true })
  ])
})
export type BopsSearchEndpoint = Static<typeof BopsSearchEndpoint>
