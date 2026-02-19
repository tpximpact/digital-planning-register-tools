import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { AreaSchema } from './utils'

export type GeoBoundary = Static<typeof GeoBoundarySchema>
export const GeoBoundarySchema = Type.Object({
  site: Type.Any(), // GeoJSON
  area: AreaSchema
})
