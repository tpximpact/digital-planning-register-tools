import { describe, it, expect } from 'bun:test'
import { paginateArray } from './paginate-array'

describe('paginateArray', () => {
  it('returns correct pagination for normal input', () => {
    const data = Array.from({ length: 25 }, (_, i) => i + 1)
    const { data: pageData, pagination } = paginateArray(data, 2, 10)
    expect(pageData).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(pagination).toMatchObject({
      resultsPerPage: 10,
      currentPage: 2,
      totalPages: 3,
      totalResults: 25,
      totalAvailableItems: 25
    })
  })

  it('returns all items if resultsPerPage is greater than data length', () => {
    const data = [1, 2, 3]
    const { data: pageData, pagination } = paginateArray(data, 1, 10)
    expect(pageData).toEqual([1, 2, 3])
    expect(pagination.totalPages).toBe(1)
  })

  it('returns empty array and correct pagination if data is empty', () => {
    const { data: pageData, pagination } = paginateArray([], 1, 10)
    expect(pageData).toEqual([])
    expect(pagination).toMatchObject({
      resultsPerPage: 10,
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      totalAvailableItems: 0
    })
  })

  it('clamps resultsPerPage to minimum of 1', () => {
    const data = [1, 2, 3]
    const { data: pageData, pagination } = paginateArray(data, 1, 0)
    expect(pageData).toEqual([1])
    expect(pagination.resultsPerPage).toBe(1)
  })

  it('clamps resultsPerPage to maximum of 50', () => {
    const data = Array.from({ length: 1500 }, (_, i) => i + 1)
    const { data: pageData, pagination } = paginateArray(data, 1, 2000)
    expect(pageData.length).toBe(50)
    expect(pagination.resultsPerPage).toBe(50)
  })

  it('returns last page if page number is greater than totalPages', () => {
    const data = Array.from({ length: 30 }, (_, i) => i + 1)
    const { data: pageData, pagination } = paginateArray(data, 10, 10)
    expect(pageData).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
    expect(pagination.currentPage).toBe(3)
  })

  it('defaults to page 1 if page is invalid', () => {
    const data = [1, 2, 3]
    const { data: pageData, pagination } = paginateArray(data, -5, 2)
    expect(pageData).toEqual([1, 2])
    expect(pagination.currentPage).toBe(1)
  })

  it('throws if data is not an array', () => {
    // @ts-expect-error data must be an array
    expect(() => paginateArray(null, 1, 10)).toThrow('data must be an array')
    // @ts-expect-error data must be an array
    expect(() => paginateArray({}, 1, 10)).toThrow('data must be an array')
  })

  it('defaults resultsPerPage to 10 if not a number', () => {
    const data = Array.from({ length: 15 }, (_, i) => i + 1)
    // @ts-expect-error resultsPerPage must be a number
    const { data: pageData, pagination } = paginateArray(data, 1, 'foo')
    expect(pageData.length).toBe(10)
    expect(pagination.resultsPerPage).toBe(10)
  })
})
