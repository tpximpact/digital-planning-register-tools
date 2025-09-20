import type { Authentication, AuthenticationMap } from './types'
import { strSafeEqual } from './utils'

/**
 * Validates the authentication credentials from the environment variable.
 * @returns AuthenticationMap
 */
export function validAuthentication(): AuthenticationMap {
  return (process.env.AUTHENTICATION_CREDENTIALS || '')
    .split(';')
    .reduce((m, cStr) => {
      const [username, password] = cStr.split(':')
      if (!username || !password) return m
      return { ...m, [username]: { username, password } }
    }, {})
}

/**
 * Parses the Authorization header and returns a Authentication object
 * @param authHeader
 * @returns
 */
export function parseAuthenticationHeader(authHeader: string): Authentication {
  const [_, token = ''] = authHeader.split(' ')
  const [username, password] = Buffer.from(token, 'base64')
    .toString('utf-8')
    .split(':')
  return newAuthentication({ username, password })
}

/**
 * Creates a new authentication object with default values.
 * @param attrs Partial authentication attributes to override defaults.
 * @returns A new Authentication object.
 */
export function newAuthentication(
  attrs?: Partial<Authentication>
): Authentication {
  return { username: '', password: '', ...attrs }
}

/**
 * Checks authentication in a timing-safe manner
 */
export function checkAuthentication(
  challenge: Authentication,
  authMap: Record<string, Authentication>
) {
  let valid = !!(challenge.username && challenge.password)
  const reference = authMap[challenge.username]
  valid = strSafeEqual(challenge.username, reference?.username || '') && valid
  valid = strSafeEqual(challenge.password, reference?.password || '') && valid
  return valid
}
