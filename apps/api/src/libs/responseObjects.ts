import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import type { ApiStatus } from '../schemas'

export const OkResponseObject: ApiStatus = {
  code: StatusCodes.OK,
  message: ReasonPhrases.OK
}
export const BadRequestResponseObject: ApiStatus = {
  code: StatusCodes.BAD_REQUEST,
  message: ReasonPhrases.BAD_REQUEST
}
