import { generateExampleApplications } from '@dpr/application-generator'
import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.js'
import type { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication'

// Example in-memory store (for development/testing)
const applications: PostSubmissionPublishedApplication[] = []

const keys: ApplicationType[] = [
  'pp.full.major'
  // 'pp.full.householder'
  // 'pa.part1.classA',
  // 'ldc.proposed'
]

for (const key of keys) {
  const examples = generateExampleApplications(key)
  if (examples && typeof examples === 'object') {
    Object.values(examples).forEach((app) => {
      if (app) applications.push(app)
    })
  }
}

class ApplicationModel {
  constructor() {
    this.find = this.find.bind(this)
    this.findById = this.findById.bind(this)
  }

  find(
    _filter: Partial<PostSubmissionPublishedApplication>,
    page = 1,
    resultsPerPage = 10
  ): Promise<PostSubmissionPublishedApplication[] | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, ignore filter and paginate all
        const start = (page - 1) * resultsPerPage
        const end = start + resultsPerPage
        resolve(applications.slice(start, end))
      }, 100) // 100ms delay
    })
  }

  async findById(
    id: number
  ): Promise<PostSubmissionPublishedApplication | undefined> {
    // Simulate an async API with a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isNaN(id)) {
          reject(new Error('Invalid ID'))
          return
        }
        if (id < 1 || id > applications.length) {
          reject(new Error(`Planning application not found with id: ${id}`))
          return
        }
        const app = applications.find(
          (app) => app.data.application.reference === id
        )
        resolve(app)
      }, 100) // 100ms delay
    })
  }
}

export default new ApplicationModel()
