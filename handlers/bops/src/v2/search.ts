import type { ApiResponse } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.js'
import { handleBopsGetRequest } from '../requests'
import type { SearchParamsApplication } from '../types/types'

export async function search<T>(
  client: string,
  searchParams?: SearchParamsApplication
): Promise<ApiResponse<T> | null> {
  let url = `public/planning_applications/search`

  if (searchParams) {
    const params = new URLSearchParams({
      page: searchParams?.page?.toString(),
      maxresults: searchParams?.resultsPerPage?.toString() ?? '10'
    })

    if (searchParams?.query) {
      params.append('query', searchParams?.query)
    }
    if (searchParams.sortBy) {
      params.append('sortBy', searchParams.sortBy)
    }
    if (searchParams.orderBy) {
      params.append('orderBy', searchParams.orderBy)
    }
    if (searchParams.dprFilter) {
      params.append('dprFilter', searchParams.dprFilter)
    }
    if (searchParams.reference) {
      params.append('reference', searchParams.reference)
    }
    if (searchParams.description) {
      params.append('description', searchParams.description)
    }
    if (searchParams.applicationType) {
      params.append('applicationType', searchParams.applicationType)
    }
    if (searchParams.applicationStatus) {
      params.append('applicationStatus', searchParams.applicationStatus)
    }
    if (searchParams.councilDecision) {
      params.append('councilDecision', searchParams.councilDecision)
    }

    if (searchParams.dateType && searchParams.dateRange) {
      const { dateType, dateRange, dateRangeFrom, dateRangeTo } = searchParams
      const formatDate = (date: Date) => date.toISOString().slice(0, 10)
      const today = new Date()

      let from: string | undefined
      let to: string | undefined = formatDate(today)

      switch (dateRange) {
        case 'fixed':
          if (dateRangeFrom && dateRangeTo) {
            from = dateRangeFrom
            to = dateRangeTo
          }
          break
        case 'week': {
          const d = new Date(today)
          d.setDate(today.getDate() - 7)
          from = formatDate(d)
          break
        }
        case 'month': {
          const d = new Date(today)
          d.setMonth(today.getMonth() - 1)
          from = formatDate(d)
          break
        }
        case 'quarter': {
          const d = new Date(today)
          d.setMonth(today.getMonth() - 3)
          from = formatDate(d)
          break
        }
        case 'year': {
          const d = new Date(today)
          d.setFullYear(today.getFullYear() - 1)
          from = formatDate(d)
          break
        }
      }

      if (from && to) {
        params.append(`${dateType}From`, from)
        params.append(`${dateType}To`, to)
      }
    }

    url = `${url}?${params.toString()}`
  }
  try {
    const request = await handleBopsGetRequest<ApiResponse<T>>(client, url)
    return request
  } catch (error) {
    console.error('Error fetching application data:', error)
    let detail = 'Unknown error'
    if (error instanceof Error) {
      detail = error.message
    }
    return {
      data: null,
      status: {
        code: 500,
        message: 'Internal server error',
        detail
      }
    }
  }
}
