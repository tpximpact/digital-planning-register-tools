// bun workspace @dpr/api bun run generate:openapi
// Temporarily re-enable response schemas just for spec generation

import { app } from '..'
import { config } from '../config'

const instance = app({ enabled: true, debug: true, generateDocs: true })
const response = await instance.handle(
  new Request(`http://localhost:${config.port}/docs/json`)
)
const spec = await response.json()
await Bun.write('./schema.json', JSON.stringify(spec, null, 2))
console.log('Done')
