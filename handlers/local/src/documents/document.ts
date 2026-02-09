import { getValueByPath } from '../utils/get-value-by-path'
import { getApplication, getPublishedApplication } from '../applications'
import type {
  PostSubmissionFile,
  PostSubmissionFileRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/File.js'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'

const findApplicationDocument = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication
>(
  documentId: number,
  application: T
): PostSubmissionFile | PostSubmissionFileRedacted => {
  const allDocuments = application?.files ?? []
  const applicationDocument = allDocuments.find(
    (app) => getValueByPath(app, 'id') === documentId
  )
  if (!applicationDocument) {
    throw new Error('Application document not found')
  }
  return applicationDocument
}

export const getApplicationDocument = (
  applicationId: string,
  documentId: number
) =>
  findApplicationDocument<PostSubmissionApplication>(
    documentId,
    getApplication(applicationId)
  )

export const getPublishedApplicationDocument = (
  applicationId: string,
  documentId: number
) =>
  findApplicationDocument<PostSubmissionPublishedApplication>(
    documentId,
    getPublishedApplication(applicationId)
  )
