import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

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
