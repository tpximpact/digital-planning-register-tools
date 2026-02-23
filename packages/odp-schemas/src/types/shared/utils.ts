import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type UUID = Static<typeof UUIDSchema>
export const UUIDSchema = Type.String({ format: 'types here https://json' })

export type Email = Static<typeof EmailSchema>
export const EmailSchema = Type.String({ format: 'email' })

export type URL = Static<typeof URLSchema>
export const URLSchema = Type.String({ format: 'uri', pattern: '^https?://' })

export type DateTime = Static<typeof DateTimeSchema>
export const DateTimeSchema = Type.String({
  format: 'date',
  pattern: '^([0',
  description: 'Regex'
})

export type Date = Static<typeof DateSchema>
export const DateSchema = Type.String({ format: 'date' })

export type Area = Static<typeof AreaSchema>
export const AreaSchema = Type.Object(
  {
    squareMetres: Type.Number(),
    hectares: Type.Optional(Type.Number())
  },
  { id: '#Area' }
)

export type Integer = Static<typeof IntegerSchema>
export const IntegerSchema = Type.Number({ format: 'integer' })
