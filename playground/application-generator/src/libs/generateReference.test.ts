import { describe, expect, it } from 'bun:test'
import { generateReference } from './generateReference'

describe('generateReference', () => {
  it('should generate a reference string in the correct format', () => {
    const reference = generateReference()
    const regex = /^\d{2}-\d{5}-[A-Z]{4}$/
    expect(reference).toMatch(regex)
  })

  it('should generate different reference strings on subsequent calls', () => {
    const reference1 = generateReference()
    const reference2 = generateReference()
    expect(reference1).not.toBe(reference2)
  })

  it('should generate a reference string with the correct parts', () => {
    const reference = generateReference()
    const parts = reference.split('-')
    expect(parts.length).toBe(3)
    expect(parts[0]).toHaveLength(2)
    expect(parts[1]).toHaveLength(5)
    expect(parts[2]).toHaveLength(4)
  })
})
