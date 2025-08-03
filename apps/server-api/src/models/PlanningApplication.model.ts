import type { PostSubmissionPlanningApplication } from '../schemas'
import { generateApplications } from '@dev-libs'

// Example in-memory store (for development/testing)
const applications: PostSubmissionPlanningApplication[] = []
applications.push(...generateApplications(50))

class PlanningApplicationModel {
  constructor() {
    this.find = this.find.bind(this)
    this.findById = this.findById.bind(this)
  }

  find(
    _filter: Partial<PostSubmissionPlanningApplication>,
    page = 1,
    resultsPerPage = 10
  ) {
    // Simulate an async API
    return {
      exec: async (): Promise<PostSubmissionPlanningApplication[]> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // For now, ignore filter and paginate all
            const start = (page - 1) * resultsPerPage
            const end = start + resultsPerPage
            resolve(applications.slice(start, end))
          }, 100) // 100ms delay
        })
      }
    }
  }

  async findById(
    id: number
  ): Promise<PostSubmissionPlanningApplication | undefined> {
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
        const app = applications.find((app) => app.id === id)
        resolve(app)
      }, 100) // 100ms delay
    })
  }
}

export default new PlanningApplicationModel()
