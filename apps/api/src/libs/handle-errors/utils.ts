import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'

import { t, type Static, type StatusMap } from 'elysia'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { standardResponseObjects } from '../standard-responses'
import type { ApiError } from './ApiError.error'

const _ErrorResponseSchema = ApiResponse(t.Null(), {
  description: 'Bad Request'
})
type ErrorResponse = Static<typeof _ErrorResponseSchema>

/**
 * defaultErrorResponse is the default response structure for API errors.
 */
export const defaultErrorResponse: ErrorResponse = {
  data: null,
  status: {
    ...standardResponseObjects.InternalServerErrorResponseObject,
    detail: 'An unexpected error occurred'
  }
}

export const buildApiErrorResponse = (error: ApiError): ErrorResponse => {
  const response = {
    ...defaultErrorResponse,
    status: {
      code: error.status,
      message: error.actualMessage,
      detail: error.message
    }
  }
  return response
}

/**
 * getStatusInfo retrieves the status information for a given status code or phrase.
 * @param status The status code or phrase to retrieve information for.
 * @returns An object containing the status code, constant name, and phrase.
 */
export function getStatusInfo(status?: number | keyof StatusMap) {
  // Default values
  let code = StatusCodes.INTERNAL_SERVER_ERROR
  let constant = 'INTERNAL_SERVER_ERROR'
  let phrase = ReasonPhrases.INTERNAL_SERVER_ERROR

  if (typeof status === 'number') {
    // Find the constant name for the code
    const found = Object.entries(StatusCodes).find(
      ([_key, value]) => value === status
    )
    if (found && found[0]) {
      constant = found[0]
      code = status
      phrase = ReasonPhrases[constant as keyof typeof ReasonPhrases] ?? phrase
    }
  } else if (typeof status === 'string') {
    // Find the constant name for the reason phrase
    const found = Object.entries(ReasonPhrases).find(
      ([_key, value]) => value === status
    )
    if (found && found[0]) {
      constant = found[0]
      phrase = found[1]
      code = StatusCodes[constant as keyof typeof StatusCodes] ?? code
    }
  }
  return { code, constant, phrase }
}
