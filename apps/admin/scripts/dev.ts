import cli from 'next/dist/cli/next-dev'
import { ENV_ADMIN as env } from '@dpr/config'

const { PORT, HOSTNAME } = env

cli.nextDev(
  {
    disableSourceMaps: true,
    turbopack: true,
    port: PORT,
    hostname: HOSTNAME
  },
  'env'
)
