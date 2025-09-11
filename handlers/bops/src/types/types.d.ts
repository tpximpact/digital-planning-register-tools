import type { AssessmentDecision } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/AssessmentDecision.ts'
import type { CommentSentiment } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/CommentSentiment.ts'
import { DprCommentTypes } from '@/types/definitions'
import type { CommentTopic } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/CommentTopic.ts'
import type { PrototypeFileType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/FileType.ts'

/**
 * This file contains the definitions for common objects used accross the application
 *
 * ApiResponse - the standard response object from the API
 * DprPagination - the object that describes the pagination of a list of objects
 * SearchParams - common object to represent search parameters
 * Documentation - common object to represent documentation for a handler
 * DprStatusSummary - the dpr version of the application status
 * DprDecisionSummary - the dpr version of the decision summary
 */

/**
 *
 *
 *
 * ApiResponse
 * Standardises what we expect to be returned as BOPS either gives us data or an error
 *
 *
 *
 */
export interface ApiResponse<T> {
  data: T | null
  pagination?: DprPagination
  status: {
    code: number
    message: string
    detail?: string
  }
}

/**
 *
 *
 *
 * SearchParams
 * common object to represent search parameters
 *
 *
 *
 */

export type UnknownSearchParams = Record<string, string | string[] | undefined>
export interface SearchParams {
  page: number
  resultsPerPage: number
  query?: string
}

// Application specific search params
export interface SearchParamsApplication extends SearchParams {
  type: 'simple' | 'full'
  sortBy?: DprApplicationSortBy
  orderBy?: DprApplicationOrderBy
  dprFilter?: DprQuickSearchFilter
  reference?: string
  description?: string
  applicationType?: string
  applicationStatus?: string
  councilDecision?: string
  dateType?: DprApplicationDateType
  dateRange?: DprApplicationDateRange
  dateRangeFrom?: string
  dateRangeTo?: string
}
export type DprApplicationSortBy = 'receivedAt' | 'councilDecisionDate'
export type DprApplicationOrderBy = 'asc' | 'desc'
export type DprQuickSearchFilter =
  | 'inConsultation'
  | 'publishedThisWeek'
  | 'publishedThisMonth'
  | 'decidedThisWeek'
  | 'decidedThisMonth'
export type DprApplicationDateType =
  | 'receivedAt'
  | 'validatedAt'
  | 'publishedAt'
  | 'consultationEndDate'
  | 'councilDecisionDate'
  | 'appealDecisionDate'
export type DprApplicationDateRange =
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'fixed'
// Document specific search params
export interface SearchParamsDocuments extends SearchParams {
  sortBy?: DprDocumentSortBy
  orderBy?: DprDocumentOrderBy
  name?: string
  type?: PrototypeFileType
  publishedAtFrom?: string
  publishedAtTo?: string
}
export type DprDocumentSortBy = 'publishedAt' | 'name'
export type DprDocumentOrderBy = 'asc' | 'desc'

// Comment specific search params
export interface SearchParamsComments extends SearchParams {
  type: DprCommentTypes
  sortBy?: DprCommentSortBy
  orderBy?: DprCommentOrderBy
  sentiment?: CommentSentiment | SpecialistCommentSentiment
  topic?: CommentTopic
  publishedAtFrom?: string
  publishedAtTo?: string
}
export type DprCommentSortBy = 'receivedAt'
export type DprCommentOrderBy = 'asc' | 'desc'
/**
 *
 *
 *
 * DprPagination
 * the object that describes the pagination of a list of objects
 * @todo export type DprPagination = Pagination (from digital-planning-data-schemas)
 *
 *
 *
 */
// export type DprPagination = Pagination;
export interface DprPagination {
  /**
   * Number of results per page eg 10
   */
  resultsPerPage: number
  /**
   * Current page number eg 1
   */
  currentPage: number
  /**
   * Total number of pages eg 10
   */
  totalPages: number
  /**
   * Represents the total number of results returned by current query
   */
  totalResults: number
  /**
   * Represents the total number of items available in the database (#nofilter)
   */
  totalAvailableItems?: number
}

/**
 *
 *
 *
 * Documentation
 * common object to represent documentation for a handler
 *
 *
 *
 */
export interface Documentation {
  url: string
  file: string
  description: string | JSX.Element
  arguments?: string[]
  run: Awaited<(...args) => void>
  validate?: {
    url: string
    type: 'application' | 'prototypeApplication'
  }[]
  examples?: {
    url: string
    description: string
    source?: string[]
  }[]
  source?: string[]
}

/**
 *
 *
 *
 * DprStatusSummary
 * the dpr version of the application status
 *
 *
 *
 */
export type DprStatusSummary =
  | 'Application submitted'
  | 'Application returned'
  | 'Consultation in progress'
  | 'Assessment in progress'
  | 'Determined'
  | 'Withdrawn'
  | 'Appeal lodged'
  | 'Appeal validated'
  | 'Appeal in progress'
  | 'Appeal decided'
  | 'Unknown'

/**
 *
 *
 *
 * DprDecisionSummary
 * the dpr version of the decision summary
 *
 *
 *
 */
type DprPriorApprovalDecision =
  | 'Prior approval required and approved'
  | 'Prior approval not required'
  | 'Prior approval required and refused'

export type DprDecisionSummary = AssessmentDecision | DprPriorApprovalDecision
