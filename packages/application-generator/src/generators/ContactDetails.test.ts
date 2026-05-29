import { describe, it, expect } from 'bun:test'
import { generateContactDetails } from './ContactDetails'
import { assertSchema, ContactDetailsChecker } from '@dpr/test-libs'

describe('generateContactDetails', () => {
  it('returns an valid ContactDetails', () => {
    const obj = generateContactDetails()
    expect(obj).toBeDefined()
    assertSchema(ContactDetailsChecker, obj)
  })
})
