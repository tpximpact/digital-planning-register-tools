import type * as PostSubmissionPublishedTypes from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.d.ts'
import type {
  ApplicationType,
  PrimaryApplicationType
} from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.d.ts'
import type { ProcessStage } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/ProcessStage.d.ts'
import type { ApplicationStatus } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/ApplicationStatus.d.ts'
import type { PostSubmissionPublishedApplication } from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.d.ts'
import type { AppealDecision } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/AppealDecision.d.ts'
import type { PriorApprovalAssessment } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/Assessment.d.ts'
import { fakerEN_GB as faker } from '@faker-js/faker'
import { generateAllPossibleDates } from './libs/generateAllPossibleDates'
import { setCorrectApplicationType } from './libs/setCorrectApplicationType'
import { generateReference } from './libs/generateReference'
import { generateMetadata } from './libs/generateMetadata'
import { getApplicationStatesByStage } from './libs/getApplicationStatesByStage'
import { getApplicationStagesByType } from './libs/getApplicationStagesByType'
import { getPrimaryApplicationTypeKey } from './libs/getPrimaryApplicationTypeKey'
import { validApplicationTypes } from './libs/validApplicationTypes'
import { generateApplicationSubmission } from './generateApplicationSubmission'
import { generatePublicCommentsRedacted } from './generators/PublicComments'
import { generatePostSubmissionFiles } from './generators/PostSubmissionFile'
import { generateSpecialistCommentsRedacted } from './generators/SpecialistComments'

export const applicationTypesWithNoConsultation = ['ldc']
const applicationTypesWithCommentsAcceptedUntilDecision = ['ldc']

export type SupportedPrimaryApplicationTypes = 'pp' | 'pa' | 'ldc'
export const supportedPrimaryApplicationTypes: SupportedPrimaryApplicationTypes[] =
  ['pp', 'pa', 'ldc']

export interface GeneratePostSubmissionPublishedApplicationProps {
  applicationType?: ApplicationType
  applicationStage?: ProcessStage
  applicationStatus?: ApplicationStatus
  customStatus?:
    | 'consultationInProgress'
    | 'assessmentInProgress'
    | 'assessmentCouncilDetermined'
    | 'assessmentInCommittee'
    | 'assessmentCommitteeDetermined'
    | 'appealLodged'
    | 'appealValidated'
    | 'appealStarted'
    | 'appealDetermined'
    | 'appealDeterminedWithdrawn'
    | 'appealDeterminedAllowed'
    | 'appealDeterminedDismissed'
    | 'appealDeterminedSplitDecision'
    | 'withdrawn'
}

