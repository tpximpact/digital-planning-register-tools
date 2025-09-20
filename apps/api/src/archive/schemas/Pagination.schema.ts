import { t, type Static } from 'elysia'

// OffsetPagination schema
export const OffsetPaginationSchema = t.Object({
  resultsPerPage: t.Number(),
  currentPage: t.Number(),
  totalPages: t.Number(),
  totalResults: t.Number(),
  totalAvailableItems: t.Optional(t.Number())
})

export type OffsetPagination = Static<typeof OffsetPaginationSchema>

// CursorPagination schema
export const CursorPaginationSchema = t.Object({
  resultsPerPage: t.Number(),
  nextCursor: t.Union([t.String(), t.Null()]),
  prevCursor: t.Union([t.String(), t.Null()]),
  totalResults: t.Number(),
  totalAvailableItems: t.Optional(t.Number())
})

export type CursorPagination = Static<typeof CursorPaginationSchema>
