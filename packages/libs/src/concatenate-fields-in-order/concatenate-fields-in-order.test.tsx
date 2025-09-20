import { describe, it, expect } from 'bun:test'
import { concatenateFieldsInOrder } from './concatenate-fields-in-order'

describe('concatenateFieldsInOrder', () => {
  it('should concatenate specified fields in order', () => {
    const obj = {
      line1: '123 Main St',
      line2: 'Apt 4B',
      town: 'Springfield',
      county: 'Some County',
      postcode: '12345',
      country: 'USA'
    }
    const fields = ['line1', 'line2', 'town', 'county', 'postcode', 'country']
    const result = concatenateFieldsInOrder(obj, fields)
    expect(result).toBe(
      '123 Main St, Apt 4B, Springfield, Some County, 12345, USA'
    )
  })

  it('should skip fields that are not present in the object', () => {
    const obj = {
      line1: '123 Main St',
      town: 'Springfield',
      postcode: '12345'
    }
    const fields = ['line1', 'line2', 'town', 'county', 'postcode', 'country']
    const result = concatenateFieldsInOrder(obj, fields)
    expect(result).toBe('123 Main St, Springfield, 12345')
  })

  it('should skip fields that have falsy values', () => {
    const obj = {
      line1: '123 Main St',
      line2: '',
      town: 'Springfield',
      county: null,
      postcode: '12345',
      country: undefined
    }
    const fields = ['line1', 'line2', 'town', 'county', 'postcode', 'country']
    const result = concatenateFieldsInOrder(obj, fields)
    expect(result).toBe('123 Main St, Springfield, 12345')
  })

  it('should return an empty string if no fields are present in the object', () => {
    const obj = {}
    const fields = ['line1', 'line2', 'town', 'county', 'postcode', 'country']
    const result = concatenateFieldsInOrder(obj, fields)
    expect(result).toBe('')
  })

  it('should return an empty string if fields array is empty', () => {
    const obj = {
      line1: '123 Main St',
      town: 'Springfield',
      postcode: '12345'
    }
    const fields: string[] = []
    const result = concatenateFieldsInOrder(obj, fields)
    expect(result).toBe('')
  })

  it('should use the defined separator', () => {
    const obj = {
      first: 'John',
      last: 'Smith'
    }
    const fields = ['first', 'last']
    const result = concatenateFieldsInOrder(obj, fields, 'HELLO')
    expect(result).toBe('JohnHELLOSmith')
  })
})
