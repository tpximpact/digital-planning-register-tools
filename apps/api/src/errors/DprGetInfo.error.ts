import { StatusCodes } from 'http-status-codes'
import { DprApiError } from './DprApiError.error'

/**
 * @file Error class for DPR getInfo errors
 */
export class DprGetInfoError extends DprApiError {
  public override code = 'DPR_GET_INFO_ERROR'

  constructor(
    message: string,
    status: StatusCodes = StatusCodes.BAD_REQUEST,
    options?: ErrorOptions
  ) {
    super(status, message, options)
  }
}
