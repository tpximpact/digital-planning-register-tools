import type {
  PostSubmissionPublishedSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { getPublicApplicationSpecialistCommentsUrl } from './../../libs/urls'
import {
  getStatusFromRequest,
  handleBopsGetRequest
} from './../../libs/requests'
import { bopsSpecialistCommentsEndpointToOdp } from '@dpr/converter-bops'
import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'

const { BOPS_LEGACY_SPECIALIST_COMMENTS } = ENV

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
  specialistId: string
): Promise<PostSubmissionPublishedSpecialistResponse> => {
  try {
    const url = getPublicApplicationSpecialistCommentsUrl(applicationId)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedSpecialistResponse>(
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
    console.error('Error fetching documents:', e)
    throw new Error('Error fetching documents')
  }
}
