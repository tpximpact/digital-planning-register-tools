import { ReasonPhrases, StatusCodes } from 'http-status-codes'

/**
 * @file ApiError class for handling API errors
 * ApiError is a custom error class for handling API errors.
 * It extends the built-in Error class and includes an HTTP status code.
 * This class is used to standardize error handling across the application.
 *
 * message maps to our returned detail field in the API response.
 *
 * see https://github.com/elysiajs/elysia/issues/313
 */
export class ApiError extends Error {
  public code = 'API_ERROR'
  status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  actualMessage: ReasonPhrases

  constructor(status: StatusCodes, message?: string, options?: ErrorOptions) {
    super(message, options)
    this.status = status

    const statusConstMap = Object.entries(StatusCodes).find(
      ([_key, value]) => value === status
    )

    const statusConst = statusConstMap
      ? statusConstMap[0]
      : 'INTERNAL_SERVER_ERROR'

    this.actualMessage =
      ReasonPhrases[statusConst as keyof typeof ReasonPhrases]

    Object.setPrototypeOf(this, ApiError.prototype)
    Error.captureStackTrace(this)
  }
}
