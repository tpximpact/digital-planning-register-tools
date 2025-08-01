import { default as PlanningApplicationModel } from './PlanningApplication.model'
import type { PlanningApplication } from './PlanningApplication.schema'

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications = this.getAllPlanningApplications.bind(this)
    this.getPlanningApplicationById = this.getPlanningApplicationById.bind(this)
  }

  async getAllPlanningApplications(): Promise<PlanningApplication[]> {
    const filter = {}

    return await PlanningApplicationModel.find(filter).exec()
  }

  async getPlanningApplicationById(id: number): Promise<PlanningApplication> {
    const foundApplication = await PlanningApplicationModel.findById(id)

    if (!foundApplication) {
      throw new Error(`Planning application not found with id: ${id}`)
    }

    return foundApplication
  }
}

export default new PlanningApplicationService()
