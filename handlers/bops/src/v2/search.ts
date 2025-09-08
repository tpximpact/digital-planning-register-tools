import { handleBopsGetRequest } from '../requests'

// TODO: Use proper types here instead of any
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function search(client: string, searchParams?: any): Promise<any> {
  let url = `public/planning_applications/search`

  if (searchParams) {
    const params = new URLSearchParams({
      page: searchParams?.page?.toString(),
      maxresults: searchParams?.resultsPerPage?.toString() ?? '10'
    })

    if (searchParams?.query) {
      params.append('q', searchParams?.query)
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
  const request = await handleBopsGetRequest(client, url)
  const applications = request.data || []
  const pagination = request.pagination || {}

  return {
    ...request,
    data: {
      applications,
      pagination
    }
  }
}
