import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import { PostSubmissionMetadataSchema } from './Metadata'
import { CaseOfficerSchema } from './data/CaseOfficer'
import { AppealSchema } from './data/Appeal'
import { PostSubmissionFileSchema } from './data/File'
import { ApplicationSchema } from './data/Application'
import { LocalPlanningAuthoritySchema } from './data/LocalPlanningAuthority'
import { SubmissionSchema } from './data/Submission'
import { ValidationSchema } from './data/Validation'
import { ConsultationSchema } from './data/Consultation'
import { AssessmentSchema } from './data/Assessment'
import { PublicCommentsSchema, SpecialistCommentsSchema } from './data/Comment'

export const PostSubmissionApplicationSpecificationGenerator = <
  T extends TSchema
>(
  T: T
) =>
  Type.Object({
    applicationType: T,
    data: Type.Object({
      application: ApplicationSchema(T),
      localPlanningAuthority: LocalPlanningAuthoritySchema(T),
      submission: SubmissionSchema(T),
      validation: Type.Optional(ValidationSchema(T)),
      consultation: Type.Optional(ConsultationSchema(T)),
      assessment: Type.Optional(AssessmentSchema(T)),
      appeal: Type.Optional(AppealSchema(T)),
      caseOfficer: CaseOfficerSchema(T)
    }),
    comments: Type.Optional(
      Type.Object({
        public: Type.Optional(PublicCommentsSchema),
        specialist: Type.Optional(SpecialistCommentsSchema)
      })
    ),
    files: Type.Optional(Type.Array(PostSubmissionFileSchema)),
    submission: Type.Any(),
    metadata: PostSubmissionMetadataSchema
  })

export type PostSubmissionAdvertConsent = Static<
  typeof PostSubmissionAdvertConsentSchema
>
export const PostSubmissionAdvertConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('advertConsent'))

export type PostSubmissionAmendmentMinorMaterial = Static<
  typeof PostSubmissionAmendmentMinorMaterialSchema
>
export const PostSubmissionAmendmentMinorMaterialSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('amendment.minorMaterial')
  )

export type PostSubmissionAmendmentNonMaterial = Static<
  typeof PostSubmissionAmendmentNonMaterialSchema
>
export const PostSubmissionAmendmentNonMaterialSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('amendment.nonMaterial')
  )

export type PostSubmissionApprovalConditions = Static<
  typeof PostSubmissionApprovalConditionsSchema
>
export const PostSubmissionApprovalConditionsSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('approval.conditions')
  )

export type PostSubmissionApprovalReservedMatters = Static<
  typeof PostSubmissionApprovalReservedMattersSchema
>
export const PostSubmissionApprovalReservedMattersSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('approval.reservedMatters')
  )

export type PostSubmissionComplianceConfirmation = Static<
  typeof PostSubmissionComplianceConfirmationSchema
>
export const PostSubmissionComplianceConfirmationSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('complianceConfirmation')
  )

export type PostSubmissionEnvironmentalImpactScoping = Static<
  typeof PostSubmissionEnvironmentalImpactScopingSchema
>
export const PostSubmissionEnvironmentalImpactScopingSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('environmentalImpact.scoping')
  )

export type PostSubmissionEnvironmentalImpactScreening = Static<
  typeof PostSubmissionEnvironmentalImpactScreeningSchema
>
export const PostSubmissionEnvironmentalImpactScreeningSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('environmentalImpact.screening')
  )

export type PostSubmissionHazardousSubstanceConsent = Static<
  typeof PostSubmissionHazardousSubstanceConsentSchema
>
export const PostSubmissionHazardousSubstanceConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('hazardousSubstanceConsent')
  )

export type PostSubmissionHedgerowRemovalNotice = Static<
  typeof PostSubmissionHedgerowRemovalNoticeSchema
>
export const PostSubmissionHedgerowRemovalNoticeSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('hedgerowRemovalNotice')
  )

export type PostSubmissionLandDrainageConsent = Static<
  typeof PostSubmissionLandDrainageConsentSchema
>
export const PostSubmissionLandDrainageConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('landDrainageConsent')
  )

export type PostSubmissionLawfulDevelopmentCertificateBreachOfCondition =
  Static<
    typeof PostSubmissionLawfulDevelopmentCertificateBreachOfConditionSchema
  >
export const PostSubmissionLawfulDevelopmentCertificateBreachOfConditionSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('ldc.breachOfCondition')
  )

export type PostSubmissionLawfulDevelopmentCertificateExisting = Static<
  typeof PostSubmissionLawfulDevelopmentCertificateExistingSchema
