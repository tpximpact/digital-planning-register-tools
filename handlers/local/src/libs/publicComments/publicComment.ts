import { getValueByPath } from '../../utils/get-value-by-path'
import { getApplication, getPublishedApplication } from '../applications'
import type { PostSubmissionApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/index.js'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import type {
  PublicComment,
  PublicCommentRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/PublicComment.js'

const findApplicationPublicComment = <
  T extends PostSubmissionApplication | PostSubmissionPublishedApplication
>(
  publicCommentId: number,
  application: T
): PublicComment | PublicCommentRedacted => {
  const allPublicComments = application?.comments?.public ?? []
  let applicationPublicComment:
    | PublicComment
    | PublicCommentRedacted
    | undefined

  if (Array.isArray(allPublicComments)) {
    applicationPublicComment = allPublicComments.find(
      (app) => getValueByPath(app, 'id') === publicCommentId
    )
  }

  if (!applicationPublicComment) {
    throw new Error('Application public comment not found')
  }
  return applicationPublicComment
}

export const getApplicationPublicComment = (
  applicationId: string,
  publicCommentId: number
) =>
  findApplicationPublicComment<PostSubmissionApplication>(
    publicCommentId,
    getApplication(applicationId)
  )

export const getPublishedApplicationPublicComment = (
  applicationId: string,
  publicCommentId: number
) =>
  findApplicationPublicComment<PostSubmissionPublishedApplication>(
    publicCommentId,
    getPublishedApplication(applicationId)
  )
