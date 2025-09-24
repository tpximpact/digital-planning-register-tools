import { baseConfig } from '..'

interface Config extends baseConfig.BaseConfig {
  rateLimitMax: number
  rateLimitDuration: number
  authentication: boolean
}

// Rate limit max requests, default to 10
const rateLimitMax = process.env?.RATE_LIMIT_MAX
  ? parseInt(process.env.RATE_LIMIT_MAX, 10)
  : 10

// Rate limit duration in milliseconds, default to 60 seconds
const rateLimitDuration = process.env?.RATE_LIMIT_DURATION
  ? parseInt(process.env.RATE_LIMIT_DURATION, 10)
  : 60000

// Authentication is true by default, can be overridden by environment variable
const authentication =
  process.env?.AUTHENTICATION === 'true'
    ? true
    : process.env?.AUTHENTICATION === 'false'
    ? false
    : true

export const config: Config = {
  ...baseConfig.config,
  rateLimitMax,
  rateLimitDuration,
  authentication
}

export type { Config }