>
export const PostSubmissionLawfulDevelopmentCertificateExistingSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('ldc.existing'))

export type PostSubmissionLawfulDevelopmentCertificateListedBuildingWorks =
  Static<
    typeof PostSubmissionLawfulDevelopmentCertificateListedBuildingWorksSchema
  >
export const PostSubmissionLawfulDevelopmentCertificateListedBuildingWorksSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('ldc.listedBuildingWorks')
  )

export type PostSubmissionLawfulDevelopmentCertificateProposed = Static<
  typeof PostSubmissionLawfulDevelopmentCertificateProposedSchema
>
export const PostSubmissionLawfulDevelopmentCertificateProposedSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('ldc.proposed'))

export type PostSubmissionListedBuildingConsent = Static<
  typeof PostSubmissionListedBuildingConsentSchema
>
export const PostSubmissionListedBuildingConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('listed'))

export type PostSubmissionNotifyCompletion = Static<
  typeof PostSubmissionNotifyCompletionSchema
>
export const PostSubmissionNotifyCompletionSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('notifyCompletion')
  )

export type PostSubmissionObligationDischarge = Static<
  typeof PostSubmissionObligationDischargeSchema
>
export const PostSubmissionObligationDischargeSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('obligation.discharge')
  )

export type PostSubmissionObligationModify = Static<
  typeof PostSubmissionObligationModifySchema
>
export const PostSubmissionObligationModifySchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('obligation.modify')
  )

export type PostSubmissionOnshoreExtractionOilAndGasOther = Static<
  typeof PostSubmissionOnshoreExtractionOilAndGasOtherSchema
>
export const PostSubmissionOnshoreExtractionOilAndGasOtherSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.other')
  )

export type PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionExtension =
  Static<
    typeof PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema
  >
export const PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.extension')
  )

export type PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWaste =
  Static<
    typeof PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWasteSchema
  >
export const PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWasteSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.waste')
  )

export type PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWorking =
  Static<
    typeof PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema
  >
export const PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.working')
  )

export type PostSubmissionOnshoreExtractionOilAndGasReview = Static<
  typeof PostSubmissionOnshoreExtractionOilAndGasReviewSchema
>
export const PostSubmissionOnshoreExtractionOilAndGasReviewSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.review')
  )

export type PostSubmissionOnshoreExtractionOilAndGasVariation = Static<
  typeof PostSubmissionOnshoreExtractionOilAndGasVariationSchema
>
export const PostSubmissionOnshoreExtractionOilAndGasVariationSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.variation')
  )

export type PostSubmissionPriorApprovalPart1ClassA = Static<
  typeof PostSubmissionPriorApprovalPart1ClassASchema
>
export const PostSubmissionPriorApprovalPart1ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part1.classA')
  )

export type PostSubmissionPriorApprovalPart1ClassAA = Static<
  typeof PostSubmissionPriorApprovalPart1ClassAASchema
>
export const PostSubmissionPriorApprovalPart1ClassAASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part1.classAA')
  )

export type PostSubmissionPriorApprovalPart3ClassG = Static<
  typeof PostSubmissionPriorApprovalPart3ClassGSchema
>
export const PostSubmissionPriorApprovalPart3ClassGSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classG')
  )

export type PostSubmissionPriorApprovalPart3ClassM = Static<
  typeof PostSubmissionPriorApprovalPart3ClassMSchema
>
export const PostSubmissionPriorApprovalPart3ClassMSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classM')
  )

export type PostSubmissionPriorApprovalPart3ClassMA = Static<
  typeof PostSubmissionPriorApprovalPart3ClassMASchema
>
export const PostSubmissionPriorApprovalPart3ClassMASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classMA')
  )

export type PostSubmissionPriorApprovalPart3ClassN = Static<
  typeof PostSubmissionPriorApprovalPart3ClassNSchema
>
export const PostSubmissionPriorApprovalPart3ClassNSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classN')
  )

export type PostSubmissionPriorApprovalPart3ClassQ = Static<
  typeof PostSubmissionPriorApprovalPart3ClassQSchema
>
export const PostSubmissionPriorApprovalPart3ClassQSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classQ')
  )

export type PostSubmissionPriorApprovalPart3ClassR = Static<
  typeof PostSubmissionPriorApprovalPart3ClassRSchema
>
export const PostSubmissionPriorApprovalPart3ClassRSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classR')
  )

export type PostSubmissionPriorApprovalPart3ClassS = Static<
  typeof PostSubmissionPriorApprovalPart3ClassSSchema
