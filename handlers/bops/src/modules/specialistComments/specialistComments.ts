import { Elysia } from 'elysia'
import {
  PostSubmissionPublishedSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistsUrlParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  BadRequestResponseObject,
  createUrlSearchParams,
  resolveClientService
} from '@dpr/libs'
import { handleBopsGetRequest } from '../../libs/requests'
import { bopsSpecialistCommentsEndpointToOdp } from '@dpr/converter-bops/converters/specialistComments/index.ts'
import type { BopsSpecialistCommentsEndpoint } from '@dpr/converter-bops/schemas/bops/specialistComments/specialistComments.ts'

/**
 * Helper to build specialist comments endpoint URL with query params.
 */
function buildSpecialistCommentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedSpecialistsQueryParams
): string {
  let url = `public/planning_applications/${applicationId}/comments/specialist`
  if (query) {
    const { publishedAtFrom, publishedAtTo, sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)
    if (publishedAtFrom && publishedAtTo) {
      params.append('publishedAtFrom', publishedAtFrom)
      params.append('publishedAtTo', publishedAtTo)
    }
    // Convert sortBy from publishedAt to receivedAt
    if (sortBy) {
      if (sortBy === 'publishedAt') params.append('sortBy', 'receivedAt')
    }
    url += `?${params.toString()}`
  }
  return url
}

/**
 * Plugin for elysia that generates the planning applications API.
 */
export const specialistComments = (app: Elysia) =>
  app.use(resolveClientService).get(
    `/applications/:applicationId/specialistComments`,
    async (context) => {
      const {
        client,
        params: { applicationId },
        query,
        set
      } = context

      const url = buildSpecialistCommentsUrl(applicationId, query)

      try {
        return await handleBopsGetRequest<PostSubmissionPublishedSpecialistsResponse>(
          client,
          url,
          async (response: Response) => {
            let bopsResponse: BopsSpecialistCommentsEndpoint
            try {
              bopsResponse =
                (await response.json()) as BopsSpecialistCommentsEndpoint
            } catch (jsonError) {
              set.status = BadRequestResponseObject.code
              return {
                data: null,
                status: {
                  ...BadRequestResponseObject,
                  detail: `Failed to parse response JSON: ${jsonError}`
                }
              }
            }
            return bopsSpecialistCommentsEndpointToOdp(bopsResponse, {
              code: response.status,
              message: response.statusText
            })
          }
        )
      } catch (e) {
        console.error('Error fetching public comments:', e)
        set.status = BadRequestResponseObject.code
        return {
          data: null,
          status: {
            ...BadRequestResponseObject,
            detail: `An error occurred while fetching public comments: ${
              e instanceof Error ? e.message : String(e)
            }`
          }
        }
      }
    },
    {
      params: PostSubmissionPublishedSpecialistsUrlParams,
      query: PostSubmissionPublishedSpecialistsQueryParams,
      response: {
        200: PostSubmissionPublishedSpecialistsResponse
      },
      detail: {
        security: [], // Remove this to make endpoint public
        summary: 'Get all specialist comments for an application',
        description:
          'Retrieves a list of all specialist comments for a specific application, currently uses x-client header to filter by client'
      }
    }
  )
