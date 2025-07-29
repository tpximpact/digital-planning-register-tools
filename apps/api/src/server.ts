import config from './config'
import { app } from '.'

app.listen(config.port, () => {
  console.log(
    `Server is running in ${config.environment} mode at http://localhost:${config.port}`
  )
  if (config.debug) {
    console.log(`Debug mode is enabled. Listening on port ${config.port}`)
    console.log(`Environment: ${config.environment}`)
    console.log(
      `Rate Limit: ${config.rateLimitMax} requests per ${config.rateLimitDuration}ms`
    )
  }
})
