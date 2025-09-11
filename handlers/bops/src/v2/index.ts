import { search } from './search'
import { applicationSubmission } from './applicationSubmission'
import { documents } from './documents'
import { postComment } from './postComment'
import { show } from './show'
import { publicComments } from './publicComments'
import { specialistComments } from './specialistComments'

import { documentation as searchDocumentation } from './search.documentation'
import { documentation as applicationSubmissionDocumentation } from './applicationSubmission.documentation'
import { documentation as documentsDocumentation } from './documents.documentation'
import { documentation as postCommentDocumentation } from './postComment.documentation'
import { documentation as showDocumentation } from './show.documentation'
import { documentation as publicCommentsDocumentation } from './publicComments.documentation'
import { documentation as specialistCommentsDocumentation } from './specialistComments.documentation'
import type { Documentation } from '../types/types'

// only allowing any here because we don't (yet!) export the types for each handler and it would be too big a change rn
// @TODO update each handler to export its types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFunction = (...args: any[]) => Promise<any>

const handlers: Record<string, HandlerFunction> = {
  search,
  applicationSubmission,
  documents,
  postComment,
  show,
  publicComments,
  specialistComments
}

const documentations: Record<string, Documentation> = {
  search: searchDocumentation,
  applicationSubmission: applicationSubmissionDocumentation,
  documents: documentsDocumentation,
  postComment: postCommentDocumentation,
  show: showDocumentation,
  publicComments: publicCommentsDocumentation,
  specialistComments: specialistCommentsDocumentation
}

export const BopsV2 = handlers

export const BopsV2Documentation = documentations
