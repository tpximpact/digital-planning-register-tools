import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import {
  generatePostSubmissionPublishedApplication,
  type GeneratePostSubmissionPublishedApplicationProps
} from './generatePostSubmissionPublishedApplication'
import { generatePublicComments } from './generators/PublicComments'
import { generateSpecialistComments } from './generators/SpecialistComments'
import dayjs from 'dayjs'
import type { PossibleDates } from './libs/generateAllPossibleDates'

export const generatePostSubmissionApplication = ({
  applicationType,
  applicationStage,
  applicationStatus,
  customStatus
}: GeneratePostSubmissionPublishedApplicationProps = {}): PostSubmissionApplication => {
  const data: PostSubmissionPublishedApplication =
    generatePostSubmissionPublishedApplication({
      applicationType,
      applicationStage,
      applicationStatus,
      customStatus
    })

  if (!data) {
    throw new Error('Failed to generate published application')
  }

  const { comments, ...dataObj } = data

  // remove publishedAt date from application
  const { publishedAt, ...application } = dataObj.data.application

  const dates = {
    consultation: {
      startAt: dayjs(dataObj.data.consultation?.startDate),
      endAt: dayjs(dataObj.data.consultation?.endDate)
    }
  }

  const newComments: PostSubmissionApplication['comments'] | undefined =
    comments
      ? {
          public: generatePublicComments(dates as unknown as PossibleDates),
          specialist: generateSpecialistComments(
            dates as unknown as PossibleDates
          )
        }
      : undefined

  // remove publishedAt from data.application.publishedAt
  const applicationData: PostSubmissionApplication = {
    ...dataObj,
    data: {
      ...dataObj.data,
      application
    },
    ...(newComments && { comments: newComments })
  }

  return applicationData
}