>
export const PostSubmissionPriorApprovalPart3ClassSSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classS')
  )

export type PostSubmissionPriorApprovalPart3ClassT = Static<
  typeof PostSubmissionPriorApprovalPart3ClassTSchema
>
export const PostSubmissionPriorApprovalPart3ClassTSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classT')
  )

export type PostSubmissionPriorApprovalPart3ClassV = Static<
  typeof PostSubmissionPriorApprovalPart3ClassVSchema
>
export const PostSubmissionPriorApprovalPart3ClassVSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classV')
  )

export type PostSubmissionPriorApprovalPart4ClassBB = Static<
  typeof PostSubmissionPriorApprovalPart4ClassBBSchema
>
export const PostSubmissionPriorApprovalPart4ClassBBSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classBB')
  )

export type PostSubmissionPriorApprovalPart4ClassBC = Static<
  typeof PostSubmissionPriorApprovalPart4ClassBCSchema
>
export const PostSubmissionPriorApprovalPart4ClassBCSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classBC')
  )

export type PostSubmissionPriorApprovalPart4ClassCA = Static<
  typeof PostSubmissionPriorApprovalPart4ClassCASchema
>
export const PostSubmissionPriorApprovalPart4ClassCASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classCA')
  )

export type PostSubmissionPriorApprovalPart4ClassE = Static<
  typeof PostSubmissionPriorApprovalPart4ClassESchema
>
export const PostSubmissionPriorApprovalPart4ClassESchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classE')
  )

export type PostSubmissionPriorApprovalPart6 = Static<
  typeof PostSubmissionPriorApprovalPart6Schema
>
export const PostSubmissionPriorApprovalPart6Schema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pa.part6'))

export type PostSubmissionPriorApprovalPart6ClassA = Static<
  typeof PostSubmissionPriorApprovalPart6ClassASchema
>
export const PostSubmissionPriorApprovalPart6ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classA')
  )

export type PostSubmissionPriorApprovalPart6ClassB = Static<
  typeof PostSubmissionPriorApprovalPart6ClassBSchema
>
export const PostSubmissionPriorApprovalPart6ClassBSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classB')
  )

export type PostSubmissionPriorApprovalPart6ClassE = Static<
  typeof PostSubmissionPriorApprovalPart6ClassESchema
>
export const PostSubmissionPriorApprovalPart6ClassESchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classE')
  )

export type PostSubmissionPriorApprovalPart7ClassC = Static<
  typeof PostSubmissionPriorApprovalPart7ClassCSchema
>
export const PostSubmissionPriorApprovalPart7ClassCSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part7.classC')
  )

export type PostSubmissionPriorApprovalPart7ClassM = Static<
  typeof PostSubmissionPriorApprovalPart7ClassMSchema
>
export const PostSubmissionPriorApprovalPart7ClassMSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part7.classM')
  )

export type PostSubmissionPriorApprovalPart9ClassD = Static<
  typeof PostSubmissionPriorApprovalPart9ClassDSchema
>
export const PostSubmissionPriorApprovalPart9ClassDSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part9.classD')
  )

export type PostSubmissionPriorApprovalPart11ClassB = Static<
  typeof PostSubmissionPriorApprovalPart11ClassBSchema
>
export const PostSubmissionPriorApprovalPart11ClassBSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part11.classB')
  )

export type PostSubmissionPriorApprovalPart14ClassA = Static<
  typeof PostSubmissionPriorApprovalPart14ClassASchema
>
export const PostSubmissionPriorApprovalPart14ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classA')
  )

export type PostSubmissionPriorApprovalPart14ClassB = Static<
  typeof PostSubmissionPriorApprovalPart14ClassBSchema
>
export const PostSubmissionPriorApprovalPart14ClassBSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classB')
  )

export type PostSubmissionPriorApprovalPart14ClassJ = Static<
  typeof PostSubmissionPriorApprovalPart14ClassJSchema
>
export const PostSubmissionPriorApprovalPart14ClassJSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classJ')
  )

export type PostSubmissionPriorApprovalPart14ClassK = Static<
  typeof PostSubmissionPriorApprovalPart14ClassKSchema
>
export const PostSubmissionPriorApprovalPart14ClassKSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classK')
  )

export type PostSubmissionPriorApprovalPart14ClassOA = Static<
  typeof PostSubmissionPriorApprovalPart14ClassOASchema
>
export const PostSubmissionPriorApprovalPart14ClassOASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classOA')
  )

export type PostSubmissionPriorApprovalPart16ClassA = Static<
  typeof PostSubmissionPriorApprovalPart16ClassASchema
