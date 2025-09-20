import config from './config'
import { app } from '.'
import Elysia from 'elysia'

new Elysia().use(app()).listen(config.port, () => {
  console.log(
    `Server is running in ${config.environment} mode at http://localhost:${config.port}`
  )
  if (config.debug) {
    console.log(`Debug mode is enabled. Listening on port ${config.port}`)
    console.log(`Environment: ${config.environment}`)
  }
})
