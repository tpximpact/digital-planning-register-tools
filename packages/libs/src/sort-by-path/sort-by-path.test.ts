import { describe, it, expect } from 'bun:test'
import { sortByPath } from './sort-by-path'

describe('sortByPath', () => {
  it('sorts by top-level string property ascending', () => {
    const arr = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
    const sorted = sortByPath(arr, 'name', 'asc')
    expect(sorted.map((x) => x.name)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('sorts by top-level string property descending', () => {
    const arr = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
    const sorted = sortByPath(arr, 'name', 'desc')
    expect(sorted.map((x) => x.name)).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('sorts by nested string property ascending', () => {
    const arr = [
      { user: { name: 'Charlie' } },
      { user: { name: 'Alice' } },
      { user: { name: 'Bob' } }
    ]
    const sorted = sortByPath(arr, 'user.name', 'asc')
    expect(sorted.map((x) => x.user.name)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('sorts by nested number property descending', () => {
    const arr = [
      { stats: { score: 10 } },
      { stats: { score: 30 } },
      { stats: { score: 20 } }
    ]
    const sorted = sortByPath(arr, 'stats.score', 'desc')
    expect(sorted.map((x) => x.stats.score)).toEqual([30, 20, 10])
  })

  it('handles missing property values', () => {
    const arr = [{ name: 'Charlie' }, {}, { name: 'Alice' }]
    const sorted = sortByPath(arr, 'name', 'asc')
    expect(sorted.map((x) => x.name)).toEqual(['Alice', 'Charlie', undefined])
  })

  it('returns original order if values are equal', () => {
    const arr = [{ name: 'A' }, { name: 'A' }]
    const sorted = sortByPath(arr, 'name', 'asc')
    expect(sorted).toEqual(arr)
  })
})
