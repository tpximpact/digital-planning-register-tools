import type {
  PostSubmissionPublishedDocumentsQueryParams,
  PostSubmissionPublishedDocumentsResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { getPublicApplicationDocumentsUrl } from './../../libs/urls'
import {
  getStatusFromRequest,
  handleBopsGetRequest
} from './../../libs/requests'
import { bopsDocumentsEndpointToOdp } from '@dpr/converter-bops'
import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'

const { BOPS_LEGACY_DOCUMENTS } = ENV

export const fetchAllApplicationDocuments = async (
  client: string,
  applicationId: string,
  query: PostSubmissionPublishedDocumentsQueryParams
): Promise<PostSubmissionPublishedDocumentsResponse> => {
  try {
    const url = getPublicApplicationDocumentsUrl(applicationId, query)
    const results =
      await handleBopsGetRequest<PostSubmissionPublishedDocumentsResponse>(
        client,
        url,
        async (response: Response) => {
          const input = await response.json()
          if (BOPS_LEGACY_DOCUMENTS) {
            const status = getStatusFromRequest(response)
            const data = bopsDocumentsEndpointToOdp(input, query, status)
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
