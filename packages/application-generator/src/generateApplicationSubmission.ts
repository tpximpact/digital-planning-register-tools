import type { SupportedPrimaryApplicationTypes } from './generatePostSubmissionPublishedApplication'
import type {
  LawfulDevelopmentCertificateProposed,
  PriorApprovalPart1ClassA,
  PlanningPermissionFullHouseholder
} from 'digital-planning-data-schemas/types/schemas/prototypeApplication/index.ts'

import planningPermissionFullHouseholderPrototype from 'digital-planning-data-schemas/examples/prototypeApplication/planningPermission/fullHouseholder.json'
import priorApprovalLargerExtensionPrototype from 'digital-planning-data-schemas/examples/prototypeApplication/priorApproval/largerExtension.json'
import lawfulDevelopmentCertificateProposedPrototype from 'digital-planning-data-schemas/examples/prototypeApplication/lawfulDevelopmentCertificate/proposed.json'
import { fakerEN_GB as faker } from '@faker-js/faker'
import {
  generateAllPossibleDates,
  type PossibleDates
} from './libs/generateAllPossibleDates'

export const generateApplicationSubmission = (
  primaryApplicationType: SupportedPrimaryApplicationTypes,
  dates?: PossibleDates
) => {
  const generatedApplicationTypes = [
    {
      key: 'pp.full.householder',
      value:
        planningPermissionFullHouseholderPrototype as PlanningPermissionFullHouseholder
    },
    {
      key: 'pa.part1.classA',
      value: priorApprovalLargerExtensionPrototype as PriorApprovalPart1ClassA
    },
    {
      key: 'ldc.proposed',
      value:
        lawfulDevelopmentCertificateProposedPrototype as LawfulDevelopmentCertificateProposed
    }
  ]

  if (!dates) {
    dates = generateAllPossibleDates(false)
  }

  let application
  if (!primaryApplicationType) {
    application = faker.helpers.arrayElement(generatedApplicationTypes)?.value
  } else {
    application = generatedApplicationTypes.find(
      (type) => type.key.includes(primaryApplicationType) === true
    )?.value
  }

  if (!application) {
    throw new Error('Unable to generate application')
  }

  application = {
    ...application,
    data: {
      ...application.data,
      proposal: {
        ...application.data.proposal,
        description: faker.lorem.paragraphs({ min: 1, max: 10 })
      }
    },
    metadata: {
      ...application.metadata,
      submittedAt: dates.submission.submittedAt.toISOString()
    }
  }

  return application
}
