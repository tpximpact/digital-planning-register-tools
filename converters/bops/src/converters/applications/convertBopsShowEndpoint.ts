import {
  // PostSubmissionPublishedApplication as PostSubmissionPublishedApplicationSchema,
  type PostSubmissionPublishedApplication
} from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
// import { type ProcessStage } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/ProcessStage.ts'
// import { type ApplicationStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/ApplicationStatus.ts'
// import { type AssessmentDecision } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/AssessmentDecision.ts'
import { type ApplicationType } from '@dpr/odp-schemas/types/schemas/prototypeApplication/enums/ApplicationType.ts'
// import {
//   PostSubmissionFile as PostSubmissionFileSchema,
//   type PostSubmissionFile
// } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PostSubmissionFile.ts'
import {
  // BopsShowEndpoint as BopsShowEndpointSchema,
  type BopsShowEndpoint
} from '../../schemas/bops/show'
// import { Value } from '@sinclair/typebox/value'
// import type { PostSubmissionMetadata } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/Metadata'
// import { convertDocumentBopsFile } from '../documents/convertDocumentBopsFile'
// import {
//   BopsFile as BopsFileSchema,
//   type BopsFile
// } from '../../schemas/shared/BopsFile'
// import { generateApplications } from '@dpr/libs'
// import { generateExampleApplications } from '@dpr/application-generator'
// import { debugSchema } from '../../utils/debugSchema'

/**
 * Checks to see if we're in the consultation period
 * @param startDate string
 * @param endDate string
 * @returns boolean
 */
// const getIsConsultationPeriod = (startDate: Date, endDate: Date): boolean => {
//   const now = new Date()

//   return now >= startDate && now <= endDate
// }

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

// const getDescription = (
//   proposal: PostSubmissionPublishedApplication['submission']['data']['proposal']
// ): string => {
//   if (!proposal) {
//     return 'No description'
//   }

//   if ('description' in proposal && proposal.description) {
//     return proposal.description
//   }
//   if ('reason' in proposal && proposal.reason) {
//     return proposal.reason
//   }

//   return 'No description'
// }

