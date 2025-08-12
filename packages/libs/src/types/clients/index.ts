import { Type, type Static } from '@sinclair/typebox'

export const Client = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  endpoint: Type.String(),
  lastPolledAt: Type.Union([Type.Date(), Type.Null()]),
  updatedAt: Type.Date(),
  createdAt: Type.Date()
})

export type Client = Static<typeof Client>

export const Clients = Type.Array(Client)

export type Clients = Static<typeof Clients>
