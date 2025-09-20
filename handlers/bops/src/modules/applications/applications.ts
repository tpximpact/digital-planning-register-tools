import { Elysia } from 'elysia'
import {
  PostSubmissionPublishedApplicationsQueryParams,
  PostSubmissionPublishedApplicationsResponse,
  PostSubmissionPublishedApplicationUrlParams,
  PostSubmissionPublishedApplicationResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import {
  BadRequestResponseObject,
  createUrlSearchParams,
  OkResponseObject,
  resolveClientService
} from '@dpr/libs'
import { handleBopsGetRequest } from '../../libs/requests'
import type { BopsSearchEndpoint } from '@dpr/converter-bops/schemas/bops/search/index.ts'
import { bopsSearchEndpointToOdp } from '@dpr/converter-bops/converters/applications/index.ts'
import type { BopsShowEndpoint } from '@dpr/converter-bops/schemas/bops/show/index.ts'
import { convertBopsShowEndpoint } from '@dpr/converter-bops/converters/applications/convertBopsShowEndpoint.ts'

/**
 * Helper to build public comments endpoint URL with query params.
 */
function buildApplicationsUrl(
  query?: PostSubmissionPublishedApplicationsQueryParams
): string {
  let url = `public/planning_applications/search`
  if (query) {
    const { sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)
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
export const applications = (app: Elysia) =>
  app
    .use(resolveClientService)
    .get(
      `/applications`,
      async (context) => {
        const { client, query, set } = context

        const url = buildApplicationsUrl(query)

        try {
          return await handleBopsGetRequest<PostSubmissionPublishedApplicationsResponse>(
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

              let bopsResponse: BopsSearchEndpoint
              try {
                bopsResponse = (await response.json()) as BopsSearchEndpoint
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
              return bopsSearchEndpointToOdp(bopsResponse, {
                code: response.status,
                message: response.statusText
              })
            }
          )
        } catch (e) {
          console.error('Error fetching applications:', e)
          set.status = BadRequestResponseObject.code
          return {
            data: null,
            status: {
              ...BadRequestResponseObject,
              detail: `An error occurred while fetching applications: ${
                e instanceof Error ? e.message : String(e)
              }`
            }
          }
        }
      },
      {
        query: PostSubmissionPublishedApplicationsQueryParams,
        response: {
          200: PostSubmissionPublishedApplicationsResponse
        },
        detail: {
          security: [], // Remove this to make endpoint public
          summary: 'Get all applications',
          description:
            'Retrieves a list of all applications, currently uses x-client header to filter by client'
        }
      }
    )
    .get(
      `/applications/:applicationId`,
      async (context) => {
        const {
          client,
          params: { applicationId },
          set
        } = context

        const url = `public/planning_applications/${applicationId}`

        try {
          return await handleBopsGetRequest<PostSubmissionPublishedApplicationResponse>(
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

              let bopsResponse: BopsShowEndpoint
              try {
                bopsResponse = (await response.json()) as BopsShowEndpoint
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

              const data = convertBopsShowEndpoint(bopsResponse)

              if (!data) {
                set.status = BadRequestResponseObject.code
                return {
                  data: null,
                  status: {
                    ...BadRequestResponseObject,
                    detail: `Failed to convert BOPS response: ${JSON.stringify(
                      bopsResponse
                    )}`
                  }
                }
              }

              return {
                data,
                status: OkResponseObject
              }
            }
          )
        } catch (e) {
          console.error('Error fetching applications:', e)
          set.status = BadRequestResponseObject.code
          return {
            data: null,
            status: {
              ...BadRequestResponseObject,
              detail: `An error occurred while fetching applications: ${
                e instanceof Error ? e.message : String(e)
              }`
            }
          }
        }
      },
      {
        params: PostSubmissionPublishedApplicationUrlParams,
        response: {
          200: PostSubmissionPublishedApplicationResponse
        },
        detail: {
          security: [], // Remove this to make endpoint public
          summary: 'Get application by application ID',
          description:
            'Retrieves a single application, currently uses x-client header to filter by client'
        }
      }
    )
