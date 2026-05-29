import { describe, it, expect } from 'bun:test'
import { generateBaseApplicant } from './BaseApplicant'
import { assertSchema, BaseApplicantChecker } from '@dpr/test-libs'

describe('generateBaseApplicant', () => {
  it('returns an valid BaseApplicant', () => {
    const obj = generateBaseApplicant()
    expect(obj).toBeDefined()
    assertSchema(BaseApplicantChecker, obj)
  })
})
