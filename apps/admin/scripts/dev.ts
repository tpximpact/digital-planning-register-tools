import cli from 'next/dist/cli/next-dev'

const port = process.env?.PORT ? parseInt(process.env.PORT, 10) : 3000

cli.nextDev(
  {
    disableSourceMaps: true,
    turbopack: true,
    port,
    hostname: process.env?.HOSTNAME || '0.0.0.0'
  },
  'env'
)
