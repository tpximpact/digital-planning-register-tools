// @ts-check

// Determine the environment, default to 'production'
const ENVIRONMENT = process.env?.NODE_ENV || process.env?.ENV || 'development'

// Debug mode, default to true in development otherwise false
export const DEBUG =
  process.env?.DEBUG === 'true' || ENVIRONMENT === 'development'

// Port number, default to 3000 if not specified (default inside of docker container)
export const PORT = (port = 3000) =>
  process.env.PORT ? parseInt(process.env.PORT, 10) : port

// Hostname, default to '0.0.0.0' to listen on all interfaces
export const HOSTNAME = process.env?.HOSTNAME || '0.0.0.0'

const ports = {
  'apps-admin': 3000,
  'apps-api': 4000,
  'handlers-bops': 4001,
  'playground-react-app': 3001
}

// Admin environment variables

export const ENV_ADMIN = {
  PORT: PORT(ports['apps-admin']),
  HOSTNAME,
  DATABASE_URL:
    ENVIRONMENT === 'development'
      ? 'postgresql://dpr:password@localhost:5433/dpr'
      : process.env.DATABASE_URL ?? '',
  INTERNAL_API_TOKEN:
    ENVIRONMENT === 'development'
      ? 'i-am-the-admin-coo-coo-ca-choo'
      : process.env.INTERNAL_API_TOKEN ?? ''
}

// BOPS handler vars

export const ENV_HANDLER_BOPS = {
  ENVIRONMENT,
  DEBUG,
  PORT: PORT(ports['handlers-bops']),
  HOSTNAME,
  // DATABASE_URL:
  //   ENVIRONMENT === 'development'
  //     ? 'postgresql://dpr:password@localhost:5433/dpr'
  //     : process.env.DATABASE_URL ?? '',
  INTERNAL_API_TOKEN:
    ENVIRONMENT === 'development'
      ? 'i-am-the-admin-coo-coo-ca-choo'
      : process.env.INTERNAL_API_TOKEN ?? '',
  // if applications endpoint is still in 'legacy' mode (ie not ODP yet)
  BOPS_LEGACY_APPLICATIONS:
    process.env.BOPS_LEGACY_APPLICATIONS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_APPLICATION:
    process.env.BOPS_LEGACY_APPLICATION === 'true' ? 'true' : 'false',
  BOPS_LEGACY_DOCUMENTS:
    process.env.BOPS_LEGACY_DOCUMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_PUBLIC_COMMENTS:
    process.env.BOPS_LEGACY_PUBLIC_COMMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_SPECIALIST_COMMENTS:
    process.env.BOPS_LEGACY_SPECIALIST_COMMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_SPECIALIST_COMMENT:
    process.env.BOPS_LEGACY_SPECIALIST_COMMENT === 'true' ? 'true' : 'false'
}

// applications - api

export const ENV_HANDLER_API = {
  ENVIRONMENT,
  DEBUG,
  PORT: PORT(ports['apps-api']),
  HOSTNAME,
  DATABASE_URL:
    ENVIRONMENT === 'development'
      ? 'postgresql://dpr:password@localhost:5433/dpr'
      : process.env.DATABASE_URL ?? '',
  API_BASE_URL:
    process.env.API_BASE_URL || `http://localhost:${PORT(ports['apps-api'])}`,
  // if applications endpoint is still in 'legacy' mode (ie not ODP yet)
  BOPS_LEGACY_APPLICATIONS:
    process.env.BOPS_LEGACY_APPLICATIONS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_APPLICATION:
    process.env.BOPS_LEGACY_APPLICATION === 'true' ? 'true' : 'false',
  BOPS_LEGACY_DOCUMENTS:
    process.env.BOPS_LEGACY_DOCUMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_PUBLIC_COMMENTS:
    process.env.BOPS_LEGACY_PUBLIC_COMMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_SPECIALIST_COMMENTS:
    process.env.BOPS_LEGACY_SPECIALIST_COMMENTS === 'true' ? 'true' : 'false',
  BOPS_LEGACY_SPECIALIST_COMMENT:
    process.env.BOPS_LEGACY_SPECIALIST_COMMENT === 'true' ? 'true' : 'false'
}

// export const API_URL = process.env.API_URL ?? 'http://localhost:3000'
// export const DATABASE_URL = process.env.DATABASE_URL ?? ''
// export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
