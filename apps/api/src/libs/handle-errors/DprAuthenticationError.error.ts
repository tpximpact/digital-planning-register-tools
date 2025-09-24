import { StatusCodes } from 'http-status-codes'
import { DprApiError } from './ApiError.error'

/**
 * @file Error class for DPR authentication errors
 */
export class DprAuthenticationError extends DprApiError {
  public override code = 'DPR_AUTHENTICATION_ERROR'
  readonly realm: string

  constructor(
    message: string,
    realm: string,
    status: StatusCodes = StatusCodes.UNAUTHORIZED,
    options?: ErrorOptions
  ) {
    super(status, message, options)
    this.realm = realm
  }
}
