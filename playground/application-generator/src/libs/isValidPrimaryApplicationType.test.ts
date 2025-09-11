import { describe, expect, it } from 'bun:test'
import { isValidPrimaryApplicationType } from './isValidPrimaryApplicationType'
import { validPrimaryApplicationTypes } from './validPrimaryApplicationTypes'

describe('isValidPrimaryApplicationType', () => {
  it('should return true for valid primary application types', () => {
    validPrimaryApplicationTypes.forEach((type) => {
      expect(isValidPrimaryApplicationType(type)).toBe(true)
    })
  })

  it('should return false for invalid primary application types', () => {
    const invalidTypes = [
      'invalidType',
      'anotherInvalidType',
      '',
      null,
      undefined
    ]

    invalidTypes.forEach((type) => {
      expect(isValidPrimaryApplicationType(type as string)).toBe(false)
    })
  })
})
