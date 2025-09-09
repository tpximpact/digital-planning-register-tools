import { describe, it, expect } from 'bun:test'
import { FormatRegistry } from '@sinclair/typebox'
import './formats'

const bopsDateTime = FormatRegistry.Get('bops-date-time')
if (!bopsDateTime) {
  throw new Error('bops-date-time format is not registered')
}

describe('bops-date-time format', () => {
  it('accepts valid date with milliseconds and offset', () => {
    expect(bopsDateTime('2025-07-03T15:23:53.264+01:00')).toBe(true)
    expect(bopsDateTime('2025-12-31T23:59:59.999-05:00')).toBe(true)
  })

  it('rejects date with Z timezone', () => {
    expect(bopsDateTime('2025-07-03T14:23:53.264Z')).toBe(false)
  })

  it('rejects date without milliseconds', () => {
    expect(bopsDateTime('2025-07-03T15:23:53+01:00')).toBe(false)
  })

  it('rejects date with missing offset', () => {
    expect(bopsDateTime('2025-07-03T15:23:53.264')).toBe(false)
  })

  it('rejects completely invalid date', () => {
    expect(bopsDateTime('not-a-date')).toBe(false)
  })
})
