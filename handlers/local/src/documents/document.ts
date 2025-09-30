import { getValueByPath } from '../utils/get-value-by-path'
import { PostSubmissionApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/index.ts'
import { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
import { getApplication, getPublishedApplication } from '../applications'
import type { PostSubmissionFile } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/File.js'

const findApplicationDocument = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication
>(
  documentId: number,
  application: T
): PostSubmissionFile => {
  const allDocuments = application?.files ?? []
  const applicationDocument = allDocuments.find(
    (app) => getValueByPath(app, 'id') === documentId
  )
  console.log(applicationDocument)
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
