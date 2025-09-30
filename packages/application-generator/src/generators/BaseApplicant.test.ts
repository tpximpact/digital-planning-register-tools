import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BaseApplicant } from '@dpr/odp-schemas/types/schemas/prototypeApplication/data/Applicant.ts'
import { generateBaseApplicant } from './BaseApplicant'

describe('generateBaseApplicant', () => {
  it('returns an valid BaseApplicant', () => {
    const obj = generateBaseApplicant()
    expect(obj).toBeDefined()
    expect(Value.Check(BaseApplicant, obj)).toBe(true)
  })
})
