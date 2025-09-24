import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../handle-errors/ApiError.error'

/**
 * @file Error class for DPR getInfo errors
 */
export class ClientHeadersError extends ApiError {
  public override code = 'CLIENT_HEADERS_ERROR'

  constructor(
    message: string,
    status: StatusCodes = StatusCodes.BAD_REQUEST,
    options?: ErrorOptions
  ) {
    super(status, message, options)
  }
}
