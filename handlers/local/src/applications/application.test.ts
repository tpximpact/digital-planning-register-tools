import { describe, it, expect } from 'bun:test'
import { getApplication, getPublishedApplication } from './application'
import { Value } from '@sinclair/typebox/value'
import { PostSubmissionApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/index.ts'
// import { debugSchema } from '@dpr/libs'
import { PostSubmissionPublishedApplication } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'

import ppSubmissionJson from '../data/PostSubmissionApplication/PlanningPermissionFullHouseholder/PlanningPermissionFullHouseholder-01-submission.json'
import ppPublishedSubmissionJson from '../data/PostSubmissionPublishedApplication/PlanningPermissionFullHouseholder/PlanningPermissionFullHouseholder-01-submission.json'
import ppPublishedInvalidJson from '../data/PostSubmissionPublishedApplication/PlanningPermissionFullHouseholder/PlanningPermissionFullHouseholder-02-validation-01-invalid.json'
import ppPublishedConsultationJson from '../data/PostSubmissionPublishedApplication/PlanningPermissionFullHouseholder/PlanningPermissionFullHouseholder-03-consultation.json'

describe('getApplication', () => {
  it('returns an application for a valid id', () => {
    // This test will only pass if fetchAllData returns an application with reference '55-77792-OWRT'
    // Otherwise, it will throw. This is a demonstration for real data environments.
    const app = getApplication(ppSubmissionJson.data.application.reference)
    expect(app.data.application.reference).toBe(
      ppSubmissionJson.data.application.reference
    )

    expect(Value.Check(PostSubmissionApplication, app)).toBe(true)
  })
})

describe('getPublishedApplication', () => {
  const invalidIds = [
    ppPublishedSubmissionJson.data.application.reference,
    ppPublishedInvalidJson.data.application.reference
  ]

  invalidIds.forEach((id) => {
    it(`throws 'Application not found' for invalid id ${id}`, () => {
      expect(() => getPublishedApplication(id)).toThrow('Application not found')
    })
  })

  it('returns an application for a valid id', () => {
    // This test will only pass if fetchAllData returns an application with reference '55-77792-OWRT'
    // Otherwise, it will throw. This is a demonstration for real data environments.
    const app = getPublishedApplication(
      ppPublishedConsultationJson.data.application.reference
    )
    console.log(app)
    expect(app.data.application.reference).toBe(
      ppPublishedConsultationJson.data.application.reference
    )

    // debugSchema(PostSubmissionPublishedApplication, app)
    expect(Value.Check(PostSubmissionPublishedApplication, app)).toBe(true)
  })
})
