import type {
  PostSubmissionPublishedPublicCommentsQueryParams,
  PostSubmissionPublishedPublicCommentsResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { getPublicApplicationPublicCommentsUrl } from './../../libs/urls'
import {
  getStatusFromRequest,
  handleBopsGetRequest
} from './../../libs/requests'
import { bopsPublicCommentsEndpointToOdp } from '@dpr/converter-bops'
import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'

const { BOPS_LEGACY_PUBLIC_COMMENTS } = ENV

export const fetchAllApplicationPublicComments = async (
  client: string,
  applicationId: string,
  query: PostSubmissionPublishedPublicCommentsQueryParams
): Promise<PostSubmissionPublishedPublicCommentsResponse> => {
  try {
    const url = getPublicApplicationPublicCommentsUrl(applicationId, query)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedPublicCommentsResponse>(
        client,
        url,
        async (response: Response) => {
          const input = await response.json()
          if (BOPS_LEGACY_PUBLIC_COMMENTS) {
            const status = getStatusFromRequest(response)
            const data = bopsPublicCommentsEndpointToOdp(input, status)
            return data
          }
          return input
        }
      )
    return results
  } catch (e) {
    console.error('Error fetching public comments:', e)
    throw new Error('Error fetching public comments')
  }
}
