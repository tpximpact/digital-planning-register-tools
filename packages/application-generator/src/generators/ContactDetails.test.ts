import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { ContactDetailsSchema } from '@dpr/odp-schemas/types/shared/Contacts.ts'
import { generateContactDetails } from './ContactDetails'

describe('generateContactDetails', () => {
  it('returns an valid ContactDetails', () => {
    const obj = generateContactDetails()
    expect(obj).toBeDefined()
    expect(Value.Check(ContactDetailsSchema, obj)).toBe(true)
  })
})