>
export const PostSubmissionPriorApprovalPart16ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part16.classA')
  )

export type PostSubmissionPriorApprovalPart17 = Static<
  typeof PostSubmissionPriorApprovalPart17Schema
>
export const PostSubmissionPriorApprovalPart17Schema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pa.part17'))

export type PostSubmissionPriorApprovalPart17ClassB = Static<
  typeof PostSubmissionPriorApprovalPart17ClassBSchema
>
export const PostSubmissionPriorApprovalPart17ClassBSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classB')
  )

export type PostSubmissionPriorApprovalPart17ClassC = Static<
  typeof PostSubmissionPriorApprovalPart17ClassCSchema
>
export const PostSubmissionPriorApprovalPart17ClassCSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classC')
  )

export type PostSubmissionPriorApprovalPart17ClassG = Static<
  typeof PostSubmissionPriorApprovalPart17ClassGSchema
>
export const PostSubmissionPriorApprovalPart17ClassGSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classG')
  )

export type PostSubmissionPriorApprovalPart18ClassA = Static<
  typeof PostSubmissionPriorApprovalPart18ClassASchema
>
export const PostSubmissionPriorApprovalPart18ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part18.classA')
  )

export type PostSubmissionPriorApprovalPart19ClassTA = Static<
  typeof PostSubmissionPriorApprovalPart19ClassTASchema
>
export const PostSubmissionPriorApprovalPart19ClassTASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part19.classTA')
  )

export type PostSubmissionPriorApprovalPart20ClassA = Static<
  typeof PostSubmissionPriorApprovalPart20ClassASchema
>
export const PostSubmissionPriorApprovalPart20ClassASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classA')
  )

export type PostSubmissionPriorApprovalPart20ClassAA = Static<
  typeof PostSubmissionPriorApprovalPart20ClassAASchema
>
export const PostSubmissionPriorApprovalPart20ClassAASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAA')
  )

export type PostSubmissionPriorApprovalPart20ClassAB = Static<
  typeof PostSubmissionPriorApprovalPart20ClassABSchema
>
export const PostSubmissionPriorApprovalPart20ClassABSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAB')
  )

export type PostSubmissionPriorApprovalPart20ClassAC = Static<
  typeof PostSubmissionPriorApprovalPart20ClassACSchema
>
export const PostSubmissionPriorApprovalPart20ClassACSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAC')
  )

export type PostSubmissionPriorApprovalPart20ClassAD = Static<
  typeof PostSubmissionPriorApprovalPart20ClassADSchema
>
export const PostSubmissionPriorApprovalPart20ClassADSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAD')
  )

export type PostSubmissionPriorApprovalPart20ClassZA = Static<
  typeof PostSubmissionPriorApprovalPart20ClassZASchema
>
export const PostSubmissionPriorApprovalPart20ClassZASchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classZA')
  )

export type PostSubmissionPlanningPermissionFullAdvertConsent = Static<
  typeof PostSubmissionPlanningPermissionFullAdvertConsentSchema
>
export const PostSubmissionPlanningPermissionFullAdvertConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.advertConsent')
  )

export type PostSubmissionPlanningPermissionFullDemolition = Static<
  typeof PostSubmissionPlanningPermissionFullDemolitionSchema
>
export const PostSubmissionPlanningPermissionFullDemolitionSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.demolition')
  )

export type PostSubmissionPlanningPermissionFullFastTrackAffordable = Static<
  typeof PostSubmissionPlanningPermissionFullFastTrackAffordableSchema
>
export const PostSubmissionPlanningPermissionFullFastTrackAffordableSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.fastTrack.affordable')
  )

export type PostSubmissionPlanningPermissionFullHouseholder = Static<
  typeof PostSubmissionPlanningPermissionFullHouseholderSchema
>
export const PostSubmissionPlanningPermissionFullHouseholderSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder')
  )

export type PostSubmissionPlanningPermissionFullHouseholderListed = Static<
  typeof PostSubmissionPlanningPermissionFullHouseholderListedSchema
>
export const PostSubmissionPlanningPermissionFullHouseholderListedSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder.listed')
  )

export type PostSubmissionPlanningPermissionFullHouseholderRetrospective =
  Static<
    typeof PostSubmissionPlanningPermissionFullHouseholderRetrospectiveSchema
  >
export const PostSubmissionPlanningPermissionFullHouseholderRetrospectiveSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder.retro')
  )

export type PostSubmissionPlanningPermissionFullMinor = Static<
  typeof PostSubmissionPlanningPermissionFullMinorSchema
