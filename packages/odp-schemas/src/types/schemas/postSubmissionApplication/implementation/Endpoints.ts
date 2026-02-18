import { Type, type Static } from '@sinclair/typebox'
import {
  PostSubmissionApplicationsSortBySchema,
  PostSubmissionPublishedApplicationsSortBySchema
} from './data/ApplicationsSortBy'
import {
  PostSubmissionApplicationsOrderBySchema,
  PostSubmissionPublishedApplicationsOrderBySchema
} from './data/ApplicationsOrderBy'
import {
  PostSubmissionDocumentsSortBySchema,
  PostSubmissionPublishedDocumentsSortBySchema
} from './data/DocumentsSortBy'
import {
  PostSubmissionDocumentsOrderBySchema,
  PostSubmissionPublishedDocumentsOrderBySchema
} from './data/DocumentsOrderBy'
import { FileTypeSchema } from '../enums/FileType'
import {
  PublicCommentSentimentSchema,
  SpecialistCommentSentimentSchema
} from '../enums/CommentSentiment'
import { PublicCommentTopicSchema } from '../enums/PublicCommentTopic'
import {
  PostSubmissionPublicCommentsSortBySchema,
  PostSubmissionPublishedPublicCommentsSortBySchema
} from './data/PublicCommentsSortBy'
import {
  PostSubmissionPublicCommentsOrderBySchema,
  PostSubmissionPublishedPublicCommentsOrderBySchema
} from './data/PublicCommentsOrderBy'
import {
  PostSubmissionPublishedSpecialistCommentsSortBySchema,
  PostSubmissionSpecialistCommentsSortBySchema
} from './data/SpecialistCommentsSortBy'
import {
  PostSubmissionPublishedSpecialistCommentsOrderBySchema,
  PostSubmissionSpecialistCommentsOrderBySchema
} from './data/SpecialistCommentsOrderBy'
import { PostSubmissionApplicationSchema } from '..'
import { ApiResponseSchema } from './ApiResponse'
import { PostSubmissionPublishedApplicationSchema } from '../../postSubmissionPublishedApplication'
import {
  PostSubmissionFileSchema,
  PostSubmissionFileRedactedSchema
} from '../data/File'
import {
  PublicCommentsSchema,
  PublicCommentsRedactedSchema,
  SpecialistCommentsSchema,
  SpecialistCommentsRedactedSchema
} from '../data/Comment'
import {
  PublicCommentSchema,
  PublicCommentRedactedSchema
} from '../data/PublicComment'
import {
  SpecialistCommentSchema,
  SpecialistRedactedSchema
} from '../data/SpecialistComment'

// -----------------------------------------------------------------------------
// Url Params
// -----------------------------------------------------------------------------

const BaseApplicationUrlParamsSchema = Type.Object({
  applicationId: Type.String()
})

// -----------------------------------------------------------------------------
// Query Params
// -----------------------------------------------------------------------------

const BaseQueryParamsSchema = Type.Object({
  page: Type.Number({ default: 1 }),
  resultsPerPage: Type.Number({ default: 10 })
})

// -----------------------------------------------------------------------------

