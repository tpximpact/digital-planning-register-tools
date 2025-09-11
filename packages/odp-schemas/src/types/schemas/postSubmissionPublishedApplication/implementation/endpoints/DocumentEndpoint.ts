import { type Static } from '@sinclair/typebox'
import { PostSubmissionDocumentEndpoint } from '../../../postSubmissionApplication/implementation/endpoints/DocumentEndpoint'

/**
 * Endpoint to get a post submission application
 * /api/@next/public/applications/{id}/document/{id}
 */

export const PostSubmissionPublishedDocumentEndpoint =
  PostSubmissionDocumentEndpoint
export type PostSubmissionPublishedDocumentEndpoint = Static<
  typeof PostSubmissionPublishedDocumentEndpoint
>
