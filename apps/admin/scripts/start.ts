import cli from 'next/dist/cli/next-start'
import { ENV_ADMIN as env } from '@dpr/config'

const { PORT, HOSTNAME } = env

cli.nextStart({
  port: PORT,
  hostname: HOSTNAME
})
