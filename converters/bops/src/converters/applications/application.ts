import {
  PostSubmissionPublishedApplication as PostSubmissionPublishedApplicationSchema,
  type PostSubmissionPublishedApplication
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
import { Value } from '@sinclair/typebox/value'
import { debugSchema } from '@dpr/libs'
import type { ProcessStage } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/ProcessStage.ts'
import type { ApplicationStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/ApplicationStatus.ts'
import type { PostSubmissionMetadata } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/Metadata.ts'
import type { AssessmentDecision } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/AssessmentDecision.ts'
import type { ApplicationType } from '@dpr/odp-schemas/types/schemas/prototypeApplication/enums/ApplicationType.ts'
import type {
  PostSubmissionAssessment,
  PriorApprovalAssessment
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/Assessment.ts'
import type { PostSubmissionFileRedacted } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import { convertBopsFileToPostSubmissionFileRedacted } from '../documents'
import { convertToDate, formatToYYYYMMDDDate } from '../../utils/formatDates'
import {
  PrototypeApplication as PrototypeApplicationSchema,
  type PrototypeApplication
} from '@dpr/odp-schemas/types/schemas/prototypeApplication/minimumSubmission.ts'

export const convertBopsApplicationToOdp = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any
) => {
  if (Value.Check(PostSubmissionPublishedApplicationSchema, input)) {
    return input
  }

  // if (input.application?.type?.value !== 'pp.full.major') {
  // console.log('🔥', input.application.type.value, input.application.reference)
  // }

  // @TODO get decision notice url
  interface AdditionalData {
    decisionNoticeUrl?: string
    // ...other properties if needed
  }

  // Somewhere above:
  const additionalData: AdditionalData = {}

  let stage = undefined
  let status = undefined
  let withdrawnAt = undefined
  const withdrawnReason = undefined
  let consultation = undefined

  const isConsultationPeriod =
    input?.application?.consultation?.startDate &&
    input?.application?.consultation?.endDate
      ? getIsConsultationPeriod(
          new Date(input.application.consultation.startDate),
          new Date(input.application.consultation.endDate)
        )
      : false

  // BOPS sets closed as a status when you go to the withdraw or cancel application page
  // so by setting status to in_assessment, it'll be picked up as such
  if (input?.application?.status === 'closed') {
    status = 'in_assessment'
  }

  switch (input?.application?.status) {
    /**
     * 01-submission
     * pending
     * not_started
     * 02-validation-01-invalid
     * invalidated
     * returned
     */
    case 'pending':
    case 'not_started':
    case 'invalid':
    case 'returned':
      throw new Error('Application should not be published')

    /**
     * 03-consultation
     * in_assessment
     * assessment_in_progress
     *
     * 04-assessment-00-assessment-in-progress
     * in_assessment
     * assessment_in_progress
     * awaiting_determination
     * to_be_reviewed
     *
     * 04-assessment-01-council-determined
     * determined
     *
     * 04-assessment-02-assessment-in-committee
     * in_committee
     *
     * 04-assessment-03-committee-determined
     * determined - can't determine this currently
     *
     */

    case 'in_assessment':
    case 'assessment_in_progress':
      if (isConsultationPeriod) {
        stage = 'consultation'
        status = 'undetermined'
      } else {
        stage = 'assessment'
        status = 'undetermined'
      }
      break
    case 'awaiting_determination':
    case 'to_be_reviewed':
    case 'in_committee':
      stage = 'assessment'
      status = 'undetermined'
      break
    case 'determined':
      stage = 'assessment'
      status = 'determined'
      break

    /**
     * 05-appeal-00-appeal-lodged
     * Appeal lodged
     */

    case 'Appeal lodged':
      stage = 'appeal'
      status = 'determined'
      break

    /**
     * 05-appeal-01-appeal-validated
     * Appeal valid
     */

    case 'Appeal valid':
      stage = 'appeal'
      status = 'determined'
      break

    /**
     * 05-appeal-02-appeal-started
     * Appeal started
     */

    case 'Appeal started':
      stage = 'appeal'
      status = 'determined'
      break
    /**
     * 05-appeal-03-appeal-determined
     * Appeal determined
     *
     * Appeal withdrawn
     * Appeal allowed
     * Appeal dismissed
     * Appeal split decision
     */

    case 'Appeal determined':
    case 'Appeal allowed':
    case 'Appeal dismissed':
    case 'Appeal split decision':
    case 'Appeal withdrawn':
      stage = 'appeal'
      status = 'determined'
      break

    /**
     * 06-assessment-withdrawn
     * withdrawn
     * closed
     */
    case 'withdrawn':
      stage = 'assessment'
      status = 'withdrawn'
      withdrawnAt =
        input.application.determinedAt ||
        input.application.publishedAt ||
        undefined
      // withdrawnReason = "Applicant withdrew the application";
      break
    /**
     * @todo closed is
     *  scope :closed, lambda {
     *   where(status: %w[determined withdrawn returned closed])
     *  }
     */
    case 'closed':
      throw new Error('Closed application not enough information to convert')
  }

  // if theres consultation details add those
  if (
    input.application?.consultation?.startDate &&
    input.application?.consultation?.startDate !== null &&
    input.application?.consultation?.endDate &&
    input.application?.consultation?.endDate !== null
  ) {
    consultation = {
      startDate: input.application.consultation.startDate,
      endDate: input.application.consultation.endDate,
      siteNotice: true
    }
  }

  let appeal = input.data?.appeal ?? undefined
  if (input.data?.appeal?.files) {
    const appealFiles: PostSubmissionFileRedacted[] = (
      input.data?.appeal?.files ?? []
    )
      .map((file: unknown): PostSubmissionFileRedacted | undefined => {
        try {
          return convertBopsFileToPostSubmissionFileRedacted(file, 'appeal')
        } catch (error) {
          console.warn(
            'Error converting specialists comment files but its taken care of elsewhere:',
            error
          )
          return undefined
        }
      })
      .filter(
        (
          file: PostSubmissionFileRedacted | undefined
        ): file is PostSubmissionFileRedacted => file !== undefined
      )

    appeal = {
      ...input.data.appeal,
      files: appealFiles
    }
  }

  // Map BopsShowEndpoint attributes to PostSubmissionPublishedApplication
  const application: PostSubmissionPublishedApplication = {
    applicationType: input?.application?.type?.value,
    data: {
      application: {
        reference: input.application.reference,
        stage: stage as ProcessStage,
        status: status as ApplicationStatus,
        withdrawnAt: withdrawnAt
          ? convertToDate(withdrawnAt).toISOString()
          : undefined,
        withdrawnReason,
        publishedAt: input.application.publishedAt
          ? convertToDate(input.application.publishedAt).toISOString()
          : undefined
      },
      localPlanningAuthority: {
        // @TODO in DPR if camden and primaryApplicationType === 'ldc' then true
        publicCommentsAcceptedUntilDecision: false
      },
      submission: {
        submittedAt: input.application.receivedAt
      },
      validation: {
        receivedAt: input.application.receivedAt
          ? convertToDate(input.application.receivedAt).toISOString()
          : new Date().toISOString(),
        validatedAt: input.application.validAt
          ? convertToDate(input.application.validAt).toISOString()
          : undefined,
        isValid: true
      },
      consultation,
      assessment: {
        expiryDate: input?.application?.expiryDate
          ? formatToYYYYMMDDDate(input?.application?.expiryDate)
          : formatToYYYYMMDDDate(new Date().toISOString())
      },
      appeal,
      caseOfficer: {
        name: input.officer?.name ?? ''
      }
    },
    submission: {},
    metadata: {
      organisation: 'BOPS',
      id: input.application.reference,
      generatedAt: input?.application?.publishedAt
        ? convertToDate(input?.application?.publishedAt).toISOString()
        : new Date().toISOString(),
      submittedAt: input?.application?.receivedAt
        ? convertToDate(input?.application?.receivedAt).toISOString()
        : new Date().toISOString(),
      schema:
        'https://theopensystemslab.github.io/digital-planning-data-schemas/@next/schemas/postSubmissionApplication.json'
    } as PostSubmissionMetadata
  }

  // Sort out the assessment section

  if (input.application.decision && input.application.determinedAt) {
    application.data.assessment = {
      ...application.data.assessment,
      planningOfficerDecision: input.application.decision as AssessmentDecision,
      planningOfficerDecisionDate:
        formatToYYYYMMDDDate(input?.application?.determinedAt) ?? undefined,
      decisionNotice:
        input.application.decision && additionalData?.decisionNoticeUrl
          ? {
              url: additionalData.decisionNoticeUrl
            }
          : undefined
    } as PostSubmissionAssessment

    if (getPrimaryApplicationTypeKey(input.applicationType) === 'pa') {
      let priorApprovalRequired = false
      if (
        input.application.decision === 'granted' ||
        input.application.decision === 'refused'
      ) {
        priorApprovalRequired = true
      }
      application.data.assessment = {
        ...application.data.assessment,
        priorApprovalRequired
      } as PriorApprovalAssessment
    }
  }

  const applicationSubmission: PrototypeApplication = {
    // applicationType: application.applicationType,
    data: {
      applicant: input.applicant,
      property: {
        address: input.property.address,
        boundary: input.property.boundary
      },
      proposal: {
        description: getDescription(input.proposal)
      }
    },
    metadata: {
      submittedAt: input?.application?.receivedAt
        ? convertToDate(input?.application?.receivedAt).toISOString()
        : new Date().toISOString()
    }
  }

  if (Value.Check(PrototypeApplicationSchema, applicationSubmission)) {
    application.submission = applicationSubmission
  } else {
    console.log(application.applicationType)
    debugSchema(PrototypeApplicationSchema, applicationSubmission)
  }

  console.log(application.submission)

  if (Value.Check(PostSubmissionPublishedApplicationSchema, application)) {
    return application
  }

  //
  // debugSchema(PostSubmissionPublishedApplicationSchema, application)

  throw new Error('Unable to convert application')
}

/**
 * Checks to see if we're in the consultation period
 * @param startDate string
 * @param endDate string
 * @returns boolean
 */
const getIsConsultationPeriod = (startDate: Date, endDate: Date): boolean => {
  const now = new Date()

  return now >= startDate && now <= endDate
}

/**
 * pa.part1.classA = pa
 * Utility class that returns the key for the primary application type eg the pp in pp.part1.classA
 * @param applicationType
 * @returns
 */
export const getPrimaryApplicationTypeKey = (
  applicationType: ApplicationType
): string | undefined => {
  if (!applicationType) {
    return undefined
  }
  const type = applicationType.split('.')[0]
  // if (type && isValidPrimaryApplicationType(type)) {
  return type || undefined
  // }
}

const getDescription = (
  proposal: PostSubmissionPublishedApplication['submission']['data']['proposal']
): string => {
  if (!proposal) {
    return 'No description'
  }

  if ('description' in proposal && proposal.description) {
    return proposal.description
  }
  if ('reason' in proposal && proposal.reason) {
    return proposal.reason
  }

  return 'No description'
}
