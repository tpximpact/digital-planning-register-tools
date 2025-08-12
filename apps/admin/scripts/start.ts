import cli from 'next/dist/cli/next-start'
import { env } from '@dpr/libs'

const port = env?.PORT ? parseInt(env.PORT, 10) : 3000

cli.nextStart({
  port,
  hostname: env?.HOSTNAME || '0.0.0.0'
})
