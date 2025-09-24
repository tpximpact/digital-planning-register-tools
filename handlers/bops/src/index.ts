import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { standardResponses, clientHeaders } from '@dpr/api'

/**
 * @file Types for authentication middleware
 */
export interface HandlerBopsOptions {
  enabled: boolean
  debug: boolean
  openApiEnabled: boolean
  prefix?: string
}

const defaultOptions: HandlerBopsOptions = {
  enabled: true,
  debug: false,
  openApiEnabled: false,
  prefix: ''
}

const app = (userOptions?: HandlerBopsOptions) => {
  const options: HandlerBopsOptions = {
    ...defaultOptions,
    ...userOptions
  }

  if (options.debug) {
    console.info(`[handler BOPS] options: ${JSON.stringify(options)}`)
  }
  return new Elysia({
    name: 'handler BOPS',
    detail: {
      tags: ['BOPS Handler']
    }
  })
    .use(
      openapi({
        enabled: options.openApiEnabled,
        path: '/bopsHandler'
      })
    )
    .use(standardResponses.standardResponses)
    .use(clientHeaders.requireClientHeaders)
    .use(applications)
    .use(documents)
    .use(publicComments)
    .use(specialistComments)
    .onError((context) => {
      console.log('context', context)
    })
}

export { app }
export type App = typeof app
