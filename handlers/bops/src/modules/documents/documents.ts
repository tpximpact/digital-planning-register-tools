import { Elysia } from 'elysia'
import {
  PostSubmissionPublishedDocumentsQueryParams,
  PostSubmissionPublishedDocumentsResponse,
  PostSubmissionPublishedDocumentsUrlParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { createUrlSearchParams } from '@dpr/libs'
import type { BopsDocumentsEndpoint } from '@dpr/converter-bops/schemas/bops/documents/documents.ts'
import { handleBopsGetRequest } from '../../libs/requests/requests'
import { filterResults } from './sortFilterResults'
import { requireClientHeaders, standardResponseObjects } from '@dpr/api'
/**
 * Helper to build documents endpoint URL with query params.
 */
function buildDocumentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedDocumentsQueryParams
): string {
  let url = `public/planning_applications/${applicationId}/documents`
  if (query) {
    const { publishedAtFrom, publishedAtTo, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)
    if (publishedAtFrom && publishedAtTo) {
      params.append('publishedAtFrom', publishedAtFrom)
      params.append('publishedAtTo', publishedAtTo)
    }
    url += `?${params.toString()}`
  }
  return url
}

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const documents = (app: Elysia) =>
  app.use(requireClientHeaders).get(
    `/applications/:applicationId/documents`,
    async (context) => {
      const {
        client,
        params: { applicationId },
        query,
        set
      } = context

      const url = buildDocumentsUrl(applicationId, query)

      try {
        return await handleBopsGetRequest<PostSubmissionPublishedDocumentsResponse>(
          client,
          url,
          async (response: Response) => {
            // return bopsDocumentsEndpointToOdp(
            //   (await response.json()) as BopsDocumentsEndpoint,
            //   query,
            //   {
            //     code: response.status,
            //     message: response.statusText
            //   }
            // )

            let bopsResponse: BopsDocumentsEndpoint
            try {
              bopsResponse = (await response.json()) as BopsDocumentsEndpoint
            } catch (jsonError) {
              set.status = standardResponseObjects.BadRequestResponseObject.code
              return {
                data: null,
                status: {
                  ...standardResponseObjects.BadRequestResponseObject,
                  detail: `Failed to parse response JSON: ${jsonError}`
                }
              }
            }

            return filterResults(bopsResponse, query, response)
          }
        )
      } catch (e) {
        console.error('Error fetching documents:', e)
        set.status = standardResponseObjects.BadRequestResponseObject.code
        return {
          data: null,
          status: {
            ...standardResponseObjects.BadRequestResponseObject,
            detail: `An error occurred while fetching documents: ${
              e instanceof Error ? e.message : String(e)
            }`
          }
        }
      }
    },
    {
      params: PostSubmissionPublishedDocumentsUrlParams,
      query: PostSubmissionPublishedDocumentsQueryParams,
      response: {
        200: PostSubmissionPublishedDocumentsResponse
      },
      detail: {
        security: [], // Remove this to make endpoint public
        summary: 'Documents',
        description:
          'Retrieves a list of all documents for a specific application, currently uses x-client header to filter by client'
      }
    }
  )
