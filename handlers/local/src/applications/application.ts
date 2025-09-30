import { getValueByPath } from '../utils/get-value-by-path'
import { fetchAllData } from '../utils/fetch-all-data'
import { PostSubmissionApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/index.ts'
import { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'

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

export const getApplication = (applicationId: string) =>
  findApplication<PostSubmissionApplication>(applicationId, () =>
    fetchAllData<PostSubmissionApplication>(false)
  )

export const getPublishedApplication = (applicationId: string) =>
  findApplication<PostSubmissionPublishedApplication>(applicationId, () =>
    fetchAllData<PostSubmissionPublishedApplication>(
      true,
      (file) => !file.includes('01-submission')
    )
  )
