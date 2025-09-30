import { Elysia } from 'elysia'
import {
  PostSubmissionPublicCommentPostBody,
  PostSubmissionPublicCommentPostUrlParams,
  PostSubmissionPublishedPublicCommentsQueryParams,
  PostSubmissionPublishedPublicCommentsResponse,
  PostSubmissionPublishedPublicCommentsUrlParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { createUrlSearchParams } from '@dpr/libs'
import {
  handleBopsGetRequest,
  handleBopsPostRequest
} from '../../libs/requests/requests'
import type {
  BopsPostComment,
  BopsPublicCommentsEndpoint
} from '@dpr/converter-bops/schemas/bops/publicComments/index.ts'
import { bopsPublicCommentsEndpointToOdp } from '@dpr/converter-bops/converters/publicComments/index.ts'
import { convertOdpPublicCommentToBops } from '@dpr/converter-bops/converters/publicComments/convertBopsToOdpPublicComment.ts'
import {
  empty200Model,
  requireClientHeaders,
  standardResponseObjects
} from '@dpr/api'

/**
 * Helper to build public comments endpoint URL with query params.
 */
function buildPublicCommentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedPublicCommentsQueryParams
): string {
  let url = `public/planning_applications/${applicationId}/comments/public`
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
export const publicComments = (app: Elysia) =>
  app
    .use(requireClientHeaders)
    .get(
      `/applications/:applicationId/publicComments`,
      async (context) => {
        const {
          client,
          params: { applicationId },
          query,
          set
        } = context

        const url = buildPublicCommentsUrl(applicationId, query)

        try {
          return await handleBopsGetRequest<PostSubmissionPublishedPublicCommentsResponse>(
            client,
            url,
            async (response: Response) => {
              let bopsResponse: BopsPublicCommentsEndpoint
              try {
                bopsResponse =
                  (await response.json()) as BopsPublicCommentsEndpoint
              } catch (jsonError) {
                set.status =
                  standardResponseObjects.BadRequestResponseObject.code
                return {
                  data: null,
                  status: {
                    ...standardResponseObjects.BadRequestResponseObject,
                    detail: `Failed to parse response JSON: ${jsonError}`
                  }
                }
              }
              return bopsPublicCommentsEndpointToOdp(bopsResponse, {
                code: response.status,
                message: response.statusText
              })
            }
          )
        } catch (e) {
          console.error('Error fetching public comments:', e)
          set.status = standardResponseObjects.BadRequestResponseObject.code
          return {
            data: null,
            status: {
              ...standardResponseObjects.BadRequestResponseObject,
              detail: `An error occurred while fetching public comments: ${
                e instanceof Error ? e.message : String(e)
              }`
            }
          }
        }
      },
      {
        params: PostSubmissionPublishedPublicCommentsUrlParams,
        query: PostSubmissionPublishedPublicCommentsQueryParams,
        response: {
          200: PostSubmissionPublishedPublicCommentsResponse
        },
        detail: {
          security: [], // Remove this to make endpoint public
          summary: 'Public comments',
          description:
            'Retrieves a list of all public comments for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
    .post(
      `/applications/:applicationId/publicComments`,
      async (context) => {
        const {
          client,
          params: { applicationId },
          set,
          body
        } = context

        const url = `planning_applications/${applicationId}/comments/public`

        try {
          const bopsComment = convertOdpPublicCommentToBops(body)
          if (!bopsComment) {
            throw new Error('Invalid comment body')
          }

          console.log('Converted comment to BOPS format:', bopsComment)

          // Replace body with converted comment
          const response = await handleBopsPostRequest<
            BopsPostComment,
            PostSubmissionPublishedPublicCommentsResponse
          >(client, url, bopsComment)

          return {
            data: null,
            status: {
              ...(response.status
                ? response.status
                : standardResponseObjects.OkResponseObject),
              detail: `Public comment submitted successfully`
            }
          }
        } catch (e) {
          console.error('Error posting public comment:', e)
          set.status = standardResponseObjects.BadRequestResponseObject.code
          return {
            data: null,
            status: {
              ...standardResponseObjects.BadRequestResponseObject,
              detail: `An error occurred while posting public comment: ${
                e instanceof Error ? e.message : String(e)
              }`
            }
          }
        }
      },
      {
        params: PostSubmissionPublicCommentPostUrlParams,
        body: PostSubmissionPublicCommentPostBody,
        parse: 'application/json',
        response: {
          200: empty200Model
        },
        detail: {
          // security: [], // Remove this to make endpoint public
          summary: 'Submit public comment',
          description:
            'Posts a public comment for a specific application, currently uses x-client header to filter by client'
        }
      }
    )
