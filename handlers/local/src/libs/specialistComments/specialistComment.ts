import { getValueByPath } from '../../utils/get-value-by-path'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import { getApplication, getPublishedApplication } from '../applications'
import type {
  Specialist,
  SpecialistRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.js'

const findApplicationSpecialistComments = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication
>(
  specialistId: string,
  application: T
): Specialist | SpecialistRedacted => {
  const allSpecialists = application?.comments?.specialist?.comments ?? []
  const applicationSpecialist = allSpecialists.find(
    (app) => getValueByPath(app, 'id') === specialistId
  )

  if (!applicationSpecialist) {
    throw new Error('Application specialist comment not found')
  }
  return applicationSpecialist
}

export const getApplicationSpecialistComment = (
  applicationId: string,
  specialistId: string
) =>
  findApplicationSpecialistComments<PostSubmissionApplication>(
    specialistId,
    getApplication(applicationId)
  )

export const getPublishedApplicationSpecialistComment = (
  applicationId: string,
  specialistId: string
) =>
  findApplicationSpecialistComments<PostSubmissionPublishedApplication>(
    specialistId,
    getPublishedApplication(applicationId)
  )
