import { describe, it, expect } from 'bun:test'
import { getValueByPath } from '.'

describe('getValueByPath', () => {
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
    expect(getValueByPath(testObj, 'x')).toEqual('top')
  })

  it('returns value for deeply nested key', () => {
    expect(getValueByPath(testObj, 'a.b.c')).toEqual(42)
    expect(getValueByPath(testObj, 'a.b.d')).toEqual('hello')
  })

  it('returns value for array index', () => {
    expect(getValueByPath(testObj, 'a.arr.1')).toEqual(2)
    expect(getValueByPath(testObj, 'a.arr.0')).toEqual(1)
  })

  it('returns undefined for invalid path', () => {
    expect(getValueByPath(testObj, 'a.missing')).toBeUndefined()
    expect(getValueByPath(testObj, 'not.found')).toBeUndefined()
    expect(getValueByPath(testObj, 'a.arr.10')).toBeUndefined()
  })

  it('returns undefined for null or non-object', () => {
    expect(getValueByPath(null, 'a')).toBeUndefined()
    expect(getValueByPath('string', 'a')).toBeUndefined()
    expect(getValueByPath(123, 'a')).toBeUndefined()
  })
})
