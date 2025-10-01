import type { OffsetPagination } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.js'
import type {
  PostSubmissionPublishedSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistResponse,
  PostSubmissionPublishedSpecialistQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  getPublicApplicationSpecialistCommentsUrl,
  getPublicApplicationSpecialistCommentUrl
} from './../../libs/urls'
import {
  getStatusFromRequest,
  handleBopsGetRequest
} from './../../libs/requests'
import { bopsSpecialistCommentsEndpointToOdp } from '@dpr/converter-bops'
import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'
import { convertBopsSpecialistToSpecialistRedacted } from '@dpr/converter-bops'

const { BOPS_LEGACY_SPECIALIST_COMMENTS, BOPS_LEGACY_SPECIALIST_COMMENT } = ENV

export const fetchAllApplicationSpecialistComments = async (
  client: string,
  applicationId: string,
  query: PostSubmissionPublishedSpecialistsQueryParams
): Promise<PostSubmissionPublishedSpecialistsResponse> => {
  try {
    const url = getPublicApplicationSpecialistCommentsUrl(applicationId, query)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedSpecialistsResponse>(
        client,
        url,
        async (response: Response) => {
          const input = await response.json()
          if (BOPS_LEGACY_SPECIALIST_COMMENTS) {
            const status = getStatusFromRequest(response)
            const data = bopsSpecialistCommentsEndpointToOdp(input, status)
            return data
          }
          return input
        }
      )
    return results
  } catch (e) {
    console.error('Error fetching specialist comments:', e)
    throw new Error('Error fetching specialist comments')
  }
}

export const fetchApplicationSpecialistComment = async (
  client: string,
  applicationId: string,
  specialistId: string,
  query: PostSubmissionPublishedSpecialistQueryParams
): Promise<PostSubmissionPublishedSpecialistResponse> => {
  const legacy = BOPS_LEGACY_SPECIALIST_COMMENT || false

  if (legacy) {
    try {
      let page = 1
      let found: unknown = undefined
      let hasMore = true

      while (hasMore && !found) {
        // Add pagination to query
        const pagedQuery = { ...query, page, resultsPerPage: 50 }
        const url = getPublicApplicationSpecialistCommentUrl(
          applicationId,
          specialistId,
          pagedQuery
        )
        const response =
          await handleBopsGetRequest<PostSubmissionPublishedSpecialistsResponse>(
            client,
            url,
            async (response: Response) => {
              const input = await response.json()
              const status = getStatusFromRequest(response)
              return bopsSpecialistCommentsEndpointToOdp(input, status)
            }
          )

        const specialists = response?.data?.comments ?? []
        found = specialists.find(
          (specialist) =>
            String((specialist as { id?: string | number })?.id) ===
            String(specialistId)
        )

        // Pagination logic
        const pagination: OffsetPagination =
          response.pagination && 'currentPage' in response.pagination
            ? response.pagination
            : {
                totalAvailableItems: 0,
                resultsPerPage: 0,
                currentPage: 1,
                totalPages: 1,
                totalResults: 0
              }
        hasMore =
          !!pagination &&
          typeof pagination.currentPage === 'number' &&
          typeof pagination.totalPages === 'number' &&
          pagination.currentPage < pagination.totalPages

        page++
      }

      if (found) {
        try {
          // Convert the found specialist comment with a different function
          const results = convertBopsSpecialistToSpecialistRedacted(found)
          return { data: results, status: getStatusFromRequest(new Response()) }
        } catch (e) {
          console.error('Found specialist but couldnt convert the data', e)
          throw new Error('Found specialist but couldnt convert the data')
        }
      } else {
        console.error('Couldnt find a matching specialist')
        throw new Error('Couldnt find a matching specialist')
      }
    } catch (e) {
      console.error('Error fetching specialist comment:', e)
      throw new Error('Error fetching specialist comment')
    }
  } else {
    try {
      const url = getPublicApplicationSpecialistCommentUrl(
        applicationId,
        specialistId
      )
      const results =
        await handleBopsGetRequest<PostSubmissionPublishedSpecialistResponse>(
          client,
          url,
          async (response: Response) => {
            const input = await response.json()
            return input
          }
        )
      return results
    } catch (e) {
      console.error('Error fetching specialist comment:', e)
      throw new Error('Error fetching specialist comment')
    }
  }
}
