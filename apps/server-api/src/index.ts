import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'

import { planningApplications } from './modules/planningApplications/@next/planningApplications.controller'

import { appSetup } from './modules/app/app.controller'
import { authentication } from './middleware'
import config from './config'

const app = new Elysia()
  // .use(rateLimiting)
  .onRequest(() => {
    console.log(`onRequest 1: ${new Date().toISOString()}`)
  })
  .use(
    authentication({
      enabled: config.authentication,
      debug: config.environment === 'development'
    })
  )
  .get('/test', ({ store: { dprAuthenticated } }) => {
    console.log(dprAuthenticated)
    return {
      dprAuthenticated,
      environment: config.environment
    }
  })
  .use(cors({ origin: true }))
  .derive(({ headers }) => {
    const client = headers['x-client'] as string | undefined
    const service = headers['x-service'] as string | undefined
    console.log(
      `Request from ${service ?? 'unknown service'} on behalf of ${client ?? 'unknown client'}`
    )
    return {
      client: client ?? null,
      service: service ?? null
    }
  })
  .get('/details', ({ client, service }) => ({ client, service }))
  .use(swagger())
  // This is a workaround for ensuring all routes are parsed as JSON see https://github.com/elysiajs/elysia-swagger/issues/215
  .group('', { parse: ['application/json'] }, (group) =>
    group
      .onRequest(() => {
        console.log(`onRequest 2: ${new Date().toISOString()}`)
      })
      .use(appSetup)
      .group('/api/@next', (app) => {
        return app.use(planningApplications())
      })
  )

export { app }
export type App = typeof app
