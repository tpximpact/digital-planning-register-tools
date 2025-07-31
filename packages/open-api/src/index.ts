import * as fs from 'fs'
import * as path from 'path'

import * as yaml from 'js-yaml'

// In CommonJS, __dirname is available by default.
// In TypeScript with "module": "commonjs", you can use __dirname directly.
const openApiPath = path.join(__dirname, 'openApi.yml')

// Load and parse the YAML file
let openApiDoc: any
try {
  openApiDoc = yaml.load(fs.readFileSync(openApiPath, 'utf8'))
} catch (e) {
  console.error('Failed to load openApi.yml:', e)
  openApiDoc = {}
}

export default openApiDoc
