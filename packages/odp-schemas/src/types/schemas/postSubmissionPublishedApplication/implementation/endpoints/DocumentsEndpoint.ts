import { type Static } from '@sinclair/typebox'
import {
  PostSubmissionDocumentsEndpoint,
  PostSubmissionDocumentsOrderBy,
  PostSubmissionDocumentsSearchParams,
  PostSubmissionDocumentsSortBy
} from '../../../postSubmissionApplication/implementation/endpoints/DocumentsEndpoint'

/**
 * Endpoint to get a list of post submission application documents
 * /api/@next/public/applications/{id}/documents
 */
export const PostSubmissionPublishedPublicDocumentsEndpoint =
  PostSubmissionDocumentsEndpoint
export type PostSubmissionPublishedPublicDocumentsEndpoint = Static<
  typeof PostSubmissionPublishedPublicDocumentsEndpoint
>

/**
 * Search parameters for the endpoint
 */

export const PostSubmissionPublishedDocumentsSortBy =
  PostSubmissionDocumentsSortBy
export type PostSubmissionPublishedDocumentsSortBy = Static<
  typeof PostSubmissionPublishedDocumentsSortBy
>

export const PostSubmissionPublishedDocumentsOrderBy =
  PostSubmissionDocumentsOrderBy
export type PostSubmissionPublishedDocumentsOrderBy = Static<
  typeof PostSubmissionPublishedDocumentsOrderBy
>

export const PostSubmissionPublishedDocumentsSearchParams =
  PostSubmissionDocumentsSearchParams
export type PostSubmissionPublishedDocumentsSearchParams = Static<
  typeof PostSubmissionPublishedDocumentsSearchParams
>
