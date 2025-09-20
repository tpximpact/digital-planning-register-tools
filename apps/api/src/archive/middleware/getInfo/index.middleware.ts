import { Elysia, t } from 'elysia'
import { DprGetInfoError } from './DprGetInfo.error'
import { getPathFromRequest } from '../../libs'

/**
 * @file Types for authentication middleware
 */
export interface GetInfoOptions {
  debug: boolean
}

const defaultOptions: GetInfoOptions = {
  debug: false
}

/**
 * Plugin for elysia that ensures the request is authenticated.
 */
export function getInfo(userOptions: Partial<GetInfoOptions> = {}) {
  const options: GetInfoOptions = {
    ...defaultOptions,
    ...userOptions
  }

  if (options.debug) {
    console.info(`[getInfo] getInfo options: ${JSON.stringify(options)}`)
  }

  return new Elysia({
    name: 'getInfo'
  })
    .guard(
      {
        headers: t.Object({
          authorization: t.TemplateLiteral('Bearer ${string}')
        })
      },
      (app) =>
        app
          .resolve(({ headers: { authorization } }) => {
            return {
              bearer: authorization.split(' ')[1]
            }
          })
          .get('/', ({ bearer }) => bearer)
    )
    .onTransform(function log({ body, params, path, request: { method } }) {
      console.log('hello')
    })
    .derive((context) => {
      const reqPath = getPathFromRequest(context.request)

      // Client requesting the data eg camden
      const client = context.request.headers.get('x-client')
      // Service making the request eg dpr, bops
      const service = context.request.headers.get('x-service')

      if (options.debug) {
        console.info(
          `[getInfo] ${reqPath}: Client: ${client}, Service: ${service}`
        )
      }

      // No need for client/service headers for '/', documentation or healthcheck routes
      // if (
      //   reqPath === '/' ||
      //   reqPath.startsWith('/docs') ||
      //   reqPath === '/healthcheck'
      // ) {
      //   return
      // }

      if (!client || !service) {
        if (options.debug) {
          console.error(
            `[getInfo] ${reqPath}: Missing required headers x-client and x-service`
          )
        }
        throw new DprGetInfoError(
          `Missing required headers x-client and x-service`
        )
      }

      return {
        client,
        service
      }
    })
    .as('scoped')
  // .state('client', null as string | null)
  // .state('service', null as string | null)
  // .error({ DPR_GET_INFO_ERROR: DprGetInfoError })
  // .onRequest((context) => {
  //   const reqPath = getPathFromRequest(context.request)

  //   // No need for client/service headers for '/', documentation or healthcheck routes
  //   // if (
  //   //   reqPath === '/' ||
  //   //   reqPath.startsWith('/docs') ||
  //   //   reqPath === '/healthcheck'
  //   // ) {
  //   //   return
  //   // }

  //   // Client requesting the data eg camden
  //   const client = context.request.headers.get('x-client')
  //   // Service making the request eg dpr, bops
  //   const service = context.request.headers.get('x-service')

  //   if (options.debug) {
  //     console.info(
  //       `[getInfo] ${reqPath}: Client: ${client}, Service: ${service}`
  //     )
  //   }

  //   if (!client || !service) {
  //     if (options.debug) {
  //       console.error(
  //         `[getInfo] ${reqPath}: Missing required headers x-client and x-service`
  //       )
  //     }
  //     throw new DprGetInfoError(
  //       `Missing required headers x-client and x-service`
  //     )
  //   }

  //   context.store.client = client
  //   context.store.service = service
  // })
  // .guard({
  //   headers: t.Object({
  //     'x-client': t.String(),
  //     'x-service': t.String()
  //   })
  // })
  // .resolve((context) => {
  //   const reqPath = getPathFromRequest(context.request)

  //   // Client requesting the data eg camden
  //   const client = context.request.headers.get('x-client')
  //   // Service making the request eg dpr, bops
  //   const service = context.request.headers.get('x-service')

  //   if (options.debug) {
  //     console.info(
  //       `[getInfo] ${reqPath}: Client: ${client}, Service: ${service}`
  //     )
  //   }

  //   // No need for client/service headers for '/', documentation or healthcheck routes
  //   // if (
  //   //   reqPath === '/' ||
  //   //   reqPath.startsWith('/docs') ||
  //   //   reqPath === '/healthcheck'
  //   // ) {
  //   //   return
  //   // }

  //   if (!client || !service) {
  //     if (options.debug) {
  //       console.error(
  //         `[getInfo] ${reqPath}: Missing required headers x-client and x-service`
  //       )
  //     }
  //     throw new DprGetInfoError(
  //       `Missing required headers x-client and x-service`
  //     )
  //   }

  //   return {
  //     client,
  //     service
  //   }
  // })
  // .as('global')
  // .derive({ as: 'global' }, (context) => {
  //   const reqPath = getPathFromRequest(context.request)

  //   // Client requesting the data eg camden
  //   const client = context.request.headers.get('x-client')
  //   // Service making the request eg dpr, bops
  //   const service = context.request.headers.get('x-service')

  //   if (options.debug) {
  //     console.info(
  //       `[getInfo] ${reqPath}: Client: ${client}, Service: ${service}`
  //     )
  //   }

  //   // No need for client/service headers for '/', documentation or healthcheck routes
  //   // if (
  //   //   reqPath === '/' ||
  //   //   reqPath.startsWith('/docs') ||
  //   //   reqPath === '/healthcheck'
  //   // ) {
  //   //   return
  //   // }

  //   if (!client || !service) {
  //     if (options.debug) {
  //       console.error(
  //         `[getInfo] ${reqPath}: Missing required headers x-client and x-service`
  //       )
  //     }
  //     throw new DprGetInfoError(
  //       `Missing required headers x-client and x-service`
  //     )
  //   }

  //   return {
  //     client,
  //     service
  //   }
  // })
}

export default getInfo
