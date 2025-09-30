import { ENV_HANDLER_BOPS as env } from '@dpr/config'
import { showRoutes } from '@dpr/api'
import { app } from '.'
import Elysia from 'elysia'
import { openapi } from '@elysiajs/openapi'

const { DEBUG, ENVIRONMENT, PORT } = env

new Elysia()
  .use(
    openapi({
      enabled: true,
      path: '/bops-scalar',
      provider: 'scalar'
    })
  )
  .use(
    openapi({
      enabled: true,
      path: '/bops-swagger',
      provider: 'swagger-ui'
    })
  )
  .use(
    app({
      enabled: true,
      debug: DEBUG || false
    })
  )
  .use(showRoutes(DEBUG || false))
  .listen(PORT, () => {
    console.log(
      `Server is running in ${ENVIRONMENT} mode at http://localhost:${PORT}`
    )
    if (DEBUG) {
      console.log(`Debug mode is enabled. Listening on port ${PORT}`)
      console.log(`Environment: ${ENVIRONMENT}`)
    }
  })
