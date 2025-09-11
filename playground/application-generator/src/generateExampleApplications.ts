import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.js'
import {
  applicationTypesWithNoConsultation,
  generateDprApplication
} from './generateDprApplication'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'
import { getPrimaryApplicationTypeKey } from './libs/getPrimaryApplicationTypeKey'

/**
 * Set of examples of standard applications using the  generateDprApplication method
 * @returns
 */
export const generateExampleApplications = (
  applicationType: ApplicationType = 'pp.full.householder'
): Record<string, PostSubmissionPublishedApplication | undefined> => {
  const primaryApplicationTypeKey =
    getPrimaryApplicationTypeKey(applicationType)

  // 01-submission
  const submission = generateDprApplication({
    applicationType: applicationType,
    applicationStage: 'submission'
  })

  // 02-validation-01-invalid
  const returned = generateDprApplication({
    applicationType: applicationType,
    applicationStage: 'validation',
    applicationStatus: 'returned'
  })

  // 03-consultation
  let consultation: PostSubmissionPublishedApplication | undefined = undefined
  if (
    primaryApplicationTypeKey &&
    !applicationTypesWithNoConsultation.includes(primaryApplicationTypeKey)
  ) {
    consultation = generateDprApplication({
      applicationType: applicationType,
      customStatus: 'consultationInProgress'
    })
  }

  // 04-assessment-00-assessment-in-progress
  const assessmentInProgress = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'assessmentInProgress'
  })

  // 04-assessment-01-council-determined
  const planningOfficerDetermined = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'assessmentCouncilDetermined'
  })

  // 04-assessment-02-assessment-in-committee
  const assessmentInCommittee = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'assessmentInCommittee'
  })

  // 04-assessment-03-committee-determined
  const committeeDetermined = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'assessmentCommitteeDetermined'
  })

  // 05-appeal-00-appeal-lodged
  const appealLodged = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealLodged'
  })

  // 05-appeal-01-appeal-validated
  const appealValid = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealValidated'
  })

  // 05-appeal-02-appeal-started
  const appealStarted = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealStarted'
  })

  // 05-appeal-03-appeal-determined
  const appealDetermined = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealDetermined'
  })
  const appealDeterminedWithdrawn = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealDeterminedWithdrawn'
  })
  const appealDeterminedAllowed = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealDeterminedAllowed'
  })
  const appealDeterminedDismissed = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealDeterminedDismissed'
  })
  const appealDeterminedSplitDecision = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'appealDeterminedSplitDecision'
  })

  // 06-assessment-withdrawn
  const withdrawn = generateDprApplication({
    applicationType: applicationType,
    customStatus: 'withdrawn'
  })

  return {
    submission,
    returned,
    consultation,
    assessmentInProgress,
    planningOfficerDetermined,
    assessmentInCommittee,
    committeeDetermined,
    appealLodged,
    appealValid,
    appealStarted,
    appealDetermined,
    appealDeterminedWithdrawn,
    appealDeterminedAllowed,
    appealDeterminedDismissed,
    appealDeterminedSplitDecision,
    withdrawn
    // closed,
  }
}
