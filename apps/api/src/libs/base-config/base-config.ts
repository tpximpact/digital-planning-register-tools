interface BaseConfig {
  environment: string
  debug: boolean
  port: number
}

// Environment variables
// Use env variables or fallback to defaults
const environment = process.env?.NODE_ENV || process.env?.ENV || 'development'

// Debug mode, default to true in development
const debug = process.env?.DEBUG === 'true' || environment === 'development'

// Port number, default to 3000
const port = process.env?.PORT ? parseInt(process.env.PORT, 10) : 3000

export const config: BaseConfig = {
  environment,
  debug,
  port
}

export type { BaseConfig }
