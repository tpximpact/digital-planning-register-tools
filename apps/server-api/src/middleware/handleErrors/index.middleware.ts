import Elysia from 'elysia'
import { DprApiError } from '../../errors/DprApiError.error'
import config from '@apps/server-api/config'
import {
  buildApiErrorResponse,
  defaultErrorResponse,
  getStatusInfo
} from './utils'
import { StatusCodes } from 'http-status-codes'

export const handleErrors = new Elysia({
  name: 'handleErrors'
})
  .error({ DPR_AUTHENTICATION_ERROR: DprApiError })
  .onError({ as: 'global' }, (context) => {
    const { error, set, code } = context

    if (config.debug) {
      console.error(
        `[handleErrors][onError] code: ${code}, status: ${set.status}`
      )
    }

    let response = defaultErrorResponse

    if (error instanceof DprApiError) {
      if (config.debug) {
        console.error(
          `[handleErrors][onError][DprApiError] code: ${error.status}, message: ${error.actualMessage}, detail: ${error.message ? error.message : ''}`
        )
      }

      response = buildApiErrorResponse(error)
    } else {
      if (config.debug) {
        console.error(
          `[handleErrors][onError][Error] code: ${code}, set.status: ${set.status}`
        )
      }

      let detail = undefined

      switch (code) {
        case 'VALIDATION':
          detail = JSON.parse(error.message)
          break
        case 'NOT_FOUND':
          set.status = StatusCodes.NOT_FOUND
          detail = undefined
          break
        case 'PARSE':
          detail = error.message
          break
        case 'INTERNAL_SERVER_ERROR':
          detail = error.message
          break
        case 'INVALID_COOKIE_SIGNATURE':
          detail = error.message
          break
        case 'INVALID_FILE_TYPE':
          detail = error.message
          break
        case 'UNKNOWN':
          detail = error.message
          break
      }

      const statusInfo = getStatusInfo(set.status)
      response = {
        ...defaultErrorResponse,
        status: {
          code: statusInfo.code,
          message: statusInfo.phrase,
          detail
        }
      }
    }

    return Response.json(response, {
      status: response.status?.code
    })
  })
