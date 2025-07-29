import { env } from '@dpr/libs'

interface Config {
  environment: string
  debug: boolean
  port: number
  rateLimitMax: number
  rateLimitDuration: number
  authentication: boolean
}

// Environment variables
// Use env variables or fallback to defaults
const environment = env?.NODE_ENV || env?.ENV || 'development'

// Debug mode, default to true in development
const debug = env?.DEBUG === 'true' || environment === 'development'

// Port number, default to 3000
const port = env?.PORT ? parseInt(env.PORT, 10) : 3000

// Rate limit max requests, default to 10
const rateLimitMax = env?.RATE_LIMIT_MAX ? parseInt(env.RATE_LIMIT_MAX, 10) : 10

// Rate limit duration in milliseconds, default to 60 seconds
const rateLimitDuration = env?.RATE_LIMIT_DURATION
  ? parseInt(env.RATE_LIMIT_DURATION, 10)
  : 60000

// Authentication is true by default, can be overridden by environment variable
const authentication =
  env?.AUTHENTICATION === 'true'
    ? true
    : env?.AUTHENTICATION === 'false'
    ? false
    : true

const config: Config = {
  environment,
  debug,
  port,
  rateLimitMax,
  rateLimitDuration,
  authentication
}

export default config
