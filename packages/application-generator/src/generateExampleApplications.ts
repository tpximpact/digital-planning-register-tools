import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.d.ts'
import {
  applicationTypesWithNoConsultation,
  generatePostSubmissionPublishedApplication
} from './generatePostSubmissionPublishedApplication'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.d.ts'
import { getPrimaryApplicationTypeKey } from './libs/getPrimaryApplicationTypeKey'
import { generatePostSubmissionApplication } from './generatePostSubmissionApplication'

/**
 * Set of examples of standard applications using the  generatePostSubmissionPublishedApplication method
 * @returns
 */
export const generateExampleApplications = (
  applicationType: ApplicationType = 'pp.full.householder',
  published = true
): Record<string, PostSubmissionPublishedApplication | undefined> => {
  const primaryApplicationTypeKey =
    getPrimaryApplicationTypeKey(applicationType)

  const generator = published
    ? generatePostSubmissionPublishedApplication
    : generatePostSubmissionApplication

  // 01-submission
  const submission = generator({
    applicationType: applicationType,
    applicationStage: 'submission'
  })

  // 02-validation-01-invalid
  const returned = generator({
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
    consultation = generator({
      applicationType: applicationType,
      customStatus: 'consultationInProgress'
    })
  }

  // 04-assessment-00-assessment-in-progress
  const assessmentInProgress = generator({
    applicationType: applicationType,
    customStatus: 'assessmentInProgress'
  })

  // 04-assessment-01-council-determined
  const planningOfficerDetermined = generator({
    applicationType: applicationType,
    customStatus: 'assessmentCouncilDetermined'
  })

  // 04-assessment-02-assessment-in-committee
  const assessmentInCommittee = generator({
    applicationType: applicationType,
    customStatus: 'assessmentInCommittee'
  })

  // 04-assessment-03-committee-determined
  const committeeDetermined = generator({
    applicationType: applicationType,
    customStatus: 'assessmentCommitteeDetermined'
  })

  // 05-appeal-00-appeal-lodged
  const appealLodged = generator({
    applicationType: applicationType,
    customStatus: 'appealLodged'
  })

  // 05-appeal-01-appeal-validated
  const appealValid = generator({
    applicationType: applicationType,
    customStatus: 'appealValidated'
  })

  // 05-appeal-02-appeal-started
  const appealStarted = generator({
    applicationType: applicationType,
    customStatus: 'appealStarted'
  })

  // 05-appeal-03-appeal-determined
  const appealDetermined = generator({
    applicationType: applicationType,
    customStatus: 'appealDetermined'
  })
  const appealDeterminedWithdrawn = generator({
    applicationType: applicationType,
    customStatus: 'appealDeterminedWithdrawn'
  })
  const appealDeterminedAllowed = generator({
    applicationType: applicationType,
    customStatus: 'appealDeterminedAllowed'
  })
  const appealDeterminedDismissed = generator({
    applicationType: applicationType,
    customStatus: 'appealDeterminedDismissed'
  })
  const appealDeterminedSplitDecision = generator({
    applicationType: applicationType,
    customStatus: 'appealDeterminedSplitDecision'
  })

  // 06-assessment-withdrawn
  const withdrawn = generator({
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