const endpoints = {
  applications: {
    private: {
      /**
       * /api/@next/applications
       * /api/@next/applications/{applicationId}
       */
      applications: {
        method: 'GET',
        path: '/api/@next/applications',
        prefix: 'PostSubmissionApplications',
        urlParams: undefined,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            query: Type.Optional(Type.String()),
            sortBy: Type.Optional(PostSubmissionApplicationsSortBySchema),
            orderBy: Type.Optional(PostSubmissionApplicationsOrderBySchema),
            reference: Type.Optional(Type.String())
          })
        ]),
        data: Type.Array(PostSubmissionApplicationSchema),
        response: ApiResponseSchema(Type.Array(PostSubmissionApplicationSchema))
      },
      application: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}',
        prefix: 'PostSubmissionApplication',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: undefined,
        data: PostSubmissionApplicationSchema,
        response: ApiResponseSchema(
          Type.Union([PostSubmissionApplicationSchema, Type.Null()])
        )
      }
    },
    public: {
      /**
       * /api/@next/public/applications
       * /api/@next/public/applications/{applicationId}
       */
      applications: {
        method: 'GET',
        path: '/api/@next/public/applications',
        prefix: 'PostSubmissionPublishedApplications',
        urlParams: undefined,
        queryParams: Type.Composite(
          [
            BaseQueryParamsSchema,
            Type.Object({
              query: Type.Optional(Type.String()),
              sortBy: Type.Optional(
                PostSubmissionPublishedApplicationsSortBySchema
              ),
              orderBy: Type.Optional(
                PostSubmissionPublishedApplicationsOrderBySchema
              ),
              reference: Type.Optional(Type.String())
            })
          ],
          {
            description: 'Query parameters for applications',
            detail: { description: 'Query parameters for applications' }
          }
        ),
        data: Type.Array(PostSubmissionPublishedApplicationSchema),
        response: ApiResponseSchema(
          Type.Array(PostSubmissionPublishedApplicationSchema),
          {
            description: 'Public applications endpoint response'
          }
        )
      },
      application: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}',
        prefix: 'PostSubmissionPublishedApplication',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: undefined,
        data: PostSubmissionPublishedApplicationSchema,
        response: ApiResponseSchema(
          Type.Union([PostSubmissionPublishedApplicationSchema, Type.Null()])
        )
      }
    }
  },
  documents: {
    private: {
      /**
       * /api/@next/applications/{applicationId}/documents
       * /api/@next/applications/{applicationId}/documents/{documentId}
       */
      documents: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/documents',
        prefix: 'PostSubmissionDocuments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            sortBy: Type.Optional(PostSubmissionDocumentsSortBySchema),
            orderBy: Type.Optional(PostSubmissionDocumentsOrderBySchema),
            name: Type.Optional(Type.String()),
            type: Type.Optional(FileTypeSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String())
          })
        ]),
        data: Type.Array(PostSubmissionFileSchema),
        response: ApiResponseSchema(Type.Array(PostSubmissionFileSchema))
      },
      document: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/documents/{documentId}',
        prefix: 'PostSubmissionDocument',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ documentId: Type.Number() })
        ]),
        queryParams: undefined,
        data: PostSubmissionFileSchema,
        response: ApiResponseSchema(
          Type.Union([PostSubmissionFileSchema, Type.Null()])
        )
      }
    },
    public: {
      /**
       * /api/@next/public/applications/{applicationId}/documents
       * /api/@next/public/applications/{applicationId}/documents/{documentId}
       */
      documents: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/documents',
        prefix: 'PostSubmissionPublishedDocuments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            sortBy: Type.Optional(PostSubmissionPublishedDocumentsSortBySchema),
            orderBy: Type.Optional(
              PostSubmissionPublishedDocumentsOrderBySchema
            ),
            name: Type.Optional(Type.String()),
            type: Type.Optional(FileTypeSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String())
          })
        ]),
        data: Type.Array(PostSubmissionFileRedactedSchema),
        response: ApiResponseSchema(
          Type.Array(PostSubmissionFileRedactedSchema)
        )
      },
      document: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/documents/{documentId}',
        prefix: 'PostSubmissionPublishedDocument',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ documentId: Type.Number() })
        ]),
        queryParams: undefined,
        data: PostSubmissionFileRedactedSchema,
        response: ApiResponseSchema(
          Type.Union([PostSubmissionFileRedactedSchema, Type.Null()])
        )
      }
    }
  },
  publicComments: {
    private: {
      /**
       * /api/@next/applications/{applicationId}/publicComments
       * /api/@next/applications/{applicationId}/publicComments/{publicCommentId}
       */
      publicComments: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/publicComments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            query: Type.Optional(Type.String()),
            sentiment: Type.Optional(PublicCommentSentimentSchema),
            topic: Type.Optional(PublicCommentTopicSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String()),
            sortBy: Type.Optional(PostSubmissionPublicCommentsSortBySchema),
            orderBy: Type.Optional(PostSubmissionPublicCommentsOrderBySchema)
          })
        ]),
        data: PublicCommentsSchema,
        response: ApiResponseSchema(
          Type.Union([PublicCommentsSchema, Type.Null()])
        )
      },
      publicComment: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/publicComments/{publicCommentId}',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ publicCommentId: Type.String() })
        ]),
        queryParams: undefined,
        data: PublicCommentSchema,
        response: ApiResponseSchema(
          Type.Union([PublicCommentSchema, Type.Null()])
        )
      },
      publicCommentPost: {
        method: 'POST',
        path: '/api/@next/applications/{applicationId}/publicComments',
        prefix: 'PostSubmissionPublicCommentPost',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: undefined,
        body: Type.Omit(PublicCommentSchema, ['id', 'metadata']),
        data: undefined,
        response: undefined
      }
    },
    public: {
      /**
       * /api/@next/public/applications/{applicationId}/publicComments
       * /api/@next/public/applications/{applicationId}/publicComments/{publicCommentId}
       */
      publicComments: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/publicComments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            query: Type.Optional(Type.String()),
            sentiment: Type.Optional(PublicCommentSentimentSchema),
            topic: Type.Optional(PublicCommentTopicSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String()),
            sortBy: Type.Optional(
              PostSubmissionPublishedPublicCommentsSortBySchema
            ),
            orderBy: Type.Optional(
              PostSubmissionPublishedPublicCommentsOrderBySchema
            )
          })
        ]),
        data: PublicCommentsRedactedSchema,
        response: ApiResponseSchema(
          Type.Union([PublicCommentsRedactedSchema, Type.Null()])
        )
      },
      publicComment: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/publicComments/{publicCommentId}',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ publicCommentId: Type.String() })
        ]),
        queryParams: undefined,
        data: PublicCommentRedactedSchema,
        response: ApiResponseSchema(
          Type.Union([PublicCommentRedactedSchema, Type.Null()])
        )
      }
    }
  },
  specialistComments: {
    private: {
      /**
       * /api/@next/applications/{applicationId}/specialistComments
       * /api/@next/applications/{applicationId}/specialistComments/{specialistCommentId}
       */
      specialists: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/specialistComments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            query: Type.Optional(Type.String()),
            sentiment: Type.Optional(SpecialistCommentSentimentSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String()),
            sortBy: Type.Optional(PostSubmissionSpecialistCommentsSortBySchema),
            orderBy: Type.Optional(
              PostSubmissionSpecialistCommentsOrderBySchema
            )
          })
        ]),
        data: SpecialistCommentsSchema,
        response: ApiResponseSchema(
          Type.Union([SpecialistCommentsSchema, Type.Null()])
        )
      },
      specialist: {
        method: 'GET',
        path: '/api/@next/applications/{applicationId}/specialistComments/{specialistCommentId}',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ specialistId: Type.String() })
        ]),
        queryParams: undefined,
        data: SpecialistCommentSchema,
        response: ApiResponseSchema(
          Type.Union([SpecialistCommentSchema, Type.Null()])
        )
      }
    },
    public: {
      /**
       * /api/@next/public/applications/{applicationId}/specialistComments
       * /api/@next/public/applications/{applicationId}/specialistComments/{specialistId}
       */
      specialists: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/specialistComments',
        urlParams: BaseApplicationUrlParamsSchema,
        queryParams: Type.Composite([
          BaseQueryParamsSchema,
          Type.Object({
            query: Type.Optional(Type.String()),
            sentiment: Type.Optional(SpecialistCommentSentimentSchema),
            publishedAtFrom: Type.Optional(Type.String()),
            publishedAtTo: Type.Optional(Type.String()),
            sortBy: Type.Optional(
              PostSubmissionPublishedSpecialistCommentsSortBySchema
            ),
            orderBy: Type.Optional(
              PostSubmissionPublishedSpecialistCommentsOrderBySchema
            )
          })
        ]),
        data: SpecialistCommentsRedactedSchema,
        response: ApiResponseSchema(
          Type.Union([SpecialistCommentsRedactedSchema, Type.Null()])
        )
      },
      specialist: {
        method: 'GET',
        path: '/api/@next/public/applications/{applicationId}/specialistComments/{specialistId}',
        urlParams: Type.Composite([
          BaseApplicationUrlParamsSchema,
          Type.Object({ specialistId: Type.String() })
        ]),
        queryParams: BaseQueryParamsSchema,
        data: SpecialistRedactedSchema,
        response: ApiResponseSchema(
          Type.Union([SpecialistRedactedSchema, Type.Null()])
        )
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Applications
// -----------------------------------------------------------------------------

// PostSubmissionApplications
// export const PostSubmissionApplicationsUrlParams =
//   endpoints.applications.private.applications.urlParams
// export type PostSubmissionApplicationsUrlParams = Static<
//   typeof PostSubmissionApplicationsUrlParams
// >

export const PostSubmissionApplicationsQueryParamsSchema =
  endpoints.applications.private.applications.queryParams
export type PostSubmissionApplicationsQueryParams = Static<
  typeof PostSubmissionApplicationsQueryParamsSchema
>

export const PostSubmissionApplicationsDataSchema =
  endpoints.applications.private.applications.data
export type PostSubmissionApplicationsData = Static<
  typeof PostSubmissionApplicationsDataSchema
>

export const PostSubmissionApplicationsResponseSchema =
  endpoints.applications.private.applications.response
export type PostSubmissionApplicationsResponse = Static<
  typeof PostSubmissionApplicationsResponseSchema
>

// PostSubmissionApplication
export const PostSubmissionApplicationUrlParamsSchema =
  endpoints.applications.private.application.urlParams
export type PostSubmissionApplicationUrlParams = Static<
  typeof PostSubmissionApplicationUrlParamsSchema
>

// export const PostSubmissionApplicationQueryParamsSchema =
//   endpoints.applications.private.application.queryParams
// export type PostSubmissionApplicationQueryParams = Static<
//   typeof PostSubmissionApplicationQueryParamsSchema
// >

export const PostSubmissionApplicationDataSchema =
  endpoints.applications.private.application.data
export type PostSubmissionApplicationData = Static<
  typeof PostSubmissionApplicationDataSchema
>

export const PostSubmissionApplicationResponseSchema =
  endpoints.applications.private.application.response
export type PostSubmissionApplicationResponse = Static<
  typeof PostSubmissionApplicationResponseSchema
>

// PostSubmissionPublishedApplications
// export const PostSubmissionPublishedApplicationsUrlParamsSchema =
//   endpoints.applications.public.applications.urlParams
// export type PostSubmissionPublishedApplicationsUrlParams = Static<
//   typeof PostSubmissionPublishedApplicationsUrlParamsSchema
// >

export const PostSubmissionPublishedApplicationsQueryParamsSchema =
  endpoints.applications.public.applications.queryParams
export type PostSubmissionPublishedApplicationsQueryParams = Static<
  typeof PostSubmissionPublishedApplicationsQueryParamsSchema
>

export const PostSubmissionPublishedApplicationsDataSchema =
  endpoints.applications.public.applications.data
export type PostSubmissionPublishedApplicationsData = Static<
  typeof PostSubmissionPublishedApplicationsDataSchema
>

export const PostSubmissionPublishedApplicationsResponseSchema =
  endpoints.applications.public.applications.response
export type PostSubmissionPublishedApplicationsResponse = Static<
  typeof PostSubmissionPublishedApplicationsResponseSchema
>

// PostSubmissionPublishedApplication
export const PostSubmissionPublishedApplicationUrlParamsSchema =
  endpoints.applications.public.application.urlParams
export type PostSubmissionPublishedApplicationUrlParams = Static<
  typeof PostSubmissionPublishedApplicationUrlParamsSchema
>

// export const PostSubmissionPublishedApplicationQueryParamsSchema =
//   endpoints.applications.public.application.queryParams
// export type PostSubmissionPublishedApplicationQueryParams = Static<
//   typeof PostSubmissionPublishedApplicationQueryParamsSchema
// >

export const PostSubmissionPublishedApplicationDataSchema =
  endpoints.applications.public.application.data
export type PostSubmissionPublishedApplicationData = Static<
  typeof PostSubmissionPublishedApplicationDataSchema
>

export const PostSubmissionPublishedApplicationResponseSchema =
  endpoints.applications.public.application.response
export type PostSubmissionPublishedApplicationResponse = Static<
  typeof PostSubmissionPublishedApplicationResponseSchema
>

// -----------------------------------------------------------------------------
// Documents
// -----------------------------------------------------------------------------

// PostSubmissionDocuments
export const PostSubmissionDocumentsUrlParamsSchema =
  endpoints.documents.private.documents.urlParams
export type PostSubmissionDocumentsUrlParams = Static<
  typeof PostSubmissionDocumentsUrlParamsSchema
>

export const PostSubmissionDocumentsQueryParamsSchema =
  endpoints.documents.private.documents.queryParams
export type PostSubmissionDocumentsQueryParams = Static<
  typeof PostSubmissionDocumentsQueryParamsSchema
>

export const PostSubmissionDocumentsDataSchema =
  endpoints.documents.private.documents.data
export type PostSubmissionDocumentsData = Static<
  typeof PostSubmissionDocumentsDataSchema
>

export const PostSubmissionDocumentsResponseSchema =
  endpoints.documents.private.documents.response
export type PostSubmissionDocumentsResponse = Static<
  typeof PostSubmissionDocumentsResponseSchema
>

// PostSubmissionDocument
export const PostSubmissionDocumentUrlParamsSchema =
  endpoints.documents.private.document.urlParams
export type PostSubmissionDocumentUrlParams = Static<
  typeof PostSubmissionDocumentUrlParamsSchema
>

// export const PostSubmissionDocumentQueryParamsSchema=
//   endpoints.documents.private.document.queryParams
// export type PostSubmissionDocumentQueryParams = Static<
//   typeof PostSubmissionDocumentQueryParamsSchema
// >

export const PostSubmissionDocumentDataSchema =
  endpoints.documents.private.document.data
export type PostSubmissionDocumentData = Static<
  typeof PostSubmissionDocumentDataSchema
>

export const PostSubmissionDocumentResponseSchema =
  endpoints.documents.private.document.response
export type PostSubmissionDocumentResponse = Static<
  typeof PostSubmissionDocumentResponseSchema
>

// PostSubmissionPublishedDocuments
export const PostSubmissionPublishedDocumentsUrlParamsSchema =
  endpoints.documents.public.documents.urlParams
export type PostSubmissionPublishedDocumentsUrlParams = Static<
  typeof PostSubmissionPublishedDocumentsUrlParamsSchema
>

export const PostSubmissionPublishedDocumentsQueryParamsSchema =
  endpoints.documents.public.documents.queryParams
export type PostSubmissionPublishedDocumentsQueryParams = Static<
  typeof PostSubmissionPublishedDocumentsQueryParamsSchema
>

export const PostSubmissionPublishedDocumentsDataSchema =
  endpoints.documents.public.documents.data
export type PostSubmissionPublishedDocumentsData = Static<
  typeof PostSubmissionPublishedDocumentsDataSchema
>

export const PostSubmissionPublishedDocumentsResponseSchema =
  endpoints.documents.public.documents.response
export type PostSubmissionPublishedDocumentsResponse = Static<
  typeof PostSubmissionPublishedDocumentsResponseSchema
>

// PostSubmissionPublishedDocument
export const PostSubmissionPublishedDocumentUrlParamsSchema =
  endpoints.documents.public.document.urlParams
export type PostSubmissionPublishedDocumentUrlParams = Static<
  typeof PostSubmissionPublishedDocumentUrlParamsSchema
>

// export const PostSubmissionPublishedDocumentQueryParamsSchema =
//   endpoints.documents.public.document.queryParams
// export type PostSubmissionPublishedDocumentQueryParams = Static<
//   typeof PostSubmissionPublishedDocumentQueryParamsSchema
// >

export const PostSubmissionPublishedDocumentDataSchema =
  endpoints.documents.public.document.data
export type PostSubmissionPublishedDocumentData = Static<
  typeof PostSubmissionPublishedDocumentDataSchema
>

export const PostSubmissionPublishedDocumentResponseSchema =
  endpoints.documents.public.document.response
export type PostSubmissionPublishedDocumentResponse = Static<
  typeof PostSubmissionPublishedDocumentResponseSchema
>

// -----------------------------------------------------------------------------
// PublicComments
// -----------------------------------------------------------------------------

// PostSubmissionPublicComments
export const PostSubmissionPublicCommentsUrlParamsSchema =
  endpoints.publicComments.private.publicComments.urlParams
export type PostSubmissionPublicCommentsUrlParams = Static<
  typeof PostSubmissionPublicCommentsUrlParamsSchema
>

export const PostSubmissionPublicCommentsQueryParamsSchema =
  endpoints.publicComments.private.publicComments.queryParams
export type PostSubmissionPublicCommentsQueryParams = Static<
  typeof PostSubmissionPublicCommentsQueryParamsSchema
>

export const PostSubmissionPublicCommentsDataSchema =
  endpoints.publicComments.private.publicComments.data
export type PostSubmissionPublicCommentsData = Static<
  typeof PostSubmissionPublicCommentsDataSchema
>

export const PostSubmissionPublicCommentsResponseSchema =
  endpoints.publicComments.private.publicComments.response
export type PostSubmissionPublicCommentsResponse = Static<
  typeof PostSubmissionPublicCommentsResponseSchema
>

// PostSubmissionPublicComment
export const PostSubmissionPublicCommentUrlParamsSchema =
  endpoints.publicComments.private.publicComment.urlParams
export type PostSubmissionPublicCommentUrlParams = Static<
  typeof PostSubmissionPublicCommentUrlParamsSchema
>

// export const PostSubmissionPublicCommentQueryParamsSchema =
//   endpoints.publicComments.private.publicComment.queryParams
// export type PostSubmissionPublicCommentQueryParams = Static<
//   typeof PostSubmissionPublicCommentQueryParamsSchema
// >

export const PostSubmissionPublicCommentDataSchema =
  endpoints.publicComments.private.publicComment.data
export type PostSubmissionPublicCommentData = Static<
  typeof PostSubmissionPublicCommentDataSchema
>

export const PostSubmissionPublicCommentResponseSchema =
  endpoints.publicComments.private.publicComment.response
export type PostSubmissionPublicCommentResponse = Static<
  typeof PostSubmissionPublicCommentResponseSchema
>

// PostSubmissionPublicCommentPost

export const PostSubmissionPublicCommentPostUrlParamsSchema =
  endpoints.publicComments.private.publicCommentPost.urlParams
export type PostSubmissionPublicCommentPostUrlParams = Static<
  typeof PostSubmissionPublicCommentPostUrlParamsSchema
>

export const PostSubmissionPublicCommentPostBodySchema =
  endpoints.publicComments.private.publicCommentPost.body
export type PostSubmissionPublicCommentPostBody = Static<
  typeof PostSubmissionPublicCommentPostBodySchema
>

// PostSubmissionPublishedPublicComments
export const PostSubmissionPublishedPublicCommentsUrlParamsSchema =
  endpoints.publicComments.public.publicComments.urlParams
export type PostSubmissionPublishedPublicCommentsUrlParams = Static<
  typeof PostSubmissionPublishedPublicCommentsUrlParamsSchema
>

export const PostSubmissionPublishedPublicCommentsQueryParamsSchema =
  endpoints.publicComments.public.publicComments.queryParams
export type PostSubmissionPublishedPublicCommentsQueryParams = Static<
  typeof PostSubmissionPublishedPublicCommentsQueryParamsSchema
>

export const PostSubmissionPublishedPublicCommentsDataSchema =
  endpoints.publicComments.public.publicComments.data
export type PostSubmissionPublishedPublicCommentsData = Static<
  typeof PostSubmissionPublishedPublicCommentsDataSchema
>

export const PostSubmissionPublishedPublicCommentsResponseSchema =
  endpoints.publicComments.public.publicComments.response
export type PostSubmissionPublishedPublicCommentsResponse = Static<
  typeof PostSubmissionPublishedPublicCommentsResponseSchema
>

// PostSubmissionPublishedPublicComment
export const PostSubmissionPublishedPublicCommentUrlParamsSchema =
  endpoints.publicComments.public.publicComment.urlParams
export type PostSubmissionPublishedPublicCommentUrlParams = Static<
  typeof PostSubmissionPublishedPublicCommentUrlParamsSchema
>

// export const PostSubmissionPublishedPublicCommentQueryParamsSchema =
//   endpoints.publicComments.public.publicComment.queryParams
// export type PostSubmissionPublishedPublicCommentQueryParams = Static<
//   typeof PostSubmissionPublishedPublicCommentQueryParamsSchema
// >

export const PostSubmissionPublishedPublicCommentDataSchema =
  endpoints.publicComments.public.publicComment.data
export type PostSubmissionPublishedPublicCommentData = Static<
  typeof PostSubmissionPublishedPublicCommentDataSchema
>

export const PostSubmissionPublishedPublicCommentResponseSchema =
  endpoints.publicComments.public.publicComment.response
export type PostSubmissionPublishedPublicCommentResponse = Static<
  typeof PostSubmissionPublishedPublicCommentResponseSchema
>

// -----------------------------------------------------------------------------
// SpecialistComments
// -----------------------------------------------------------------------------

// PostSubmissionSpecialists
export const PostSubmissionSpecialistsUrlParamsSchema =
  endpoints.specialistComments.private.specialists.urlParams
export type PostSubmissionSpecialistsUrlParams = Static<
  typeof PostSubmissionSpecialistsUrlParamsSchema
>

export const PostSubmissionSpecialistsQueryParamsSchema =
  endpoints.specialistComments.private.specialists.queryParams
export type PostSubmissionSpecialistsQueryParams = Static<
  typeof PostSubmissionSpecialistsQueryParamsSchema
>

export const PostSubmissionSpecialistsDataSchema =
  endpoints.specialistComments.private.specialists.data
export type PostSubmissionSpecialistsData = Static<
  typeof PostSubmissionSpecialistsDataSchema
>

export const PostSubmissionSpecialistsResponseSchema =
  endpoints.specialistComments.private.specialists.response
export type PostSubmissionSpecialistsResponse = Static<
  typeof PostSubmissionSpecialistsResponseSchema
>

// PostSubmissionSpecialist
export const PostSubmissionSpecialistUrlParamsSchema =
  endpoints.specialistComments.private.specialist.urlParams
export type PostSubmissionSpecialistUrlParams = Static<
  typeof PostSubmissionSpecialistUrlParamsSchema
>

// export const PostSubmissionSpecialistQueryParamsSchema =
//   endpoints.specialistComments.private.specialist.queryParams
// export type PostSubmissionSpecialistQueryParams = Static<
//   typeof PostSubmissionSpecialistQueryParamsSchema
// >

export const PostSubmissionSpecialistDataSchema =
  endpoints.specialistComments.private.specialist.data
export type PostSubmissionSpecialistData = Static<
  typeof PostSubmissionSpecialistDataSchema
>

export const PostSubmissionSpecialistResponseSchema =
  endpoints.specialistComments.private.specialist.response
export type PostSubmissionSpecialistResponse = Static<
  typeof PostSubmissionSpecialistResponseSchema
>

// PostSubmissionPublishedSpecialists
export const PostSubmissionPublishedSpecialistsUrlParamsSchema =
  endpoints.specialistComments.public.specialists.urlParams
export type PostSubmissionPublishedSpecialistsUrlParams = Static<
  typeof PostSubmissionPublishedSpecialistsUrlParamsSchema
>

export const PostSubmissionPublishedSpecialistsQueryParamsSchema =
  endpoints.specialistComments.public.specialists.queryParams
export type PostSubmissionPublishedSpecialistsQueryParams = Static<
  typeof PostSubmissionPublishedSpecialistsQueryParamsSchema
>

export const PostSubmissionPublishedSpecialistsDataSchema =
  endpoints.specialistComments.public.specialists.data
export type PostSubmissionPublishedSpecialistsData = Static<
  typeof PostSubmissionPublishedSpecialistsDataSchema
>

export const PostSubmissionPublishedSpecialistsResponseSchema =
  endpoints.specialistComments.public.specialists.response
export type PostSubmissionPublishedSpecialistsResponse = Static<
  typeof PostSubmissionPublishedSpecialistsResponseSchema
>

// PostSubmissionPublishedSpecialist
export const PostSubmissionPublishedSpecialistUrlParamsSchema =
  endpoints.specialistComments.public.specialist.urlParams
export type PostSubmissionPublishedSpecialistUrlParams = Static<
  typeof PostSubmissionPublishedSpecialistUrlParamsSchema
>

export const PostSubmissionPublishedSpecialistQueryParamsSchema =
  endpoints.specialistComments.public.specialist.queryParams
export type PostSubmissionPublishedSpecialistQueryParams = Static<
  typeof PostSubmissionPublishedSpecialistQueryParamsSchema
>

export const PostSubmissionPublishedSpecialistDataSchema =
  endpoints.specialistComments.public.specialist.data
export type PostSubmissionPublishedSpecialistData = Static<
  typeof PostSubmissionPublishedSpecialistDataSchema
>

export const PostSubmissionPublishedSpecialistResponseSchema =
  endpoints.specialistComments.public.specialist.response
export type PostSubmissionPublishedSpecialistResponse = Static<
  typeof PostSubmissionPublishedSpecialistResponseSchema
>