>
export const PostSubmissionPlanningPermissionFullMinorSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pp.full.minor'))

export type PostSubmissionPlanningPermissionFullMinorListed = Static<
  typeof PostSubmissionPlanningPermissionFullMinorListedSchema
>
export const PostSubmissionPlanningPermissionFullMinorListedSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.minor.listed')
  )

export type PostSubmissionPlanningPermissionFullMinorTechnicalDetails = Static<
  typeof PostSubmissionPlanningPermissionFullMinorTechnicalDetailsSchema
>
export const PostSubmissionPlanningPermissionFullMinorTechnicalDetailsSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.minor.technicalDetails')
  )

export type PostSubmissionPlanningPermissionFullMajor = Static<
  typeof PostSubmissionPlanningPermissionFullMajorSchema
>
export const PostSubmissionPlanningPermissionFullMajorSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pp.full.major'))

export type PostSubmissionPlanningPermissionFullMajorTechnicalDetails = Static<
  typeof PostSubmissionPlanningPermissionFullMajorTechnicalDetailsSchema
>
export const PostSubmissionPlanningPermissionFullMajorTechnicalDetailsSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.technicalDetails')
  )

export type PostSubmissionPlanningPermissionFullMajorTechnicalDetailsWaste =
  Static<
    typeof PostSubmissionPlanningPermissionFullMajorTechnicalDetailsWasteSchema
  >
export const PostSubmissionPlanningPermissionFullMajorTechnicalDetailsWasteSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.technicalDetails.waste')
  )

export type PostSubmissionPlanningPermissionFullMajorWaste = Static<
  typeof PostSubmissionPlanningPermissionFullMajorWasteSchema
>
export const PostSubmissionPlanningPermissionFullMajorWasteSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.waste')
  )

export type PostSubmissionPlanningPermissionMineralExtraction = Static<
  typeof PostSubmissionPlanningPermissionMineralExtractionSchema
>
export const PostSubmissionPlanningPermissionMineralExtractionSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.mineralExtraction')
  )

export type PostSubmissionPlanningPermissionOutline = Static<
  typeof PostSubmissionPlanningPermissionOutlineSchema
>
export const PostSubmissionPlanningPermissionOutlineSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pp.outline'))

export type PostSubmissionPlanningPermissionOutlineAll = Static<
  typeof PostSubmissionPlanningPermissionOutlineAllSchema
>
export const PostSubmissionPlanningPermissionOutlineAllSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.all')
  )

export type PostSubmissionPlanningPermissionOutlineSome = Static<
  typeof PostSubmissionPlanningPermissionOutlineSomeSchema
>
export const PostSubmissionPlanningPermissionOutlineSomeSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.some')
  )

export type PostSubmissionPlanningPermissionOutlineMinor = Static<
  typeof PostSubmissionPlanningPermissionOutlineMinorSchema
>
export const PostSubmissionPlanningPermissionOutlineMinorSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor')
  )

export type PostSubmissionPlanningPermissionOutlineMinorAll = Static<
  typeof PostSubmissionPlanningPermissionOutlineMinorAllSchema
>
export const PostSubmissionPlanningPermissionOutlineMinorAllSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor.all')
  )

export type PostSubmissionPlanningPermissionOutlineMinorSome = Static<
  typeof PostSubmissionPlanningPermissionOutlineMinorSomeSchema
>
export const PostSubmissionPlanningPermissionOutlineMinorSomeSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor.some')
  )

export type PostSubmissionPlanningPermissionOutlineMajor = Static<
  typeof PostSubmissionPlanningPermissionOutlineMajorSchema
>
export const PostSubmissionPlanningPermissionOutlineMajorSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major')
  )

export type PostSubmissionPlanningPermissionOutlineMajorAll = Static<
  typeof PostSubmissionPlanningPermissionOutlineMajorAllSchema
>
export const PostSubmissionPlanningPermissionOutlineMajorAllSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.all')
  )

export type PostSubmissionPlanningPermissionOutlineMajorAllWaste = Static<
  typeof PostSubmissionPlanningPermissionOutlineMajorAllWasteSchema
>
export const PostSubmissionPlanningPermissionOutlineMajorAllWasteSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.all.waste')
  )

export type PostSubmissionPlanningPermissionOutlineMajorSome = Static<
  typeof PostSubmissionPlanningPermissionOutlineMajorSomeSchema
>
export const PostSubmissionPlanningPermissionOutlineMajorSomeSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.some')
  )

