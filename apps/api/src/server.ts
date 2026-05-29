import Elysia from 'elysia'
import { app } from '.'
import { config } from './config'

new Elysia().use(app()).listen(config.port, () => {
  console.log(
    `Server is running in ${config.environment} mode at http://localhost:${config.port}`
  )
  if (config.debug) {
    console.log(`Debug mode is enabled. Listening on port ${config.port}`)
    console.log(`Environment: ${config.environment}`)
    console.log(
      `Rate Limit: ${config.rateLimitMax} requests per ${config.rateLimitDuration}ms`
    )

    const used = process.memoryUsage()
    console.log(
      `Startup memory: ${Math.round(
        used.heapUsed / 1024 / 1024
      )}MB heap, ${Math.round(used.rss / 1024 / 1024)}MB rss`
    )
  }
})
