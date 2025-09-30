import { describe, it, expect } from 'bun:test'
import { generateResponses } from './Responses'

describe('generateResponses', () => {
  it('returns an valid Responses[]', () => {
    const obj = generateResponses()
    expect(obj).toBeDefined()
  })
})