export type PostSubmissionPlanningPermissionOutlineMajorSomeWaste = Static<
  typeof PostSubmissionPlanningPermissionOutlineMajorSomeWasteSchema
>
export const PostSubmissionPlanningPermissionOutlineMajorSomeWasteSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.some.waste')
  )

export type PostSubmissionPlanningPermissionPermissionInPrinciple = Static<
  typeof PostSubmissionPlanningPermissionPermissionInPrincipleSchema
>
export const PostSubmissionPlanningPermissionPermissionInPrincipleSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('pp.pip'))

export type PostSubmissionRightsOfWayOrder = Static<
  typeof PostSubmissionRightsOfWayOrderSchema
>
export const PostSubmissionRightsOfWayOrderSchema =
  PostSubmissionApplicationSpecificationGenerator(
    Type.Literal('rightsOfWayOrder')
  )

export type PostSubmissionWorksToTreesConsent = Static<
  typeof PostSubmissionWorksToTreesConsentSchema
>
export const PostSubmissionWorksToTreesConsentSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('wtt.consent'))

export type PostSubmissionWorksToTreesNotice = Static<
  typeof PostSubmissionWorksToTreesNoticeSchema
>
export const PostSubmissionWorksToTreesNoticeSchema =
  PostSubmissionApplicationSpecificationGenerator(Type.Literal('wtt.notice'))

// ////////

export type PostSubmissionApplication =
  | PostSubmissionAdvertConsent
  | PostSubmissionAmendmentMinorMaterial
  | PostSubmissionAmendmentNonMaterial
  | PostSubmissionApprovalConditions
  | PostSubmissionApprovalReservedMatters
  | PostSubmissionComplianceConfirmation
  | PostSubmissionEnvironmentalImpactScoping
  | PostSubmissionEnvironmentalImpactScreening
  | PostSubmissionHazardousSubstanceConsent
  | PostSubmissionHedgerowRemovalNotice
  | PostSubmissionLandDrainageConsent
  | PostSubmissionLawfulDevelopmentCertificateBreachOfCondition
  | PostSubmissionLawfulDevelopmentCertificateExisting
  | PostSubmissionLawfulDevelopmentCertificateListedBuildingWorks
  | PostSubmissionLawfulDevelopmentCertificateProposed
  | PostSubmissionListedBuildingConsent
  | PostSubmissionNotifyCompletion
  | PostSubmissionObligationDischarge
  | PostSubmissionObligationModify
  | PostSubmissionOnshoreExtractionOilAndGasOther
  | PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionExtension
  | PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWaste
  | PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWorking
  | PostSubmissionOnshoreExtractionOilAndGasReview
  | PostSubmissionOnshoreExtractionOilAndGasVariation
  | PostSubmissionPriorApprovalPart1ClassA
  | PostSubmissionPriorApprovalPart1ClassAA
  | PostSubmissionPriorApprovalPart3ClassG
  | PostSubmissionPriorApprovalPart3ClassM
  | PostSubmissionPriorApprovalPart3ClassMA
  | PostSubmissionPriorApprovalPart3ClassN
  | PostSubmissionPriorApprovalPart3ClassQ
  | PostSubmissionPriorApprovalPart3ClassR
  | PostSubmissionPriorApprovalPart3ClassS
  | PostSubmissionPriorApprovalPart3ClassT
  | PostSubmissionPriorApprovalPart3ClassV
  | PostSubmissionPriorApprovalPart4ClassBB
  | PostSubmissionPriorApprovalPart4ClassBC
  | PostSubmissionPriorApprovalPart4ClassCA
  | PostSubmissionPriorApprovalPart4ClassE
  | PostSubmissionPriorApprovalPart6
  | PostSubmissionPriorApprovalPart6ClassA
  | PostSubmissionPriorApprovalPart6ClassB
  | PostSubmissionPriorApprovalPart6ClassE
  | PostSubmissionPriorApprovalPart7ClassC
  | PostSubmissionPriorApprovalPart7ClassM
  | PostSubmissionPriorApprovalPart9ClassD
  | PostSubmissionPriorApprovalPart11ClassB
  | PostSubmissionPriorApprovalPart14ClassA
  | PostSubmissionPriorApprovalPart14ClassB
  | PostSubmissionPriorApprovalPart14ClassJ
  | PostSubmissionPriorApprovalPart14ClassK
  | PostSubmissionPriorApprovalPart14ClassOA
  | PostSubmissionPriorApprovalPart16ClassA
  | PostSubmissionPriorApprovalPart17
  | PostSubmissionPriorApprovalPart17ClassB
  | PostSubmissionPriorApprovalPart17ClassC
  | PostSubmissionPriorApprovalPart17ClassG
  | PostSubmissionPriorApprovalPart18ClassA
  | PostSubmissionPriorApprovalPart19ClassTA
  | PostSubmissionPriorApprovalPart20ClassA
  | PostSubmissionPriorApprovalPart20ClassAA
  | PostSubmissionPriorApprovalPart20ClassAB
  | PostSubmissionPriorApprovalPart20ClassAC
  | PostSubmissionPriorApprovalPart20ClassAD
  | PostSubmissionPriorApprovalPart20ClassZA
  | PostSubmissionPlanningPermissionFullAdvertConsent
  | PostSubmissionPlanningPermissionFullDemolition
  | PostSubmissionPlanningPermissionFullFastTrackAffordable
  | PostSubmissionPlanningPermissionFullHouseholder
  | PostSubmissionPlanningPermissionFullHouseholderListed
  | PostSubmissionPlanningPermissionFullHouseholderRetrospective
  | PostSubmissionPlanningPermissionFullMinor
  | PostSubmissionPlanningPermissionFullMinorListed
  | PostSubmissionPlanningPermissionFullMinorTechnicalDetails
  | PostSubmissionPlanningPermissionFullMajor
  | PostSubmissionPlanningPermissionFullMajorTechnicalDetails
  | PostSubmissionPlanningPermissionFullMajorTechnicalDetailsWaste
  | PostSubmissionPlanningPermissionFullMajorWaste
  | PostSubmissionPlanningPermissionMineralExtraction
  | PostSubmissionPlanningPermissionOutline
  | PostSubmissionPlanningPermissionOutlineAll
  | PostSubmissionPlanningPermissionOutlineSome
  | PostSubmissionPlanningPermissionOutlineMinor
  | PostSubmissionPlanningPermissionOutlineMinorAll
  | PostSubmissionPlanningPermissionOutlineMinorSome
  | PostSubmissionPlanningPermissionOutlineMajor
  | PostSubmissionPlanningPermissionOutlineMajorAll
  | PostSubmissionPlanningPermissionOutlineMajorAllWaste
  | PostSubmissionPlanningPermissionOutlineMajorSome
  | PostSubmissionPlanningPermissionOutlineMajorSomeWaste
  | PostSubmissionPlanningPermissionPermissionInPrinciple
  | PostSubmissionRightsOfWayOrder
  | PostSubmissionWorksToTreesConsent
  | PostSubmissionWorksToTreesNotice

