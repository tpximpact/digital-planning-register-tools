import { describe, expect, it } from 'bun:test'
import { generateExampleApplications } from './generateExampleApplications'
import { generatePostSubmissionPublishedApplication } from './generatePostSubmissionPublishedApplication'
import type {
  PostSubmissionAssessment,
  PriorApprovalAssessment
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/Assessment.d.ts'

/**
 * Check the consultation dates are valid Dates
 * Check the consultation start date is before the end date
 * @param startDate string
 * @param endDate string
 */
export const checkConsultationDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  expect(start).toBeInstanceOf(Date)
  expect(end).toBeInstanceOf(Date)
  expect(start < end).toBe(true)
}

/**
 * Check the consultation is in progress
 * @param startDate string
 * @param endDate string
 */
export const checkConsultationInProgress = (
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()
  expect(now >= start && now <= end).toBe(true)
  // const start = dayjs.utc(startDate);
  // const end = dayjs.utc(endDate);
  // const now = dayjs.utc();
  // expect(now.isBetween(start, end, "day", "[]")).toBe(true);
  // // expect(now >= start && now <= end).toBe(true);
}

describe('generatePostSubmissionPublishedApplication', () => {
  // 01-submission the application is submitted via planX into BOPS
  it('Generates the correct structure for a post-submission application just after submission', () => {
    const { submission } = generateExampleApplications()
    const planningPermissionFullHouseholderSubmission = submission

    if (!planningPermissionFullHouseholderSubmission) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(planningPermissionFullHouseholderSubmission.applicationType).toEqual(
      'pp.full.householder'
    )
    expect(
      planningPermissionFullHouseholderSubmission.data.application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderSubmission.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderSubmission.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderSubmission.data.application.stage
    ).toEqual('submission')
    expect(
      planningPermissionFullHouseholderSubmission.data.application.status
    ).toEqual('undetermined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderSubmission.data.submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderSubmission.data.validation
    ).toBeUndefined()

    // consultation data checks
    expect(
      planningPermissionFullHouseholderSubmission.data.consultation
    ).toBeUndefined()

    // assessment data checks
    expect(
      planningPermissionFullHouseholderSubmission.data.assessment
    ).toBeUndefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderSubmission.data.appeal
    ).toBeUndefined()

    // comment check
    expect(planningPermissionFullHouseholderSubmission.comments).toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderSubmission.files).toBeDefined()
  })

  // 02 The application is validated in BOPS - it passes - so it goes straight to consultation/assessment depending on application type
  it('Generates an error if we request a valid application still in the validation stage', () => {
    expect(() => {
      generatePostSubmissionPublishedApplication({
        applicationType: 'pp.full.householder',
        applicationStage: 'validation',
        applicationStatus: 'undetermined'
      })
    }).toThrow(
      'Invalid application stage (validation) and status (undetermined) - validated applications go straight to consultation or assessment'
    )
  })

  // 02-validation-01-invalid The application is validated in BOPS - uhoh it fails so its now returned
  it('Generates the correct structure for a post-submission application that has failed validation', () => {
    const { returned } = generateExampleApplications()
    const planningPermissionFullHouseholderValidationFail = returned

    if (!planningPermissionFullHouseholderValidationFail) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderValidationFail.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderValidationFail.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderValidationFail.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderValidationFail.data.application.stage
    ).toEqual('validation')
    expect(
      planningPermissionFullHouseholderValidationFail.data.application.status
    ).toEqual('returned')

    // submission data checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.submission
        .submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.validation
        ?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderValidationFail.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderValidationFail.data.validation?.isValid
    ).toBe(false)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.consultation
    ).toBeUndefined()

    // assessment data checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.assessment
    ).toBeUndefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderValidationFail.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderValidationFail.comments
    ).toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderValidationFail.files).toBeDefined()
  })

  // 03-consultation Applications move immediately into consultation from validation except for those that don't have consultation stage (ldc) which go to assessment
  it('Generates the correct structure for a valid post-submission that is in consultation', () => {
    // throws an error for the wrong application type
    expect(() => {
      generatePostSubmissionPublishedApplication({
        applicationType: 'ldc.proposed',
        customStatus: 'consultationInProgress'
      })
    }).toThrow(
      'Invalid application stage (consultation) for application type ldc - this application type does not have a consultation stage'
    )

    const { consultation } = generateExampleApplications()
    const planningPermissionFullHouseholderConsultation = consultation

    if (!planningPermissionFullHouseholderConsultation) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderConsultation.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderConsultation.data.application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderConsultation.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderConsultation.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderConsultation.data.application.stage
    ).toEqual('consultation')
    expect(
      planningPermissionFullHouseholderConsultation.data.application.status
    ).toEqual('undetermined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderConsultation.data.submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderConsultation.data.validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderConsultation.data.validation?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderConsultation.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderConsultation.data.consultation?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderConsultation.data.consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderConsultation.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderConsultation.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)
    checkConsultationInProgress(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderConsultation.data.assessment
    ).toBeUndefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderConsultation.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderConsultation.comments
    ).not.toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderConsultation.files).toBeDefined()
  })

  // 04-assessment-00-assessment-in-progress Applications now moves to assessment and comments are no longer allowed unless the council allows it until a decision is made (ldc)
  it('Generates the correct structure for a valid post-submission that is in assessment', () => {
    const { assessmentInProgress } = generateExampleApplications()
    const planningPermissionFullHouseholderAssessmentInProgress =
      assessmentInProgress

    if (!planningPermissionFullHouseholderAssessmentInProgress) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(
        planningPermissionFullHouseholderAssessmentInProgress.submission
      ).length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.application
        .reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.application
        .stage
    ).toEqual('assessment')
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.application
        .status
    ).toEqual('undetermined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.submission
        .submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.validation
        ?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.validation
        ?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.consultation
        ?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.consultation
        ?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAssessmentInProgress.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAssessmentInProgress.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.assessment
        ?.expiryDate
    ).toBeDefined()
    expect(
      Object.keys(
        planningPermissionFullHouseholderAssessmentInProgress.data
          .assessment as PostSubmissionAssessment
      )
    ).toHaveLength(1)

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.comments
    ).not.toBeUndefined()

    // files check
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.files
    ).toBeDefined()

    const {
      assessmentInProgress:
        PriorApprovalLargerExtensionAssessmentAssessmentInProgress
    } = generateExampleApplications('pa.part1.classA')

    if (!PriorApprovalLargerExtensionAssessmentAssessmentInProgress) {
      throw new Error('No application generated')
    }

    const paAssessment =
      PriorApprovalLargerExtensionAssessmentAssessmentInProgress.data
        .assessment as PriorApprovalAssessment

    expect(paAssessment.expiryDate).toBeDefined()
    expect(Object.values(paAssessment)).toHaveLength(1)
  })

  // 04-assessment-01-council-determined council makes a decision on the application (comments are no longer allowed for those exempted per council)
  it('Generates the correct structure for a valid post-submission that is council determined', () => {
    const { planningOfficerDetermined } = generateExampleApplications()
    const planningPermissionFullHouseholderAssessmentCouncilDetermined =
      planningOfficerDetermined

    if (!planningPermissionFullHouseholderAssessmentCouncilDetermined) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(
        planningPermissionFullHouseholderAssessmentCouncilDetermined.submission
      ).length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .application.stage
    ).toEqual('assessment')
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .validation?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .consultation?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .consultation?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .consultation?.endDate ?? ''
    checkConsultationDates(startDate, endDate)
    // assessment data checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.planningOfficerDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.planningOfficerDecisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment?.committeeDecisionDate
    ).not.toBeDefined()
    // pretend its PA type to get tests to not error
    const ppAssessment =
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data
        .assessment as unknown as PriorApprovalAssessment
    expect(ppAssessment.priorApprovalRequired).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.comments
    ).not.toBeUndefined()

    // files check
    expect(
      planningPermissionFullHouseholderAssessmentCouncilDetermined.files
    ).toBeDefined()

    const {
      planningOfficerDetermined:
        PriorApprovalLargerExtensionAssessmentCouncilDetermined
    } = generateExampleApplications('pa.part1.classA')

    if (!PriorApprovalLargerExtensionAssessmentCouncilDetermined) {
      throw new Error('No application generated')
    }

    const paAssessment = PriorApprovalLargerExtensionAssessmentCouncilDetermined
      .data.assessment as PriorApprovalAssessment
    expect(paAssessment.priorApprovalRequired).toBeDefined()
    expect(paAssessment.expiryDate).toBeDefined()
  })

  // 04-assessment-02-assessment-in-committee Alternatively application goes to committee for a decision
  it('Generates the correct structure for a valid post-submission that is being assessed by committee', () => {
    const { assessmentInCommittee } = generateExampleApplications()
    const planningPermissionFullHouseholderAssessmentInCommittee =
      assessmentInCommittee

    if (!planningPermissionFullHouseholderAssessmentInCommittee) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(
        planningPermissionFullHouseholderAssessmentInCommittee.submission
      ).length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.application
        .reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.application
        .stage
    ).toEqual('assessment')
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.application
        .status
    ).toEqual('undetermined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.submission
        .submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.validation
        ?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.validation
        ?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.consultation
        ?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.consultation
        ?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAssessmentInCommittee.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAssessmentInCommittee.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)
    // assessment data checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.planningOfficerDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.planningOfficerDecisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.decisionNotice?.url
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.planningOfficerRecommendation
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.committeeSentDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.comments
    ).not.toBeUndefined()

    // files check
    expect(
      planningPermissionFullHouseholderAssessmentInCommittee.files
    ).toBeDefined()
  })

  // 04-assessment-03-committee-determined The committee then makes a decision
  it('Generates the correct structure for a valid post-submission that is commitee determined', () => {
    const { committeeDetermined } = generateExampleApplications()
    const planningPermissionFullHouseholderAssessmentCommitteeDetermined =
      committeeDetermined

    if (!planningPermissionFullHouseholderAssessmentCommitteeDetermined) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(
        planningPermissionFullHouseholderAssessmentCommitteeDetermined.submission
      ).length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .application.stage
    ).toEqual('assessment')
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .validation?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .consultation?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .consultation?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .consultation?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.planningOfficerDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.planningOfficerDecisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.planningOfficerRecommendation
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.committeeSentDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.committeeDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data
        .assessment?.committeeDecisionDate
    ).toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.comments
    ).not.toBeUndefined()

    // files check
    expect(
      planningPermissionFullHouseholderAssessmentCommitteeDetermined.files
    ).toBeDefined()
  })

  // 05-appeal-00-appeal-lodged Things can end before this but within 6 months of the decision a decision can be appealed
  it('Generates the correct structure for a valid post-submission that has an appeal lodged', () => {
    const { appealLodged } = generateExampleApplications()
    const planningPermissionFullHouseholderAppealLodged = appealLodged

    if (!planningPermissionFullHouseholderAppealLodged) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAppealLodged.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAppealLodged.data.application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderAppealLodged.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.application.stage
    ).toEqual('appeal')
    expect(
      planningPermissionFullHouseholderAppealLodged.data.application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.validation?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.consultation?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAppealLodged.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAppealLodged.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.planningOfficerDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.planningOfficerDecisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.lodgedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.reason
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.validatedDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.startedDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.decisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealLodged.data.appeal?.decision
    ).not.toBeDefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAppealLodged.comments
    ).not.toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderAppealLodged.files).toBeDefined()
  })

  // 05-appeal-01-appeal-validated After the appeal starts its validated
  it('Generates the correct structure for a valid post-submission that has a validated appeal lodged', () => {
    const { appealValid } = generateExampleApplications()
    const planningPermissionFullHouseholderAppealValidated = appealValid

    if (!planningPermissionFullHouseholderAppealValidated) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAppealValidated.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAppealValidated.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderAppealValidated.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.application
        .reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.application.stage
    ).toEqual('appeal')
    expect(
      planningPermissionFullHouseholderAppealValidated.data.application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.submission
        .submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.validation
        ?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.consultation
        ?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.consultation
        ?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAppealValidated.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAppealValidated.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.planningOfficerDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.planningOfficerDecisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal?.lodgedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal?.reason
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal
        ?.validatedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal?.startedDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal?.decisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealValidated.data.appeal?.decision
    ).not.toBeDefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAppealValidated.comments
    ).not.toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderAppealValidated.files).toBeDefined()
  })

  // 05-appeal-02-appeal-started Then it starts
  it('Generates the correct structure for a valid post-submission that has a validated appeal in progress', () => {
    const { appealStarted } = generateExampleApplications()
    const planningPermissionFullHouseholderAppealStarted = appealStarted

    if (!planningPermissionFullHouseholderAppealStarted) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(
      planningPermissionFullHouseholderAppealStarted.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAppealStarted.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderAppealStarted.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.application.stage
    ).toEqual('appeal')
    expect(
      planningPermissionFullHouseholderAppealStarted.data.application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.consultation
        ?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAppealStarted.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAppealStarted.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.planningOfficerDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.planningOfficerDecisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.lodgedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.reason
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.validatedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.startedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.decisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealStarted.data.appeal?.decision
    ).not.toBeDefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAppealStarted.comments
    ).not.toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderAppealStarted.files).toBeDefined()
  })

  // 05-appeal-03-appeal-determined and a decision is made by the appeal
  it('Generates the correct structure for a valid post-submission that has a validated appeal decision', () => {
    const {
      appealDetermined,
      appealDeterminedWithdrawn,
      appealDeterminedAllowed,
      appealDeterminedDismissed,
      appealDeterminedSplitDecision
    } = generateExampleApplications()
    const planningPermissionFullHouseholderAppealDetermined = appealDetermined

    if (!planningPermissionFullHouseholderAppealDetermined) {
      throw new Error('No application generated')
    }
    // basic checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.applicationType
    ).toEqual('pp.full.householder')
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.application
        .publishedAt
    ).toBeDefined()
    expect(
      Object.values(
        planningPermissionFullHouseholderAppealDetermined.submission
      ).length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.application
        .reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.application.stage
    ).toEqual('appeal')
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.application.status
    ).toEqual('determined')

    // submission data checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.submission
        .submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.validation
        ?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.validation
        ?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.consultation
        ?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.consultation
        ?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderAppealDetermined.data.consultation
        ?.startDate ?? ''
    const endDate =
      planningPermissionFullHouseholderAppealDetermined.data.consultation
        ?.endDate ?? ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.planningOfficerDecision
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.planningOfficerDecisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.decisionNotice?.url
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal?.lodgedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal?.reason
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal
        ?.validatedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal?.startedDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal
        ?.decisionDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderAppealDetermined.data.appeal?.decision
    ).toBeDefined()

    // comment check
    expect(
      planningPermissionFullHouseholderAppealDetermined.comments
    ).not.toBeUndefined()

    // files check
    expect(
      planningPermissionFullHouseholderAppealDetermined.files
    ).toBeDefined()

    // 05-appeal-03-appeal-determined--withdrawn
    const planningPermissionFullHouseholderAppealDeterminedWithdrawn =
      appealDeterminedWithdrawn

    if (!planningPermissionFullHouseholderAppealDeterminedWithdrawn) {
      throw new Error('No application generated')
    }

    expect(
      planningPermissionFullHouseholderAppealDeterminedWithdrawn.data.appeal
        ?.decision
    ).toBe('withdrawn')

    // 05-appeal-03-appeal-determined--allowed
    const planningPermissionFullHouseholderAppealDeterminedAllowed =
      appealDeterminedAllowed

    if (!planningPermissionFullHouseholderAppealDeterminedAllowed) {
      throw new Error('No application generated')
    }

    expect(
      planningPermissionFullHouseholderAppealDeterminedAllowed.data.appeal
        ?.decision
    ).toBe('allowed')

    // 05-appeal-03-appeal-determined--dismissed
    const planningPermissionFullHouseholderAppealDeterminedDismissed =
      appealDeterminedDismissed

    if (!planningPermissionFullHouseholderAppealDeterminedDismissed) {
      throw new Error('No application generated')
    }

    expect(
      planningPermissionFullHouseholderAppealDeterminedDismissed.data.appeal
        ?.decision
    ).toBe('dismissed')

    // 05-appeal-03-appeal-determined--split-decision
    const planningPermissionFullHouseholderAppealDeterminedSplitDecision =
      appealDeterminedSplitDecision

    if (!planningPermissionFullHouseholderAppealDeterminedSplitDecision) {
      throw new Error('No application generated')
    }

    expect(
      planningPermissionFullHouseholderAppealDeterminedSplitDecision.data.appeal
        ?.decision
    ).toBe('splitDecision')
  })

  // 06-assessment-withdrawn
  it('Generates the correct structure for a valid post-submission that has been withdrawn ', () => {
    const { withdrawn } = generateExampleApplications()
    const planningPermissionFullHouseholderWithdrawn = withdrawn

    if (!planningPermissionFullHouseholderWithdrawn) {
      throw new Error('No application generated')
    }

    // basic checks
    expect(planningPermissionFullHouseholderWithdrawn.applicationType).toEqual(
      'pp.full.householder'
    )
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application.publishedAt
    ).toBeDefined()
    expect(
      Object.values(planningPermissionFullHouseholderWithdrawn.submission)
        .length
    ).toBeGreaterThan(0)

    // application section checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application.reference
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application.stage
    ).toEqual('assessment')
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application.status
    ).toEqual('withdrawn')
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application.withdrawnAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.application
        .withdrawnReason
    ).toBeDefined()

    // submission data checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.submission.submittedAt
    ).toBeDefined()

    // validation data checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.validation?.receivedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.validation?.validatedAt
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.validation?.isValid
    ).toBe(true)

    // consultation data checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.consultation?.startDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.consultation?.endDate
    ).toBeDefined()
    const startDate =
      planningPermissionFullHouseholderWithdrawn.data.consultation?.startDate ??
      ''
    const endDate =
      planningPermissionFullHouseholderWithdrawn.data.consultation?.endDate ??
      ''
    checkConsultationDates(startDate, endDate)

    // assessment data checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment?.expiryDate
    ).toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.planningOfficerDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.planningOfficerDecisionDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment?.decisionNotice
        ?.url
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.planningOfficerRecommendation
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.committeeSentDate
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.committeeDecision
    ).not.toBeDefined()
    expect(
      planningPermissionFullHouseholderWithdrawn.data.assessment
        ?.committeeDecisionDate
    ).not.toBeDefined()

    // appeal data checks
    expect(
      planningPermissionFullHouseholderWithdrawn.data.appeal
    ).toBeUndefined()

    // comment check
    expect(
      planningPermissionFullHouseholderWithdrawn.comments
    ).not.toBeUndefined()

    // files check
    expect(planningPermissionFullHouseholderWithdrawn.files).toBeDefined()
  })

  it("Certain application types don't have consultation phases", () => {
    const lawfulDevelopmentCertificateProposedAssessmentCouncilDetermined =
      generatePostSubmissionPublishedApplication({
        applicationType: 'ldc.proposed',
        customStatus: 'assessmentCouncilDetermined'
      })
    expect(
      lawfulDevelopmentCertificateProposedAssessmentCouncilDetermined.data
        .consultation
    ).toBeUndefined()
  })

  it('Certain local authorities allow comments until the decision is made', () => {
    const planningPermissionFullHouseholderAssessmentInProgress =
      generatePostSubmissionPublishedApplication({
        applicationType: 'pp.full.householder',
        customStatus: 'assessmentInProgress'
      })
    expect(
      planningPermissionFullHouseholderAssessmentInProgress.data
        .localPlanningAuthority.publicCommentsAcceptedUntilDecision
    ).toBe(false)

    const lawfulDevelopmentCertificateProposedAssessmentInProgress =
      generatePostSubmissionPublishedApplication({
        applicationType: 'ldc.proposed',
        customStatus: 'assessmentInProgress'
      })

    expect(
      lawfulDevelopmentCertificateProposedAssessmentInProgress.data
        .localPlanningAuthority.publicCommentsAcceptedUntilDecision
    ).toBe(true)
  })
})
