import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'

export const OkResponseObject: ApiResponseStatus = {
  code: StatusCodes.OK,
  message: ReasonPhrases.OK
}
export const BadRequestResponseObject: ApiResponseStatus = {
  code: StatusCodes.BAD_REQUEST,
  message: ReasonPhrases.BAD_REQUEST
}
export const InternalServerErrorResponseObject: ApiResponseStatus = {
  code: StatusCodes.INTERNAL_SERVER_ERROR,
  message: ReasonPhrases.INTERNAL_SERVER_ERROR
}
export const NotFoundResponseObject: ApiResponseStatus = {
  code: StatusCodes.NOT_FOUND,
  message: ReasonPhrases.NOT_FOUND
}
export const UnprocessableEntityResponseObject: ApiResponseStatus = {
  code: StatusCodes.UNPROCESSABLE_ENTITY,
  message: ReasonPhrases.UNPROCESSABLE_ENTITY
}
