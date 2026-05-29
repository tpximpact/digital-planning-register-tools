import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import {
  type PostSubmissionPublishedDocumentsResponse,
  type PostSubmissionPublishedDocumentsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { paginateArray } from '@dpr/libs'
import { convertBopsFileToPostSubmissionFileRedacted } from './convertBopsFileToPostSubmissionFileRedacted'
import { type PostSubmissionFileRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import { PostSubmissionPublishedDocumentsResponseChecker } from '@dpr/libs'

export const bopsDocumentsEndpointToOdp = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  searchParams: PostSubmissionPublishedDocumentsQueryParams,
  status: ApiResponseStatus
): PostSubmissionPublishedDocumentsResponse => {
  if (PostSubmissionPublishedDocumentsResponseChecker.Check(input)) {
    return input
  }

  const { files } = input

  const convertedDocuments: PostSubmissionFileRedacted[] = (files ?? [])
    .map((document: unknown): PostSubmissionFileRedacted | undefined => {
      try {
        return convertBopsFileToPostSubmissionFileRedacted(
          document,
          'application'
        )
      } catch (error) {
        console.warn(
          'Error converting document but its taken care of elsewhere:',
          error
        )
        return undefined
      }
    })
    .filter(
      (
        document: PostSubmissionFileRedacted | undefined
      ): document is PostSubmissionFileRedacted => document !== undefined
    )

  const allDocuments = convertedDocuments.sort((a, b) => {
    const aTime = a?.metadata?.publishedAt
      ? new Date(a.metadata.publishedAt).getTime()
      : 0
    const bTime = b?.metadata?.publishedAt
      ? new Date(b.metadata.publishedAt).getTime()
      : 0
    return bTime - aTime // Descending: newest first
  })

  const { data, pagination } = paginateArray<PostSubmissionFileRedacted>(
    allDocuments,
    searchParams.page,
    searchParams.resultsPerPage
  )

  const results = {
    data,
    pagination,
    status
  }

  if (PostSubmissionPublishedDocumentsResponseChecker.Check(results)) {
    return results
  }

  throw new Error('Unable to convert documents endpoint')
}
