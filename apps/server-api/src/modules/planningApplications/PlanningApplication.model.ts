import type { PlanningApplication } from './PlanningApplication.schema'

// Example in-memory store (for development/testing)
const applications: PlanningApplication[] = [
  {
    id: 1,
    name: 'Application 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Application 2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { id: 3, name: 'Application 3', createdAt: new Date(), updatedAt: new Date() }
]

class PlanningApplicationModel {
  constructor() {
    this.find = this.find.bind(this)
    this.findById = this.findById.bind(this)
  }

  find(_filter: Partial<PlanningApplication>) {
    // Simulate an async API
    return {
      exec: async (): Promise<PlanningApplication[]> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // For now, ignore filter and return all
            resolve(applications)
          }, 100) // 100ms delay
        })
      }
    }
  }

  async findById(id: number): Promise<PlanningApplication | undefined> {
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