export const PostSubmissionApplicationSchema: TSchema = Type.Union(
  [
    PostSubmissionAdvertConsentSchema,
    PostSubmissionAmendmentMinorMaterialSchema,
    PostSubmissionAmendmentNonMaterialSchema,
    PostSubmissionApprovalConditionsSchema,
    PostSubmissionApprovalReservedMattersSchema,
    PostSubmissionComplianceConfirmationSchema,
    PostSubmissionEnvironmentalImpactScopingSchema,
    PostSubmissionEnvironmentalImpactScreeningSchema,
    PostSubmissionHazardousSubstanceConsentSchema,
    PostSubmissionHedgerowRemovalNoticeSchema,
    PostSubmissionLandDrainageConsentSchema,
    PostSubmissionLawfulDevelopmentCertificateBreachOfConditionSchema,
    PostSubmissionLawfulDevelopmentCertificateExistingSchema,
    PostSubmissionLawfulDevelopmentCertificateListedBuildingWorksSchema,
    PostSubmissionLawfulDevelopmentCertificateProposedSchema,
    PostSubmissionListedBuildingConsentSchema,
    PostSubmissionNotifyCompletionSchema,
    PostSubmissionObligationDischargeSchema,
    PostSubmissionObligationModifySchema,
    PostSubmissionOnshoreExtractionOilAndGasOtherSchema,
    PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema,
    PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWasteSchema,
    PostSubmissionOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema,
    PostSubmissionOnshoreExtractionOilAndGasReviewSchema,
    PostSubmissionOnshoreExtractionOilAndGasVariationSchema,
    PostSubmissionPriorApprovalPart1ClassASchema,
    PostSubmissionPriorApprovalPart1ClassAASchema,
    PostSubmissionPriorApprovalPart3ClassGSchema,
    PostSubmissionPriorApprovalPart3ClassMSchema,
    PostSubmissionPriorApprovalPart3ClassMASchema,
    PostSubmissionPriorApprovalPart3ClassNSchema,
    PostSubmissionPriorApprovalPart3ClassQSchema,
    PostSubmissionPriorApprovalPart3ClassRSchema,
    PostSubmissionPriorApprovalPart3ClassSSchema,
    PostSubmissionPriorApprovalPart3ClassTSchema,
    PostSubmissionPriorApprovalPart3ClassVSchema,
    PostSubmissionPriorApprovalPart4ClassBBSchema,
    PostSubmissionPriorApprovalPart4ClassBCSchema,
    PostSubmissionPriorApprovalPart4ClassCASchema,
    PostSubmissionPriorApprovalPart4ClassESchema,
    PostSubmissionPriorApprovalPart6Schema,
    PostSubmissionPriorApprovalPart6ClassASchema,
    PostSubmissionPriorApprovalPart6ClassBSchema,
    PostSubmissionPriorApprovalPart6ClassESchema,
    PostSubmissionPriorApprovalPart7ClassCSchema,
    PostSubmissionPriorApprovalPart7ClassMSchema,
    PostSubmissionPriorApprovalPart9ClassDSchema,
    PostSubmissionPriorApprovalPart11ClassBSchema,
    PostSubmissionPriorApprovalPart14ClassASchema,
    PostSubmissionPriorApprovalPart14ClassBSchema,
    PostSubmissionPriorApprovalPart14ClassJSchema,
    PostSubmissionPriorApprovalPart14ClassKSchema,
    PostSubmissionPriorApprovalPart14ClassOASchema,
    PostSubmissionPriorApprovalPart16ClassASchema,
    PostSubmissionPriorApprovalPart17Schema,
    PostSubmissionPriorApprovalPart17ClassBSchema,
    PostSubmissionPriorApprovalPart17ClassCSchema,
    PostSubmissionPriorApprovalPart17ClassGSchema,
    PostSubmissionPriorApprovalPart18ClassASchema,
    PostSubmissionPriorApprovalPart19ClassTASchema,
    PostSubmissionPriorApprovalPart20ClassASchema,
    PostSubmissionPriorApprovalPart20ClassAASchema,
    PostSubmissionPriorApprovalPart20ClassABSchema,
    PostSubmissionPriorApprovalPart20ClassACSchema,
    PostSubmissionPriorApprovalPart20ClassADSchema,
    PostSubmissionPriorApprovalPart20ClassZASchema,
    PostSubmissionPlanningPermissionFullAdvertConsentSchema,
    PostSubmissionPlanningPermissionFullDemolitionSchema,
    PostSubmissionPlanningPermissionFullFastTrackAffordableSchema,
    PostSubmissionPlanningPermissionFullHouseholderSchema,
    PostSubmissionPlanningPermissionFullHouseholderListedSchema,
    PostSubmissionPlanningPermissionFullHouseholderRetrospectiveSchema,
    PostSubmissionPlanningPermissionFullMinorSchema,
    PostSubmissionPlanningPermissionFullMinorListedSchema,
    PostSubmissionPlanningPermissionFullMinorTechnicalDetailsSchema,
    PostSubmissionPlanningPermissionFullMajorSchema,
    PostSubmissionPlanningPermissionFullMajorTechnicalDetailsSchema,
    PostSubmissionPlanningPermissionFullMajorTechnicalDetailsWasteSchema,
    PostSubmissionPlanningPermissionFullMajorWasteSchema,
    PostSubmissionPlanningPermissionMineralExtractionSchema,
    PostSubmissionPlanningPermissionOutlineSchema,
    PostSubmissionPlanningPermissionOutlineAllSchema,
    PostSubmissionPlanningPermissionOutlineSomeSchema,
    PostSubmissionPlanningPermissionOutlineMinorSchema,
    PostSubmissionPlanningPermissionOutlineMinorAllSchema,
    PostSubmissionPlanningPermissionOutlineMinorSomeSchema,
    PostSubmissionPlanningPermissionOutlineMajorSchema,
    PostSubmissionPlanningPermissionOutlineMajorAllSchema,
    PostSubmissionPlanningPermissionOutlineMajorAllWasteSchema,
    PostSubmissionPlanningPermissionOutlineMajorSomeSchema,
    PostSubmissionPlanningPermissionOutlineMajorSomeWasteSchema,
    PostSubmissionPlanningPermissionPermissionInPrincipleSchema,
    PostSubmissionRightsOfWayOrderSchema,
    PostSubmissionWorksToTreesConsentSchema,
    PostSubmissionWorksToTreesNoticeSchema
  ],
  {
    title: 'PostSubmissionApplication',
    description:
      'The root specification for a planning application in England after it has been through a digital planning service and into a back office system'
  }
)
