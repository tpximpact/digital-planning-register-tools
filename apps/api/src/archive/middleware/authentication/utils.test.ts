import { describe, it, expect } from 'bun:test'
import { strSafeEqual } from './utils'

describe('strSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(strSafeEqual('hello', 'hello')).toBe(true)
  })

  it('returns false for different strings', () => {
    expect(strSafeEqual('hello', 'world')).toBe(false)
  })

  it('returns true for identical strings with different encodings', () => {
    expect(strSafeEqual('héllo', 'héllo', 'utf-8')).toBe(true)
  })

  it('returns false for strings of different lengths', () => {
    expect(strSafeEqual('hello', 'hello!')).toBe(false)
  })

  it('returns true for empty strings', () => {
    expect(strSafeEqual('', '')).toBe(true)
  })

  it('returns false if only one string is empty', () => {
    expect(strSafeEqual('', 'notempty')).toBe(false)
    expect(strSafeEqual('notempty', '')).toBe(false)
  })
})