export const generatePostSubmissionPublishedApplication = ({
  applicationType,
  applicationStage,
  applicationStatus,
  customStatus
}: GeneratePostSubmissionPublishedApplicationProps = {}): PostSubmissionPublishedApplication => {
  switch (customStatus) {
    case 'consultationInProgress':
      applicationStage = 'consultation'
      applicationStatus = 'undetermined'
      break
    case 'assessmentInProgress':
    case 'assessmentInCommittee':
      applicationStage = 'assessment'
      applicationStatus = 'undetermined'
      break
    case 'assessmentCouncilDetermined':
    case 'assessmentCommitteeDetermined':
      applicationStage = 'assessment'
      applicationStatus = 'determined'
      break
    case 'appealLodged':
    case 'appealValidated':
    case 'appealStarted':
    case 'appealDetermined':
    case 'appealDeterminedWithdrawn':
    case 'appealDeterminedAllowed':
    case 'appealDeterminedDismissed':
    case 'appealDeterminedSplitDecision':
      applicationStage = 'appeal'
      applicationStatus = 'determined'
      break
    case 'withdrawn':
      applicationStage = 'assessment'
      applicationStatus = 'withdrawn'
      break
  }

  let appealDecision = faker.helpers.arrayElement<AppealDecision>([
    'allowed',
    'dismissed',
    'splitDecision',
    'withdrawn'
  ])
  switch (customStatus) {
    case 'appealDeterminedWithdrawn':
      appealDecision = 'withdrawn'
      break
    case 'appealDeterminedAllowed':
      appealDecision = 'allowed'
      break
    case 'appealDeterminedDismissed':
      appealDecision = 'dismissed'
      break
    case 'appealDeterminedSplitDecision':
      appealDecision = 'splitDecision'
      break
  }

  const dates = generateAllPossibleDates(
    applicationStage === 'consultation' && applicationStatus === 'undetermined'
  )

  if (!applicationType) {
    const applicationTypes = Object.values(validApplicationTypes).flat()
    applicationType = faker.helpers.arrayElement(applicationTypes)
  }
  const primaryApplicationType = getPrimaryApplicationTypeKey(
    applicationType
  ) as PrimaryApplicationType
  if (!primaryApplicationType) {
    throw new Error(
      `Unable to find primary application type fo ${applicationType}`
    )
  }

  const applicationStages = getApplicationStagesByType(applicationType)

  if (!applicationStage) {
    applicationStage = faker.helpers.arrayElement(applicationStages)
  } else {
    if (!applicationStages.includes(applicationStage)) {
      throw new Error(
        `Invalid application stage for application type ${applicationType}`
      )
    }
  }

  const applicationStates = getApplicationStatesByStage(applicationStage)

  if (!applicationStatus) {
    applicationStatus = faker.helpers.arrayElement(applicationStates)
  } else {
    if (!applicationStates.includes(applicationStatus)) {
      throw new Error(
        `Invalid application status for application type ${applicationType} in stage ${applicationStage}`
      )
    }
  }

  const metadata = generateMetadata(dates)

  // there is no such thing as a 'valid' stage in this schema
  if (applicationStage === 'validation' && applicationStatus !== 'returned') {
    throw new Error(
      `Invalid application stage (${applicationStage}) and status (${applicationStatus}) - validated applications go straight to consultation or assessment`
    )
  }

  // certain application types don't have consultation stage
  if (
    applicationStage === 'consultation' &&
    applicationTypesWithNoConsultation.includes(primaryApplicationType)
  ) {
    throw new Error(
      `Invalid application stage (${applicationStage}) for application type ${primaryApplicationType} - this application type does not have a consultation stage`
    )
  }

  // applicationType musst be XApplicationType not ApplicationType for the data object to behave

  // create the basics of all stages and manage further below
  const applicationData = {
    applicationType: applicationType,
    data: {
      application: {
        reference: generateReference(),
        stage: applicationStage,
        status: applicationStatus,
        publishedAt: dates.publishedAt.toISOString()
        // see below for withdrawnAt and withdrawnReason being added
      },
      localPlanningAuthority: {
        publicCommentsAcceptedUntilDecision: false
      },
      submission: {
        submittedAt: dates.submission.submittedAt.toISOString()
      },
      validation: {
        receivedAt: dates.validation.receivedAt.toISOString(),
        validatedAt: dates.validation.validatedAt.toISOString(),
        isValid: true
      },
      consultation: {
        startDate: dates.consultation.startAt.format('YYYY-MM-DD'),
        endDate: dates.consultation.endAt.format('YYYY-MM-DD'),
        siteNotice: true
      },
      assessment: {
        expiryDate: dates.assessment.expiryAt.format('YYYY-MM-DD'),
        planningOfficerDecision: faker.helpers.arrayElement([
          'granted',
          'refused'
        ]),
        planningOfficerDecisionDate:
          dates.assessment.planningOfficerDecisionAt.format('YYYY-MM-DD'),
        decisionNotice: {
          url: 'https://planningregister.org'
        }
      },
      appeal: {
        lodgedDate: dates.appeal.lodgedAt.format('YYYY-MM-DD'),
        reason:
          "We don't believe the council took into consideration the environmental impact alleviation approach during their assessment.",
        validatedDate: dates.appeal.validatedAt.format('YYYY-MM-DD'),
        startedDate: dates.appeal.startedAt.format('YYYY-MM-DD'),
        decisionDate: dates.appeal.decidedAt.format('YYYY-MM-DD'),
        decision: appealDecision
      },
      caseOfficer: {
        name: 'Casey Officer'
      }
    },
    comments: {
      public: generatePublicCommentsRedacted(dates),
      specialist: generateSpecialistCommentsRedacted(dates)
    },
    files: generatePostSubmissionFiles('application', dates),
    submission: generateApplicationSubmission(primaryApplicationType, dates),
    metadata: metadata
  }

  let data = setCorrectApplicationType(
    applicationType,
    applicationData as PostSubmissionPublishedTypes.PostSubmissionPublishedApplication
  )

  // This mocks camden allowing comments until a decision is made for certain application types
  if (
    applicationTypesWithCommentsAcceptedUntilDecision.includes(
      primaryApplicationType
    )
  ) {
    data.data.localPlanningAuthority.publicCommentsAcceptedUntilDecision = true
  }

  // manage priorApprovalRequired field for prior approvals
  if (primaryApplicationType === 'pa') {
    // 'Prior approval required and approved', 'Prior approval not required', 'Prior approval required and refused'
    data.data.assessment = {
      ...data.data.assessment,
      priorApprovalRequired: faker.datatype.boolean()
    } as PriorApprovalAssessment
  }

  // manage the data added at each stage and the states within them
  if (applicationStage === 'submission') {
    const { comments, ...theRest } = data
    data = theRest
    const { validation, consultation, assessment, appeal, ...rest } = data.data
    data.data = rest
  }
  if (applicationStage === 'validation') {
    const { comments, ...theRest } = data
    data = theRest
    const { consultation, assessment, appeal, ...rest } = data.data
    data.data = rest

    if (applicationStatus === 'returned' && data.data.validation) {
      data.data.validation.isValid = false
    }
  }
  if (applicationStage === 'consultation') {
    const { assessment, appeal, ...rest } = data.data
    data.data = rest
  }
  if (applicationStage === 'assessment') {
    const { appeal, ...rest } = data.data
    data.data = rest

    if (
      applicationStatus === 'undetermined' ||
      applicationStatus === 'withdrawn'
    ) {
      const { assessment, ...rest } = data.data
      data.data = {
        ...rest,
        assessment: {
          expiryDate: dates.assessment.expiryAt.format('YYYY-MM-DD')
        }
      }
    }
  }

  // make sure theres no consultation or comments section for those that don't have it
  if (applicationTypesWithNoConsultation.includes(primaryApplicationType)) {
    const { comments, ...theRest } = data
    data = theRest
    const { consultation, ...rest } = data.data
    data.data = rest
  }

  // manage the withdrawn state

  if (applicationStatus === 'withdrawn') {
    data.data.application = {
      ...data.data.application,
      withdrawnAt: dates.application.withdrawnAt.toISOString(),
      withdrawnReason: 'Applicant has decided to withdraw the application.'
    }
  }

  // manage specific names we give our examples

  // only get in committee if we request it using customStatus
  if (customStatus === 'assessmentInCommittee') {
    data.data.assessment = {
      expiryDate: dates.assessment.expiryAt.format('YYYY-MM-DD'),
      planningOfficerRecommendation: faker.helpers.arrayElement([
        'granted',
        'refused'
      ]),
      committeeSentDate: dates.assessment.committeeSentAt.format('YYYY-MM-DD')
    }
  }

  // only get in committee determined if we request it using customStatus
  if (customStatus === 'assessmentCommitteeDetermined') {
    data.data.assessment = {
      expiryDate: dates.assessment.expiryAt.format('YYYY-MM-DD'),
      planningOfficerRecommendation: faker.helpers.arrayElement([
        'granted',
        'refused'
      ]),
      committeeSentDate: dates.assessment.committeeSentAt.format('YYYY-MM-DD'),
      committeeDecision: faker.helpers.arrayElement(['granted', 'refused']),
      committeeDecisionDate:
        dates.assessment.committeeDecisionAt.format('YYYY-MM-DD'),
      decisionNotice: {
        url: 'https://planningregister.org'
      }
    }
  }

  // only get appealLodged if we request it using dprStatus
  if (customStatus === 'appealLodged') {
    data.data.appeal = {
      lodgedDate: dates.appeal.lodgedAt.format('YYYY-MM-DD'),
      reason:
        "We don't believe the council took into consideration the environmental impact alleviation approach during their assessment."
    }
  }

  // only get appealValidated if we request it using customStatus

  if (customStatus === 'appealValidated') {
    data.data.appeal = {
      lodgedDate: dates.appeal.lodgedAt.format('YYYY-MM-DD'),
      reason:
        "We don't believe the council took into consideration the environmental impact alleviation approach during their assessment.",
      validatedDate: dates.appeal.validatedAt.format('YYYY-MM-DD')
    }
  }

  // only get appealStarted if we request it using customStatus

  if (customStatus === 'appealStarted') {
    data.data.appeal = {
      lodgedDate: dates.appeal.lodgedAt.format('YYYY-MM-DD'),
      reason:
        "We don't believe the council took into consideration the environmental impact alleviation approach during their assessment.",
      validatedDate: dates.appeal.validatedAt.format('YYYY-MM-DD'),
      startedDate: dates.appeal.startedAt.format('YYYY-MM-DD')
    }
  }

  // only get appealWithdrawn if we request it using customStatus

  if (
    customStatus &&
    [
      'appealDetermined',
      'appealDeterminedWithdrawn',
      'appealDeterminedAllowed',
      'appealDeterminedDismissed',
      'appealDeterminedSplitDecision'
    ].includes(customStatus)
  ) {
    data.data.appeal = {
      lodgedDate: dates.appeal.lodgedAt.format('YYYY-MM-DD'),
      validatedDate: dates.appeal.validatedAt.format('YYYY-MM-DD'),
      startedDate: dates.appeal.startedAt.format('YYYY-MM-DD'),
      reason:
        "We don't believe the council took into consideration the environmental impact alleviation approach during their assessment.",
      decisionDate: dates.appeal.decidedAt.format('YYYY-MM-DD'),
      decision: appealDecision
    }
  }

  return data
}
