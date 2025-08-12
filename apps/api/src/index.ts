import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'

import { planningApplications } from './modules/planningApplications/@next/planningApplications.controller'

import { appSetup } from './modules/app/app.controller'
import { authentication, getInfo, handleErrors } from './middleware'
import config from './config'
import { swaggerConfig } from './modules/swagger'

// import appJson from 'digital-planning-data-schemas/schemas/application.json'
// import type { SiteAddress } from 'digital-planning-data-schemas/types/shared/Addresses.ts'
// const address: SiteAddress = {
//   title: 'Site Address',
//   x: 1,
//   y: 2,
//   latitude: 51.5074,
//   longitude: -0.1278
// }

const app = new Elysia()
  .use(getInfo)
  .use(cors({ origin: true }))
  .use(swagger(swaggerConfig))
  .use(appSetup)
  .use(
    authentication({
      enabled: config.authentication,
      debug: config.debug
    })
  )
  .use(planningApplications({ path: '/api/@next' }))
  // commented out because of type inheritance issues with Elysia just need to add parse: ['application/json'], for each route for now
  // This is a workaround for ensuring all routes are parsed as JSON see https://github.com/elysiajs/elysia-swagger/issues/215
  // .group('', { parse: ['application/json'] }, (group) =>
  //   group.use(appSetup).group('/api/@next', (app) => {
  //     return app.use(planningApplications())
  //   })
  // )
  .use(handleErrors)

export { app }
export type App = typeof app
