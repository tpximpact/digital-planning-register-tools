import { getValueByPath } from '../utils/get-value-by-path'
import { fetchAllData } from '../utils/fetch-all-data'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'

export const findApplication = <T>(
  applicationId: string,
  fetchFn: () => T[]
): T => {
  const allApplications = fetchFn()
  const application = allApplications.find(
    (app) => getValueByPath(app, 'data.application.reference') === applicationId
  )
  if (!application) {
    throw new Error('Application not found')
  }
  return application
}

/**
 * Get a non-published application by its ID.
 */
export const getApplication = (applicationId: string) =>
  findApplication<PostSubmissionApplication>(applicationId, () =>
    fetchAllData<PostSubmissionApplication>(false)
  )

/**
 * Get a published application by its ID.
 */
export const getPublishedApplication = (applicationId: string) =>
  findApplication<PostSubmissionPublishedApplication>(applicationId, () =>
    fetchAllData<PostSubmissionPublishedApplication>(
      true,
      (file) =>
        !file.includes('01-submission') &&
        !file.includes('02-validation-01-invalid')
    )
  )
