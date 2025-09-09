import { Type, type Static } from '@sinclair/typebox'
import { PostSubmissionFile } from '../../data/PostSubmissionFile'
import { ApiResponse } from '../ApiResponse'

export const PostSubmissionDocumentsEndpoint = ApiResponse(
  Type.Array(PostSubmissionFile)
)
export type PostSubmissionDocumentsEndpoint = Static<
  typeof PostSubmissionDocumentsEndpoint
>
