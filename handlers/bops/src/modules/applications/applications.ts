import type {
  PostSubmissionApplicationsQueryParams,
  PostSubmissionPublishedApplicationResponse,
  PostSubmissionPublishedApplicationsResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  getPublicApplicationsUrl,
  getPublicApplicationUrl
} from './../../libs/urls'
import {
  getStatusFromRequest,
  handleBopsGetRequest
} from './../../libs/requests'
import {
  bopsSearchEndpointToOdp,
  bopsShowEndpointToOdp
} from '@dpr/converter-bops'
import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'

const { BOPS_LEGACY_APPLICATIONS, BOPS_LEGACY_APPLICATION } = ENV

export const fetchAllApplications = async (
  client: string,
  query: PostSubmissionApplicationsQueryParams
): Promise<PostSubmissionPublishedApplicationsResponse> => {
  try {
    const url = getPublicApplicationsUrl(query)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedApplicationsResponse>(
        client,
        url,
        async (response: Response) => {
          const input = await response.json()
          if (BOPS_LEGACY_APPLICATIONS) {
            const status = getStatusFromRequest(response)
            const data = bopsSearchEndpointToOdp(input, status)
            return data
          }
          return input
        }
      )
    return results
  } catch (e) {
    console.error('Error fetching applications:', e)
    throw new Error('Error fetching applications')
  }
}

export const fetchApplication = async (
  client: string,
  applicationId: string
): Promise<PostSubmissionPublishedApplicationResponse> => {
  try {
    const url = getPublicApplicationUrl(applicationId)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedApplicationResponse>(
        client,
        url,
        async (response: Response) => {
          const input = await response.json()
          if (BOPS_LEGACY_APPLICATION) {
            const status = getStatusFromRequest(response)
            const data = bopsShowEndpointToOdp(input)
            return { data, status }
          }
          return input
        }
      )
    return results
  } catch (e) {
    console.error('Error fetching applications:', e)
    throw new Error('Error fetching applications')
  }
}
