import { ApiResponseNoPagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { t } from 'elysia'
import { ReasonPhrases } from 'http-status-codes'
import type Elysia from 'elysia'
import {
  BadRequestResponseObject,
  InternalServerErrorResponseObject,
  NotFoundResponseObject,
  OkResponseObject,
  UnprocessableEntityResponseObject
} from './standard-response-objects'

export const empty200Model = ApiResponseNoPagination(t.Null(), {
  title: ReasonPhrases.OK,
  description: ReasonPhrases.OK,
  examples: [
    {
      data: null,
      status: OkResponseObject
    }
  ]
})

/**
 * This module adds in standard responses eg 'empty200' 400, 404, 422, 500 as models
 * and as a guard so that all of those conditions return with that schema
 */
export const standardResponses = (app: Elysia) =>
  app
    .model({
      empty200: empty200Model,
      '400': ApiResponseNoPagination(t.Null(), {
        title: ReasonPhrases.BAD_REQUEST,
        description: ReasonPhrases.BAD_REQUEST,
        examples: [
          {
            data: null,
            status: BadRequestResponseObject
          }
        ]
      }),
      '404': ApiResponseNoPagination(t.Null(), {
        title: ReasonPhrases.NOT_FOUND,
        description: ReasonPhrases.NOT_FOUND,
        examples: [
          {
            data: null,
            status: NotFoundResponseObject
          }
        ]
      }),
      '422': ApiResponseNoPagination(t.Null(), {
        title: ReasonPhrases.UNPROCESSABLE_ENTITY,
        description: ReasonPhrases.UNPROCESSABLE_ENTITY,
        examples: [
          {
            data: null,
            status: UnprocessableEntityResponseObject
          }
        ]
      }),
      '500': ApiResponseNoPagination(t.Null(), {
        title: ReasonPhrases.INTERNAL_SERVER_ERROR,
        description: ReasonPhrases.INTERNAL_SERVER_ERROR,
        examples: [
          {
            data: null,
            status: InternalServerErrorResponseObject
          }
        ]
      })
    })
    .guard({
      response: {
        400: '400',
        404: '404',
        422: '422',
        500: '500'
      }
    })
