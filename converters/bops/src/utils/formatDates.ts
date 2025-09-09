import dayjs from 'dayjs'
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
