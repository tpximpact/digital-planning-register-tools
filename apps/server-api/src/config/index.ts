import { env } from '@libs/env'

interface Config {
  environment: string
  debug: boolean
  port: number
  rateLimitMax: number
  rateLimitDuration: number
  authentication: boolean
}

const config: Config = {
  environment: env?.NODE_ENV || env?.ENV || 'development',
  debug:
    env?.DEBUG === 'true' ||
    env?.NODE_ENV === 'development' ||
    env?.ENV === 'development',
  port: env?.PORT ? parseInt(env.PORT, 10) : 3000,
  rateLimitMax: env?.RATE_LIMIT_MAX ? parseInt(env.RATE_LIMIT_MAX, 10) : 10,
  rateLimitDuration: env?.RATE_LIMIT_DURATION
    ? parseInt(env.RATE_LIMIT_DURATION, 10)
    : 60000,
  authentication:
    env?.AUTHENTICATION === 'true' || env?.NODE_ENV === 'development'
      ? true
      : false
}

export default config
