import { describe, it, expect } from 'bun:test'
import { normaliseClientForEnv } from './normaliseClientForEnv'

describe('normaliseClientForEnv', () => {
  it('should convert a single word to uppercase', () => {
    expect(normaliseClientForEnv('camden')).toBe('CAMDEN')
  })

  it('should convert a hyphenated string to uppercase and underscores', () => {
    expect(normaliseClientForEnv('camden-council')).toBe('CAMDEN_COUNCIL')
  })

  it('should handle already uppercase strings', () => {
    expect(normaliseClientForEnv('SOUTHWARK')).toBe('SOUTHWARK')
  })
})
