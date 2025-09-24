import { ApiResponseNoPagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { t } from 'elysia'
import { ReasonPhrases } from 'http-status-codes'
import type Elysia from 'elysia'
import {
  BadRequestResponseObject,
  InternalServerErrorResponseObject,
  NotFoundResponseObject,
  OkResponseObject
} from './standard-response-objects'

export const standardResponses = (app: Elysia) =>
  app
    .model({
      empty200: ApiResponseNoPagination(t.Null(), {
        title: ReasonPhrases.OK,
        description: ReasonPhrases.OK,
        examples: [
          {
            data: null,
            status: OkResponseObject
          }
        ]
      }),
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
        200: 'empty200',
        400: '400',
        404: '404',
        500: '500'
      }
    })
