import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import { CursorPagination, Pagination } from './Pagination'

export type ApiResponse<T extends TSchema> = Static<
  ReturnType<typeof ApiResponse<T>>
>
export const ApiResponse = <T extends TSchema>(T: T) =>
  Type.Object(
    {
      data: Type.Union([T, Type.Null()]),
      pagination: Type.Optional(Type.Union([Pagination, CursorPagination])),
      status: Type.Optional(ApiResponseStatus)
    },
    { description: '#ApiResponse' }
  )

export const ApiResponseStatus = Type.Object({
  code: Type.Number(),
  message: Type.String(),
  detail: Type.Optional(Type.String())
})
export type ApiResponseStatus = Static<typeof ApiResponseStatus>
