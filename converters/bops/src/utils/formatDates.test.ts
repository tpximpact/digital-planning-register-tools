import { describe, it, expect } from 'bun:test'

import { convertDateTimeToUtc } from './formatDates'

describe('convertDateTimeToUtc', () => {
  it('converts a date with timezone offset to UTC', () => {
    const input = '2024-07-05T12:05:14.224+01:00'
    const expected = '2024-07-05T11:05:14Z'
    expect(convertDateTimeToUtc(input)).toBe(expected)
  })

  it('converts a midnight date with +01:00 offset to previous day UTC', () => {
    const input = '2024-07-02T00:00:00.000+01:00'
    const expected = '2024-07-01T23:00:00Z'
    expect(convertDateTimeToUtc(input)).toBe(expected)
  })

  it('returns the same date if already in UTC', () => {
    const input = '2024-07-05T11:05:14Z'
    const expected = '2024-07-05T11:05:14Z'
    expect(convertDateTimeToUtc(input)).toBe(expected)
  })

  it('handles invalid date string gracefully', () => {
    const input = 'not-a-date'
    expect(convertDateTimeToUtc(input)).toBe('Invalid Date')
  })
})
