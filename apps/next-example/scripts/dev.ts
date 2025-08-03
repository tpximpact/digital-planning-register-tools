import cli from 'next/dist/cli/next-dev'
import { env } from '@libs/env'

const port = env?.PORT ? parseInt(env.PORT, 10) : 3000

cli.nextDev(
  {
    disableSourceMaps: true,
    turbopack: true,
    port,
    hostname: env?.HOSTNAME || '0.0.0.0'
  },
  'env'
)
