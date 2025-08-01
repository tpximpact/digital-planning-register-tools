import type { Static, TSchema } from 'elysia'
import { t } from 'elysia'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

// Status schema
export const ApiStatusSchema = t.Object({
  code: t.Enum(StatusCodes),
  message: t.Enum(ReasonPhrases),
  detail: t.Optional(t.String())
})

// Generic ApiResponse schema factory
export const ApiPaginatedResponseSchema = <T extends TSchema>(DataSchema: T) =>
  t.Object({
    data: t.Union([DataSchema, t.Null()]),
    pagination: t.Optional(t.Union([PaginationSchema, CursorPaginationSchema])),
    status: t.Optional(ApiStatusSchema)
  })

export const ApiResponseSchema = <T extends TSchema>(DataSchema: T) =>
  t.Object({
    data: t.Union([DataSchema, t.Null()]),
    status: t.Optional(ApiStatusSchema)
  })

// Example usage:
// const MyDataSchema = t.Object({ foo: t.String() })
// export const MyApiResponseSchema = ApiResponseSchema(MyDataSchema)
// export type MyApiResponse = Static<typeof MyApiResponseSchema>

// Pagination schema
export const PaginationSchema = t.Object({
  resultsPerPage: t.Number(),
  currentPage: t.Number(),
  totalPages: t.Number(),
  totalResults: t.Number(),
  totalAvailableItems: t.Optional(t.Number())
})

export type Pagination = Static<typeof PaginationSchema>

// CursorPagination schema
export const CursorPaginationSchema = t.Object({
  resultsPerPage: t.Number(),
  nextCursor: t.Union([t.String(), t.Null()]),
  prevCursor: t.Union([t.String(), t.Null()]),
  totalResults: t.Number(),
  totalAvailableItems: t.Optional(t.Number())
})

export type CursorPagination = Static<typeof CursorPaginationSchema>
