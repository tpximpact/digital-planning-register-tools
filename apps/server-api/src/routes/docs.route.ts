import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

export const docsRoute = new Elysia().use(
  swagger()
  // {
  // path: '/docs'
  // @TODO add open-api here
  // }
)
