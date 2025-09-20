import type Elysia from 'elysia'
import { t, type Static } from 'elysia'

export const Headers = t.Object({
  'x-client': t.String(),
  'x-service': t.String()
})
export type Headers = Static<typeof Headers>

export const setupEndpoint = (app: Elysia) =>
  app
    .guard({
      // headers: Headers
    })
    .resolve(({ headers: { 'x-client': client, 'x-service': service } }) => {
      if (!client || !service) {
        throw new Error('Missing x-client or x-service header')
      }
      return { client, service }
    })

export const resolveClientService = (app: Elysia) =>
  app.resolve(({ headers: { 'x-client': client, 'x-service': service } }) => {
    if (!client || !service) {
      throw new Error('Missing x-client or x-service header')
    }
    return { client, service }
  })