export const convertBopsShowEndpoint = (
  input: BopsShowEndpoint
  // additionalData?: { decisionNoticeUrl?: string }
): PostSubmissionPublishedApplication => {
  // const { committeeDetermined: application } = generateExampleApplications()

  // if (!Value.Check(BopsShowEndpointSchema, input)) {
  //   console.warn('Invalid BopsShowEndpoint:', input)
  //   throw new Error('Invalid BopsShowEndpoint')
  // }

  // let stage = undefined
  // let status = undefined
  // let withdrawnAt = undefined
  // const withdrawnReason = undefined
  // let consultation = undefined

  // const isConsultationPeriod =
  //   input?.application?.consultation?.startDate &&
  //   input?.application?.consultation?.endDate
  //     ? getIsConsultationPeriod(
  //         new Date(input.application.consultation.startDate),
  //         new Date(input.application.consultation.endDate)
  //       )
  //     : false

  // // BOPS sets closed as a status when you go to the withdraw or cancel application page
  // // so by setting status to in_assessment, it'll be picked up as such
  // if (input?.application?.status === 'closed') {
  //   status = 'in_assessment'
  // }

  // switch (input?.application?.status) {
  //   /**
  //    * 01-submission
  //    * pending
  //    * not_started
  //    * 02-validation-01-invalid
  //    * invalidated
  //    * returned
  //    */
  //   case 'pending':
  //   case 'not_started':
  //   case 'invalid':
  //   case 'returned':
  //     throw new Error('Application should not be published')

  //   /**
  //    * 03-consultation
  //    * in_assessment
  //    * assessment_in_progress
  //    *
  //    * 04-assessment-00-assessment-in-progress
  //    * in_assessment
  //    * assessment_in_progress
  //    * awaiting_determination
  //    * to_be_reviewed
  //    *
  //    * 04-assessment-01-council-determined
  //    * determined
  //    *
  //    * 04-assessment-02-assessment-in-committee
  //    * in_committee
  //    *
  //    * 04-assessment-03-committee-determined
  //    * determined - can't determine this currently
  //    *
  //    */

  //   case 'in_assessment':
  //   case 'assessment_in_progress':
  //     if (isConsultationPeriod) {
  //       stage = 'consultation'
  //       status = 'undetermined'
  //     } else {
  //       stage = 'assessment'
  //       status = 'undetermined'
  //     }
  //     break
  //   case 'awaiting_determination':
  //   case 'to_be_reviewed':
  //   case 'in_committee':
  //     stage = 'assessment'
  //     status = 'undetermined'
  //     break
  //   case 'determined':
  //     stage = 'assessment'
  //     status = 'determined'
  //     break

  //   /**
  //    * 05-appeal-00-appeal-lodged
  //    * Appeal lodged
  //    */

  //   case 'Appeal lodged':
  //     stage = 'appeal'
  //     status = 'determined'
  //     break

  //   /**
  //    * 05-appeal-01-appeal-validated
  //    * Appeal valid
  //    */

  //   case 'Appeal valid':
  //     stage = 'appeal'
  //     status = 'determined'
  //     break

  //   /**
  //    * 05-appeal-02-appeal-started
  //    * Appeal started
  //    */

  //   case 'Appeal started':
  //     stage = 'appeal'
  //     status = 'determined'
  //     break
  //   /**
  //    * 05-appeal-03-appeal-determined
  //    * Appeal determined
  //    *
  //    * Appeal withdrawn
  //    * Appeal allowed
  //    * Appeal dismissed
  //    * Appeal split decision
  //    */

  //   case 'Appeal determined':
  //   case 'Appeal allowed':
  //   case 'Appeal dismissed':
  //   case 'Appeal split decision':
  //   case 'Appeal withdrawn':
  //     stage = 'appeal'
  //     status = 'determined'
  //     break

  //   /**
  //    * 06-assessment-withdrawn
  //    * withdrawn
  //    * closed
  //    */
  //   case 'withdrawn':
  //     stage = 'assessment'
  //     status = 'withdrawn'
  //     withdrawnAt =
  //       input.application.determinedAt ||
  //       input.application.publishedAt ||
  //       undefined
  //     // withdrawnReason = "Applicant withdrew the application";
  //     break
  //   /**
  //    * @todo closed is
  //    *  scope :closed, lambda {
  //    *   where(status: %w[determined withdrawn returned closed])
  //    *  }
  //    */
  //   case 'closed':
  //     throw new Error('Closed application not enough information to convert')
  // }

  // // if theres consultation details add those
  // if (
  //   input.application?.consultation?.startDate &&
  //   input.application?.consultation?.startDate !== null &&
  //   input.application?.consultation?.endDate &&
  //   input.application?.consultation?.endDate !== null
  // ) {
  //   consultation = {
  //     startDate: input.application.consultation.startDate,
  //     endDate: input.application.consultation.endDate,
  //     siteNotice: true
  //   }
  // }

  // let appeal = input.data?.appeal ?? undefined
  // if (input.data?.appeal?.files) {
  //   const appealFiles = input.data.appeal.files
  //     .map((file: BopsFile) => {
  //       return convertDocumentBopsFile(file, 'appeal')
  //     })
  //     .filter((file) => {
  //       const valid =
  //         file !== undefined && Value.Check(PostSubmissionFileSchema, file)
  //       if (!valid) console.warn('Invalid PostSubmissionFile:', file)
  //       return valid
  //     })
  //   appeal = {
  //     ...input.data.appeal,
  //     files: appealFiles
  //   }
  // }

  // // Map BopsShowEndpoint attributes to PostSubmissionPublishedApplication
  // const application: PostSubmissionPublishedApplication = {
  //   applicationType: input.application.type.value,
  //   data: {
  //     application: {
  //       reference: input.application.reference,
  //       stage: stage as ProcessStage,
  //       status: status as ApplicationStatus,
  //       withdrawnAt,
  //       withdrawnReason,
  //       publishedAt: input.application.publishedAt
  //     },
  //     localPlanningAuthority: {
  //       // @TODO in DPR if camden and primaryApplicationType === 'ldc' then true
  //       publicCommentsAcceptedUntilDecision: false
  //     },
  //     submission: {
  //       submittedAt: input.application.receivedAt
  //     },
  //     validation: {
  //       receivedAt: input.application.receivedAt,
  //       validatedAt: input.application.validAt ?? undefined,
  //       isValid: true
  //     },
  //     consultation,
  //     assessment: {
  //       expiryDate: input.application.expiryDate ?? new Date().toISOString()
  //     },
  //     appeal,
  //     caseOfficer: {
  //       name: input.officer?.name ?? ''
  //     }
  //   },
  //   submission: {
  //     data: {
  //       applicant: input.applicant,
  //       property: {
  //         address: input.property.address,
  //         boundary: input.property.boundary
  //       },
  //       proposal: {
  //         description: getDescription(input.proposal)
  //       }
  //     }
  //   },
  //   metadata: {
  //     organisation: 'BOPS',
  //     id: input.application.reference,
  //     generatedAt: input.application.publishedAt,
  //     submittedAt: input.application.receivedAt,
  //     schema:
  //       'https://theopensystemslab.github.io/digital-planning-data-schemas/@next/schemas/postSubmissionApplication.json'
  //   } as PostSubmissionMetadata
  // }

  // // Sort out the assessment section

  // if (input.application.decision && input.application.determinedAt) {
  //   application.data.assessment = {
  //     planningOfficerDecision: input.application.decision as AssessmentDecision,
  //     planningOfficerDecisionDate: input.application.determinedAt,
  //     decisionNotice:
  //       input.application.decision && additionalData?.decisionNoticeUrl
  //         ? {
  //             url: additionalData.decisionNoticeUrl
  //           }
  //         : undefined
  //   } as PostSubmissionAssessment

  //   // if (getPrimaryApplicationTypeKey(input.applicationType) === 'pa') {
  //   //   let priorApprovalRequired = false
  //   //   if (
  //   //     app.application.decision === 'granted' ||
  //   //     app.application.decision === 'refused'
  //   //   ) {
  //   //     priorApprovalRequired = true
  //   //   }
  //   //   dprApplication.data.assessment = {
  //   //     ...dprApplication.data.assessment,
  //   //     priorApprovalRequired
  //   //   } as PriorApprovalAssessment
  //   // }
  // }

  // debugSchema(PostSubmissionPublishedApplicationSchema, application)
  // if (!Value.Check(PostSubmissionPublishedApplicationSchema, application)) {
  //   console.warn('Invalid PostSubmissionPublishedApplication:', application)
  //   throw new Error('Invalid PostSubmissionPublishedApplication')
  // }

  // return application

  return input
}
