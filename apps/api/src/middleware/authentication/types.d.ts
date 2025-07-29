/**
 * @file Types for authentication middleware
 */
export interface DprAuthenticationOptions {
  enabled: boolean
  debug: boolean
}

export type AuthenticationMap = Record<
  Authentication['username'],
  Authentication
>

export interface Authentication {
  username: string
  password: string
}
