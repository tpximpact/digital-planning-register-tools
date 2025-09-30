import { describe, it, expect } from 'bun:test'
import { getUnknownValue } from './get-unknown-value'

describe('getUnknownValue', () => {
  const testObj = {
    a: {
      b: {
        c: 42,
        d: 'hello'
      },
      arr: [1, 2, 3]
    },
    x: 'top'
  }

  it('returns value for top-level key', () => {
    expect(getUnknownValue<string>(testObj, ['x'])).toEqual('top')
  })

  it('returns value for deeply nested key', () => {
    expect(getUnknownValue<number>(testObj, ['a', 'b', 'c'])).toEqual(42)
    expect(getUnknownValue<string>(testObj, ['a', 'b', 'd'])).toEqual('hello')
  })

  it('returns value for array index', () => {
    expect(getUnknownValue<number>(testObj, ['a', 'arr', 1])).toEqual(2)
    expect(getUnknownValue<number>(testObj, ['a', 'arr', 0])).toEqual(1)
  })

  it('returns undefined for invalid path', () => {
    expect(getUnknownValue(testObj, ['a', 'missing'])).toBeUndefined()
    expect(getUnknownValue(testObj, ['not', 'found'])).toBeUndefined()
    expect(getUnknownValue(testObj, ['a', 'arr', 10])).toBeUndefined()
  })

  it('returns undefined for null or non-object', () => {
    expect(getUnknownValue(null, ['a'])).toBeUndefined()
    expect(getUnknownValue('string', ['a'])).toBeUndefined()
    expect(getUnknownValue(123, ['a'])).toBeUndefined()
  })
})
