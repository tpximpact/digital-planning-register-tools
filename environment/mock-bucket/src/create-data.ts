import { generateApplications } from '@dpr/libs'
import * as fs from 'fs'
import * as path from 'path'

const outputDir = path.resolve(__dirname, '../data')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const applications = generateApplications(100)

applications.forEach((app, i) => {
  const filePath = path.join(outputDir, `application_${i + 1}.json`)
  fs.writeFileSync(filePath, JSON.stringify(app, null, 2), 'utf-8')
})

console.log('100 JSON files created in', outputDir)
