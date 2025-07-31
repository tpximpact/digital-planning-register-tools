import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { baseRoute, docsRoute, apiRoute } from './routes'

const app = new Elysia()
  .use(cors({ origin: true }))
  .use(docsRoute)
  .use(baseRoute)
  .use(apiRoute)

export { app }
export type App = typeof app
