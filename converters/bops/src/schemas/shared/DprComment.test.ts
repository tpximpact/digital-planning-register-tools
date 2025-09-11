import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { DprComment } from './DprComment'

describe('DprComment TypeBox schema', () => {
  const valid = {
    id: 1,
    comment: 'This is a comment',
    receivedDate: '2025-07-03T14:23:53Z',
    sentiment: 'positive'
  }
  it('validates a correct object', () => {
    expect(Value.Check(DprComment, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {
      id: 1,
      // missing comment
      receivedDate: '2025-07-03T14:23:53Z',
      sentiment: 'positive'
    }
    expect(Value.Check(DprComment, invalid)).toBe(false)
  })
})
