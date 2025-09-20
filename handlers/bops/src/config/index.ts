import { env } from '@dpr/libs'

interface Config {
  environment: string
  debug: boolean
  port: number
}

// Environment variables
// Use env variables or fallback to defaults
const environment = env?.NODE_ENV || env?.ENV || 'development'

// Debug mode, default to true in development
const debug = env?.DEBUG === 'true' || environment === 'development'

// Port number, default to 3000
const port = env?.PORT ? parseInt(env.PORT, 10) : 3000

const config: Config = {
  environment,
  debug,
  port
}

export default config
