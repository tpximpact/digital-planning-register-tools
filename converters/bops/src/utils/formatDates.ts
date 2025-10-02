import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

/**
 * 2024-07-05T12:05:14.224+01:00 > 2024-07-05T11:05:14.224Z
 *
 * Converts a date string with a time and timezone offset to a UTC date string.
 * Mostly used in the BOPS handlers to convert dateTimes to UTC.
 *
 * NB 2024-07-02T00:00:00.000+01:00 will be returned as 2024-07-01T23:00:00Z in this
 * function as thats the correct result for the conversion
 *
 *
 *
 * @param dateString
 * @returns
 */
export const convertDateTimeToUtc = (dateString: string): string => {
  return dayjs(dateString).utc().format()
}

export const convertToDate = (dateString: string): Date => {
  return dayjs(dateString).utc().toDate()
}

export const formatToYYYYMMDDDate = (dateString: string): string => {
  const date: Dayjs = dayjs.utc(dateString)
  if (!date.isValid()) {
    return 'Invalid Date'
  }
  return date.format('YYYY-MM-DD')
}

/**
 * Converts Date() to "YYYY-MM-DD" format.
 * Doesn't use dayjs.
 * Used in mocks only
 * @param date
 * @returns
 */
export const formatDateToYmd = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
