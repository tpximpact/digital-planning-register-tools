import { t, type Static, type TSchema } from 'elysia'
import {
  CursorPaginationSchema,
  OffsetPaginationSchema
} from './Pagination.schema'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

/**
 * API response schema.
 * This schema defines the structure of the API response.
 * ApiResponseSchema can't be used on its own, it requires DataSchema to be passed to it
 *
 * @template T - The type of the data in the response.
 *
 * interface ApiResponse<T> {
 *  data: T | null; // The data returned by the API, can be null
 *  status?: {
 *    code: number;
 *    message: string;
 *    detail?: string;
 *  };
 * }
 *
 * @param DataSchema
 * @returns
 */
export const ApiResponseSchema = <T extends TSchema>(
  DataSchema: T,
  options?: Parameters<typeof t.Object>[1]
) =>
  t.Object(
    {
      data: DataSchema,
      status: t.Optional(ApiStatusSchema)
    },
    options
  )

/**
 * API response status schema.
 * This schema defines the structure of the status object in the API response.
 */
export const ApiStatusSchema = t.Object({
  code: t.Enum(StatusCodes),
  message: t.Enum(ReasonPhrases),
  detail: t.Optional(t.String())
})
export type ApiStatus = Static<typeof ApiStatusSchema>

/**
 * API paginated response schema.
 * This schema defines the structure of the API paginated response.
 * @template T - The type of the data in the response.
 *
 * interface ApiPaginatedResponse<T> {
 *  data: T | null;
 *  pagination?: Pagination | CursorPagination;
 *  status?: {
 *    code: number;
 *    message: string;
 *    detail?: string;
 *  };
 * }
 *
 * @param DataSchema
 * @returns
 */
export const ApiPaginatedResponseSchema = <T extends TSchema>(
  DataSchema: T,
  options?: Parameters<typeof t.Object>[1]
) =>
  t.Object(
    {
      data: t.Union([DataSchema, t.Null()]),
      pagination: t.Union([OffsetPaginationSchema, CursorPaginationSchema]),
      status: t.Optional(ApiStatusSchema)
    },
    options
  )
