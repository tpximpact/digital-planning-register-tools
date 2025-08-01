interface Config {
  environment: string
  port: number
  rateLimitMax: number
  rateLimitDuration: number
  authentication: boolean
}

const config: Config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  rateLimitMax: process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : 10,
  rateLimitDuration: process.env.RATE_LIMIT_DURATION
    ? parseInt(process.env.RATE_LIMIT_DURATION, 10)
    : 60000,
  authentication:
    process.env.AUTHENTICATION === 'true' ||
    process.env.NODE_ENV === 'development'
      ? true
      : false
}

export default config
