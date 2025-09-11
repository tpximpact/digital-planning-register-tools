import { type Static } from '@sinclair/typebox'
import { ApiResponse } from '../ApiResponse'
import { PostSubmissionFile } from '../../data/PostSubmissionFile'

/**
 * Endpoint to get a post submission application
 * /api/@next/applications/{id}/document/{id}
 */

export const PostSubmissionDocumentEndpoint = ApiResponse(PostSubmissionFile)
export type PostSubmissionDocumentEndpoint = Static<
  typeof PostSubmissionDocumentEndpoint
>
