import { Elysia } from 'elysia'
import type { DprAuthenticationOptions } from './types'
import {
  checkAuthentication,
  parseAuthenticationHeader,
  validAuthentication
} from './auth'
import { DprAuthenticationError } from '@apps/server-api/errors'
import { buildApiErrorResponse } from '../handleErrors/utils'
import { getPathFromRequest } from '@apps/server-api/libs'

const defaultOptions: DprAuthenticationOptions = {
  enabled: true,
  debug: false
}

/**
 * Checks if the requested path is allowed (does NOT require authentication)
 * @param context
 * @returns
 */
const pathAllowed = (reqPath: string): boolean => {
  // allows /, /docs, /healthcheck and /public/ paths without authentication
  const allowedPaths = ['/docs', '/healthcheck']
  return (
    reqPath === '/' ||
    allowedPaths.some((s) => reqPath.startsWith(s)) ||
    reqPath.includes('/public/')
  )
}

/**
 * Plugin for elysia that ensures the request is authenticated.
 */
export function authentication(
  userOptions: Partial<DprAuthenticationOptions> = {}
) {
  const options: DprAuthenticationOptions = {
    ...defaultOptions,
    ...userOptions
  }

  if (options.debug) {
    console.info(
      `[authentication] Authentication options: ${JSON.stringify(options)}`
    )
  }

  const realm = 'DPR API Authentication'
  const authMap = validAuthentication()

  return new Elysia({
    name: 'authentication',
    seed: options
  })
    .state('dprAuthenticated', false as boolean | null)
    .error({ DPR_AUTHENTICATION_ERROR: DprAuthenticationError })
    .onError({ as: 'global' }, ({ code, error }) => {
      // Normally we'd handle this in error handle middleware but this one needs an extra check so we catch it here instead
      if (code === 'DPR_AUTHENTICATION_ERROR' && error.realm === realm) {
        const response = buildApiErrorResponse(error)
        return Response.json(response, {
          status: response.status?.code
        })
      }
    })
    .onRequest((context) => {
      if (options.enabled) {
        const reqPath = getPathFromRequest(context.request)
        if (!pathAllowed(reqPath)) {
          if (options.debug) {
            console.log(`[auth] Path ${reqPath} requires authentication`)
          }
          const authHeader = context.request.headers.get('Authorization')
          if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
            throw new DprAuthenticationError(
              'Invalid authorisation header',
              realm
            )
          }
          const credentials = parseAuthenticationHeader(authHeader)
          if (!checkAuthentication(credentials, authMap)) {
            throw new DprAuthenticationError('Invalid credentials', realm)
          }
          context.store.dprAuthenticated = true
        } else {
          if (options.debug) {
            console.log(
              `[auth] Path ${reqPath} is allowed, skipping auth check`
            )
          }
          context.store.dprAuthenticated = null
        }
      }
    })
}

export default authentication
