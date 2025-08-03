import { PlanningApplicationModel } from '../models'
import type { PostSubmissionPlanningApplication } from '../schemas'

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications = this.getAllPlanningApplications.bind(this)
    this.getPlanningApplicationById = this.getPlanningApplicationById.bind(this)
  }

  async getAllPlanningApplications(): Promise<
    PostSubmissionPlanningApplication[]
  > {
    const filter = {}

    return await PlanningApplicationModel.find(filter).exec()
  }

  async getPlanningApplicationById(
    id: number
  ): Promise<PostSubmissionPlanningApplication> {
    const foundApplication = await PlanningApplicationModel.findById(id)

    if (!foundApplication) {
      throw new Error(`Planning application not found with id: ${id}`)
    }

    return foundApplication
  }
}

export default new PlanningApplicationService()
