import { Elysia } from 'elysia'
import { applications } from './modules/applications'
import { documents } from './modules/documents'
import { publicComments } from './modules/publicComments'
import { specialistComments } from './modules/specialistComments'
import { handleErrors, standardResponses } from '@dpr/api'

/**
 * @file Types for authentication middleware
 */
export interface HandlerBopsOptions {
  enabled: boolean
  debug: boolean
  prefix?: string
}

const defaultOptions: HandlerBopsOptions = {
  enabled: true,
  debug: false,
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
    .use(handleErrors)
    .use(applications)
    .use(documents)
    .use(publicComments)
    .use(specialistComments)
}

export { app }
export type App = typeof app
