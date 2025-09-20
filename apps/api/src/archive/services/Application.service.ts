import type { PostSubmissionPublishedApplicationsSearchParams } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/ApplicationsEndpoint'
import { ApplicationModel } from '../models'
import type { ApplicationsQuery } from '../modules/applications/@next/applications.schema'
import type {
  OffsetPagination,
  PostSubmissionPlanningApplication
} from '../schemas'
import type { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication'
import type { Pagination } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.js'

class ApplicationService {
  constructor() {
    this.getApplicationsOffsetPaginated =
      this.getApplicationsOffsetPaginated.bind(this)
    this.getApplicationById = this.getApplicationById.bind(this)
  }

  async getApplicationsOffsetPaginated(
    query: PostSubmissionPublishedApplicationsSearchParams
  ): Promise<{
    pagination: Pagination
    applications: PostSubmissionPublishedApplication[] | null
  }> {
    const filter = {}

    const page = query.page || 1
    const resultsPerPage = query.resultsPerPage || 10

    const applications = await ApplicationModel.find(
      filter,
      page,
      resultsPerPage
    )

    let pagination: Pagination = {
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

  async getApplicationById(
    id: number
  ): Promise<PostSubmissionPublishedApplication> {
    const foundApplication = await ApplicationModel.findById(id)

    if (!foundApplication) {
      throw new Error(`Application not found with id: ${id}`)
    }

    return foundApplication
  }
}

export default new ApplicationService()
