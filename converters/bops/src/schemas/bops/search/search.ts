import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { PaginationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { BopsShowEndpointSchema } from '../show'

export const BopsSearchEndpointSchema = Type.Object({
  pagination: PaginationSchema,
  data: Type.Union([
    Type.Null(),
    Type.Array(BopsShowEndpointSchema, { uniqueItems: true })
  ])
})
export type BopsSearchEndpoint = Static<typeof BopsSearchEndpointSchema>
