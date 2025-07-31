import config from './config'
import { app } from '.'

app.listen(config.port, () => {
  console.log(
    `Server is running in ${config.environment} mode at http://localhost:${config.port}`
  )
})
