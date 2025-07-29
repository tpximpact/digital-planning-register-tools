import { PlanningApplicationModel } from '../models'
import type { PlanningApplicationsQuery } from '../modules/planningApplications/@next/planningApplications.schema'
import type {
  OffsetPagination,
  PostSubmissionPlanningApplication
} from '../schemas'

class PlanningApplicationService {
  constructor() {
    this.getPlanningApplicationsOffsetPaginated =
      this.getPlanningApplicationsOffsetPaginated.bind(this)
    this.getPlanningApplicationById = this.getPlanningApplicationById.bind(this)
  }

  async getPlanningApplicationsOffsetPaginated(
    query: PlanningApplicationsQuery
  ): Promise<{
    pagination: OffsetPagination
    applications: PostSubmissionPlanningApplication[] | null
  }> {
    const filter = {}

    const page = query.page || 1
    const resultsPerPage = query.resultsPerPage || 10

    const applications = await PlanningApplicationModel.find(
      filter,
      page,
      resultsPerPage
    )

    let pagination: OffsetPagination = {
      resultsPerPage,
      currentPage: page,
      totalPages: 0,
      totalResults: 0,
      totalAvailableItems: 0
    }

    if (applications && applications.length > 0) {
      pagination = {
        resultsPerPage,
        currentPage: page,
        totalPages: Math.ceil(applications.length / resultsPerPage),
        totalResults: applications.length,
        totalAvailableItems: applications.length
      }
    }

    return { pagination, applications }
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
