import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import {
  PublicCommentsRedactedSchema,
  SpecialistCommentsRedactedSchema
} from '../postSubmissionApplication/data/Comment'
import { PostSubmissionApplicationSpecificationGenerator } from '../postSubmissionApplication'
import { PostSubmissionFileRedactedSchema } from '../postSubmissionApplication/data/File'

export const PostSubmissionPublishedApplicationSpecificationGenerator = <
  T extends TSchema
>(
  T: T
) =>
  Type.Intersect([
    Type.Omit(PostSubmissionApplicationSpecificationGenerator(T), [
      'comments',
      'files'
    ]),
    Type.Object({
      comments: Type.Optional(
        Type.Object({
          public: Type.Optional(PublicCommentsRedactedSchema),
          specialist: Type.Optional(SpecialistCommentsRedactedSchema)
        })
      ),
      files: Type.Optional(Type.Array(PostSubmissionFileRedactedSchema))
    })
  ])

// export type PostSubmissionPublishedPlanningPermissionFullHouseholder = Static<
//   typeof PostSubmissionPublishedPlanningPermissionFullHouseholder
// Schema>
// export const PostSubmissionPublishedPlanningPermissionFullHouseholder =
//   PostSubmissionPublishedApplicationSpecificationGenerator(
//     Type.Literal('pp.full.householder')
//   )

// export type PostSubmissionPublishedApplication = Static<
//   typeof PostSubmissionPublishedApplication
// Schema>
// export const PostSubmissionPublishedApplication =
//   PostSubmissionPublishedPlanningPermissionFullHouseholder

////

export type PostSubmissionPublishedAdvertConsent = Static<
  typeof PostSubmissionPublishedAdvertConsentSchema
>
export const PostSubmissionPublishedAdvertConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('advertConsent')
  )

export type PostSubmissionPublishedAmendmentMinorMaterial = Static<
  typeof PostSubmissionPublishedAmendmentMinorMaterialSchema
>
export const PostSubmissionPublishedAmendmentMinorMaterialSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('amendment.minorMaterial')
  )

export type PostSubmissionPublishedAmendmentNonMaterial = Static<
  typeof PostSubmissionPublishedAmendmentNonMaterialSchema
>
export const PostSubmissionPublishedAmendmentNonMaterialSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('amendment.nonMaterial')
  )

export type PostSubmissionPublishedApprovalConditions = Static<
  typeof PostSubmissionPublishedApprovalConditionsSchema
>
export const PostSubmissionPublishedApprovalConditionsSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('approval.conditions')
  )

export type PostSubmissionPublishedApprovalReservedMatters = Static<
  typeof PostSubmissionPublishedApprovalReservedMattersSchema
>
export const PostSubmissionPublishedApprovalReservedMattersSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('approval.reservedMatters')
  )

export type PostSubmissionPublishedComplianceConfirmation = Static<
  typeof PostSubmissionPublishedComplianceConfirmationSchema
>
export const PostSubmissionPublishedComplianceConfirmationSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('complianceConfirmation')
  )

export type PostSubmissionPublishedEnvironmentalImpactScoping = Static<
  typeof PostSubmissionPublishedEnvironmentalImpactScopingSchema
>
export const PostSubmissionPublishedEnvironmentalImpactScopingSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('environmentalImpact.scoping')
  )

export type PostSubmissionPublishedEnvironmentalImpactScreening = Static<
  typeof PostSubmissionPublishedEnvironmentalImpactScreeningSchema
>
export const PostSubmissionPublishedEnvironmentalImpactScreeningSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('environmentalImpact.screening')
  )

export type PostSubmissionPublishedHazardousSubstanceConsent = Static<
  typeof PostSubmissionPublishedHazardousSubstanceConsentSchema
>
export const PostSubmissionPublishedHazardousSubstanceConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('hazardousSubstanceConsent')
  )

export type PostSubmissionPublishedHedgerowRemovalNotice = Static<
  typeof PostSubmissionPublishedHedgerowRemovalNoticeSchema
>
export const PostSubmissionPublishedHedgerowRemovalNoticeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('hedgerowRemovalNotice')
  )

export type PostSubmissionPublishedLandDrainageConsent = Static<
  typeof PostSubmissionPublishedLandDrainageConsentSchema
>
export const PostSubmissionPublishedLandDrainageConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('landDrainageConsent')
  )

export type PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfCondition =
  Static<
    typeof PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfConditionSchema
  >
export const PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfConditionSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('ldc.breachOfCondition')
  )

export type PostSubmissionPublishedLawfulDevelopmentCertificateExisting =
  Static<
    typeof PostSubmissionPublishedLawfulDevelopmentCertificateExistingSchema
  >
export const PostSubmissionPublishedLawfulDevelopmentCertificateExistingSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('ldc.existing')
  )

export type PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorks =
  Static<
    typeof PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorksSchema
  >
export const PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorksSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('ldc.listedBuildingWorks')
  )

export type PostSubmissionPublishedLawfulDevelopmentCertificateProposed =
  Static<
    typeof PostSubmissionPublishedLawfulDevelopmentCertificateProposedSchema
  >
export const PostSubmissionPublishedLawfulDevelopmentCertificateProposedSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('ldc.proposed')
  )

export type PostSubmissionPublishedListedBuildingConsent = Static<
  typeof PostSubmissionPublishedListedBuildingConsentSchema
>
export const PostSubmissionPublishedListedBuildingConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('listed')
  )

export type PostSubmissionPublishedNotifyCompletion = Static<
  typeof PostSubmissionPublishedNotifyCompletionSchema
>
export const PostSubmissionPublishedNotifyCompletionSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('notifyCompletion')
  )

export type PostSubmissionPublishedObligationDischarge = Static<
  typeof PostSubmissionPublishedObligationDischargeSchema
>
export const PostSubmissionPublishedObligationDischargeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('obligation.discharge')
  )

export type PostSubmissionPublishedObligationModify = Static<
  typeof PostSubmissionPublishedObligationModifySchema
>
export const PostSubmissionPublishedObligationModifySchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('obligation.modify')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasOther = Static<
  typeof PostSubmissionPublishedOnshoreExtractionOilAndGasOtherSchema
>
export const PostSubmissionPublishedOnshoreExtractionOilAndGasOtherSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.other')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtension =
  Static<
    typeof PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema
  >
export const PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.extension')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWaste =
  Static<
    typeof PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWasteSchema
  >
export const PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWasteSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.waste')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorking =
  Static<
    typeof PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema
  >
export const PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.pp.working')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasReview = Static<
  typeof PostSubmissionPublishedOnshoreExtractionOilAndGasReviewSchema
>
export const PostSubmissionPublishedOnshoreExtractionOilAndGasReviewSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.review')
  )

export type PostSubmissionPublishedOnshoreExtractionOilAndGasVariation = Static<
  typeof PostSubmissionPublishedOnshoreExtractionOilAndGasVariationSchema
>
export const PostSubmissionPublishedOnshoreExtractionOilAndGasVariationSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('onshoreExtractionOilAndGas.variation')
  )

export type PostSubmissionPublishedPriorApprovalPart1ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart1ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart1ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part1.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart1ClassAA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart1ClassAASchema
>
export const PostSubmissionPublishedPriorApprovalPart1ClassAASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part1.classAA')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassG = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassGSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassGSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classG')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassM = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassMSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassMSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classM')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassMA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassMASchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassMASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classMA')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassN = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassNSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassNSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classN')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassQ = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassQSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassQSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classQ')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassR = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassRSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassRSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classR')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassS = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassSSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassSSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classS')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassT = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassTSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassTSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classT')
  )

export type PostSubmissionPublishedPriorApprovalPart3ClassV = Static<
  typeof PostSubmissionPublishedPriorApprovalPart3ClassVSchema
>
export const PostSubmissionPublishedPriorApprovalPart3ClassVSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part3.classV')
  )

export type PostSubmissionPublishedPriorApprovalPart4ClassBB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart4ClassBBSchema
>
export const PostSubmissionPublishedPriorApprovalPart4ClassBBSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classBB')
  )

export type PostSubmissionPublishedPriorApprovalPart4ClassBC = Static<
  typeof PostSubmissionPublishedPriorApprovalPart4ClassBCSchema
>
export const PostSubmissionPublishedPriorApprovalPart4ClassBCSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classBC')
  )

export type PostSubmissionPublishedPriorApprovalPart4ClassCA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart4ClassCASchema
>
export const PostSubmissionPublishedPriorApprovalPart4ClassCASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classCA')
  )

export type PostSubmissionPublishedPriorApprovalPart4ClassE = Static<
  typeof PostSubmissionPublishedPriorApprovalPart4ClassESchema
>
export const PostSubmissionPublishedPriorApprovalPart4ClassESchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part4.classE')
  )

export type PostSubmissionPublishedPriorApprovalPart6 = Static<
  typeof PostSubmissionPublishedPriorApprovalPart6Schema
>
export const PostSubmissionPublishedPriorApprovalPart6Schema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part6')
  )

export type PostSubmissionPublishedPriorApprovalPart6ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart6ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart6ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart6ClassB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart6ClassBSchema
>
export const PostSubmissionPublishedPriorApprovalPart6ClassBSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classB')
  )

export type PostSubmissionPublishedPriorApprovalPart6ClassE = Static<
  typeof PostSubmissionPublishedPriorApprovalPart6ClassESchema
>
export const PostSubmissionPublishedPriorApprovalPart6ClassESchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part6.classE')
  )

export type PostSubmissionPublishedPriorApprovalPart7ClassC = Static<
  typeof PostSubmissionPublishedPriorApprovalPart7ClassCSchema
>
export const PostSubmissionPublishedPriorApprovalPart7ClassCSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part7.classC')
  )

export type PostSubmissionPublishedPriorApprovalPart7ClassM = Static<
  typeof PostSubmissionPublishedPriorApprovalPart7ClassMSchema
>
export const PostSubmissionPublishedPriorApprovalPart7ClassMSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part7.classM')
  )

export type PostSubmissionPublishedPriorApprovalPart9ClassD = Static<
  typeof PostSubmissionPublishedPriorApprovalPart9ClassDSchema
>
export const PostSubmissionPublishedPriorApprovalPart9ClassDSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part9.classD')
  )

export type PostSubmissionPublishedPriorApprovalPart11ClassB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart11ClassBSchema
>
export const PostSubmissionPublishedPriorApprovalPart11ClassBSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part11.classB')
  )

export type PostSubmissionPublishedPriorApprovalPart14ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart14ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart14ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart14ClassB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart14ClassBSchema
>
export const PostSubmissionPublishedPriorApprovalPart14ClassBSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classB')
  )

export type PostSubmissionPublishedPriorApprovalPart14ClassJ = Static<
  typeof PostSubmissionPublishedPriorApprovalPart14ClassJSchema
>
export const PostSubmissionPublishedPriorApprovalPart14ClassJSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classJ')
  )

export type PostSubmissionPublishedPriorApprovalPart14ClassK = Static<
  typeof PostSubmissionPublishedPriorApprovalPart14ClassKSchema
>
export const PostSubmissionPublishedPriorApprovalPart14ClassKSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classK')
  )

export type PostSubmissionPublishedPriorApprovalPart14ClassOA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart14ClassOASchema
>
export const PostSubmissionPublishedPriorApprovalPart14ClassOASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part14.classOA')
  )

export type PostSubmissionPublishedPriorApprovalPart16ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart16ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart16ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part16.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart17 = Static<
  typeof PostSubmissionPublishedPriorApprovalPart17Schema
>
export const PostSubmissionPublishedPriorApprovalPart17Schema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part17')
  )

export type PostSubmissionPublishedPriorApprovalPart17ClassB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart17ClassBSchema
>
export const PostSubmissionPublishedPriorApprovalPart17ClassBSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classB')
  )

export type PostSubmissionPublishedPriorApprovalPart17ClassC = Static<
  typeof PostSubmissionPublishedPriorApprovalPart17ClassCSchema
>
export const PostSubmissionPublishedPriorApprovalPart17ClassCSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classC')
  )

export type PostSubmissionPublishedPriorApprovalPart17ClassG = Static<
  typeof PostSubmissionPublishedPriorApprovalPart17ClassGSchema
>
export const PostSubmissionPublishedPriorApprovalPart17ClassGSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part17.classG')
  )

export type PostSubmissionPublishedPriorApprovalPart18ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart18ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart18ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part18.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart19ClassTA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart19ClassTASchema
>
export const PostSubmissionPublishedPriorApprovalPart19ClassTASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part19.classTA')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassASchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classA')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassAA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassAASchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassAASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAA')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassAB = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassABSchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassABSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAB')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassAC = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassACSchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassACSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAC')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassAD = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassADSchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassADSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classAD')
  )

export type PostSubmissionPublishedPriorApprovalPart20ClassZA = Static<
  typeof PostSubmissionPublishedPriorApprovalPart20ClassZASchema
>
export const PostSubmissionPublishedPriorApprovalPart20ClassZASchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pa.part20.classZA')
  )

export type PostSubmissionPublishedPlanningPermissionFullAdvertConsent = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullAdvertConsentSchema
>
export const PostSubmissionPublishedPlanningPermissionFullAdvertConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.advertConsent')
  )

export type PostSubmissionPublishedPlanningPermissionFullDemolition = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullDemolitionSchema
>
export const PostSubmissionPublishedPlanningPermissionFullDemolitionSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.demolition')
  )

export type PostSubmissionPublishedPlanningPermissionFullFastTrackAffordable =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullFastTrackAffordableSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullFastTrackAffordableSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.fastTrack.affordable')
  )

export type PostSubmissionPublishedPlanningPermissionFullHouseholder = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullHouseholderSchema
>
export const PostSubmissionPublishedPlanningPermissionFullHouseholderSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder')
  )

export type PostSubmissionPublishedPlanningPermissionFullHouseholderListed =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullHouseholderListedSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullHouseholderListedSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder.listed')
  )

export type PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospective =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospectiveSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospectiveSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.householder.retro')
  )

export type PostSubmissionPublishedPlanningPermissionFullMinor = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullMinorSchema
>
export const PostSubmissionPublishedPlanningPermissionFullMinorSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.minor')
  )

export type PostSubmissionPublishedPlanningPermissionFullMinorListed = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullMinorListedSchema
>
export const PostSubmissionPublishedPlanningPermissionFullMinorListedSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.minor.listed')
  )

export type PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetails =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetailsSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetailsSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.minor.technicalDetails')
  )

export type PostSubmissionPublishedPlanningPermissionFullMajor = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullMajorSchema
>
export const PostSubmissionPublishedPlanningPermissionFullMajorSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.major')
  )

export type PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetails =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.technicalDetails')
  )

export type PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWaste =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWasteSchema
  >
export const PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWasteSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.technicalDetails.waste')
  )

export type PostSubmissionPublishedPlanningPermissionFullMajorWaste = Static<
  typeof PostSubmissionPublishedPlanningPermissionFullMajorWasteSchema
>
export const PostSubmissionPublishedPlanningPermissionFullMajorWasteSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.full.major.waste')
  )

export type PostSubmissionPublishedPlanningPermissionMineralExtraction = Static<
  typeof PostSubmissionPublishedPlanningPermissionMineralExtractionSchema
>
export const PostSubmissionPublishedPlanningPermissionMineralExtractionSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.mineralExtraction')
  )

export type PostSubmissionPublishedPlanningPermissionOutline = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineAll = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineAllSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineAllSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.all')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineSome = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineSomeSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineSomeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.some')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMinor = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMinorSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMinorSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMinorAll = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMinorAllSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMinorAllSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor.all')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMinorSome = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMinorSomeSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMinorSomeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.minor.some')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMajor = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMajorSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMajorSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMajorAll = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMajorAllSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMajorAllSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.all')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMajorAllWaste =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionOutlineMajorAllWasteSchema
  >
export const PostSubmissionPublishedPlanningPermissionOutlineMajorAllWasteSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.all.waste')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMajorSome = Static<
  typeof PostSubmissionPublishedPlanningPermissionOutlineMajorSomeSchema
>
export const PostSubmissionPublishedPlanningPermissionOutlineMajorSomeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.some')
  )

export type PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWaste =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWasteSchema
  >
export const PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWasteSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.outline.major.some.waste')
  )

export type PostSubmissionPublishedPlanningPermissionPermissionInPrinciple =
  Static<
    typeof PostSubmissionPublishedPlanningPermissionPermissionInPrincipleSchema
  >
export const PostSubmissionPublishedPlanningPermissionPermissionInPrincipleSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('pp.pip')
  )

export type PostSubmissionPublishedRightsOfWayOrder = Static<
  typeof PostSubmissionPublishedRightsOfWayOrderSchema
>
export const PostSubmissionPublishedRightsOfWayOrderSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('rightsOfWayOrder')
  )

export type PostSubmissionPublishedWorksToTreesConsent = Static<
  typeof PostSubmissionPublishedWorksToTreesConsentSchema
>
export const PostSubmissionPublishedWorksToTreesConsentSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('wtt.consent')
  )

export type PostSubmissionPublishedWorksToTreesNotice = Static<
  typeof PostSubmissionPublishedWorksToTreesNoticeSchema
>
export const PostSubmissionPublishedWorksToTreesNoticeSchema =
  PostSubmissionPublishedApplicationSpecificationGenerator(
    Type.Literal('wtt.notice')
  )

export type PostSubmissionPublishedApplication =
  | PostSubmissionPublishedAdvertConsent
  | PostSubmissionPublishedAmendmentMinorMaterial
  | PostSubmissionPublishedAmendmentNonMaterial
  | PostSubmissionPublishedApprovalConditions
  | PostSubmissionPublishedApprovalReservedMatters
  | PostSubmissionPublishedComplianceConfirmation
  | PostSubmissionPublishedEnvironmentalImpactScoping
  | PostSubmissionPublishedEnvironmentalImpactScreening
  | PostSubmissionPublishedHazardousSubstanceConsent
  | PostSubmissionPublishedHedgerowRemovalNotice
  | PostSubmissionPublishedLandDrainageConsent
  | PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfCondition
  | PostSubmissionPublishedLawfulDevelopmentCertificateExisting
  | PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorks
  | PostSubmissionPublishedLawfulDevelopmentCertificateProposed
  | PostSubmissionPublishedListedBuildingConsent
  | PostSubmissionPublishedNotifyCompletion
  | PostSubmissionPublishedObligationDischarge
  | PostSubmissionPublishedObligationModify
  | PostSubmissionPublishedOnshoreExtractionOilAndGasOther
  | PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtension
  | PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWaste
  | PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorking
  | PostSubmissionPublishedOnshoreExtractionOilAndGasReview
  | PostSubmissionPublishedOnshoreExtractionOilAndGasVariation
  | PostSubmissionPublishedPriorApprovalPart1ClassA
  | PostSubmissionPublishedPriorApprovalPart1ClassAA
  | PostSubmissionPublishedPriorApprovalPart3ClassG
  | PostSubmissionPublishedPriorApprovalPart3ClassM
  | PostSubmissionPublishedPriorApprovalPart3ClassMA
  | PostSubmissionPublishedPriorApprovalPart3ClassN
  | PostSubmissionPublishedPriorApprovalPart3ClassQ
  | PostSubmissionPublishedPriorApprovalPart3ClassR
  | PostSubmissionPublishedPriorApprovalPart3ClassS
  | PostSubmissionPublishedPriorApprovalPart3ClassT
  | PostSubmissionPublishedPriorApprovalPart3ClassV
  | PostSubmissionPublishedPriorApprovalPart4ClassBB
  | PostSubmissionPublishedPriorApprovalPart4ClassBC
  | PostSubmissionPublishedPriorApprovalPart4ClassCA
  | PostSubmissionPublishedPriorApprovalPart4ClassE
  | PostSubmissionPublishedPriorApprovalPart6
  | PostSubmissionPublishedPriorApprovalPart6ClassA
  | PostSubmissionPublishedPriorApprovalPart6ClassB
  | PostSubmissionPublishedPriorApprovalPart6ClassE
  | PostSubmissionPublishedPriorApprovalPart7ClassC
  | PostSubmissionPublishedPriorApprovalPart7ClassM
  | PostSubmissionPublishedPriorApprovalPart9ClassD
  | PostSubmissionPublishedPriorApprovalPart11ClassB
  | PostSubmissionPublishedPriorApprovalPart14ClassA
  | PostSubmissionPublishedPriorApprovalPart14ClassB
  | PostSubmissionPublishedPriorApprovalPart14ClassJ
  | PostSubmissionPublishedPriorApprovalPart14ClassK
  | PostSubmissionPublishedPriorApprovalPart14ClassOA
  | PostSubmissionPublishedPriorApprovalPart16ClassA
  | PostSubmissionPublishedPriorApprovalPart17
  | PostSubmissionPublishedPriorApprovalPart17ClassB
  | PostSubmissionPublishedPriorApprovalPart17ClassC
  | PostSubmissionPublishedPriorApprovalPart17ClassG
  | PostSubmissionPublishedPriorApprovalPart18ClassA
  | PostSubmissionPublishedPriorApprovalPart19ClassTA
  | PostSubmissionPublishedPriorApprovalPart20ClassA
  | PostSubmissionPublishedPriorApprovalPart20ClassAA
  | PostSubmissionPublishedPriorApprovalPart20ClassAB
  | PostSubmissionPublishedPriorApprovalPart20ClassAC
  | PostSubmissionPublishedPriorApprovalPart20ClassAD
  | PostSubmissionPublishedPriorApprovalPart20ClassZA
  | PostSubmissionPublishedPlanningPermissionFullAdvertConsent
  | PostSubmissionPublishedPlanningPermissionFullDemolition
  | PostSubmissionPublishedPlanningPermissionFullFastTrackAffordable
  | PostSubmissionPublishedPlanningPermissionFullHouseholder
  | PostSubmissionPublishedPlanningPermissionFullHouseholderListed
  | PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospective
  | PostSubmissionPublishedPlanningPermissionFullMinor
  | PostSubmissionPublishedPlanningPermissionFullMinorListed
  | PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetails
  | PostSubmissionPublishedPlanningPermissionFullMajor
  | PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetails
  | PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWaste
  | PostSubmissionPublishedPlanningPermissionFullMajorWaste
  | PostSubmissionPublishedPlanningPermissionMineralExtraction
  | PostSubmissionPublishedPlanningPermissionOutline
  | PostSubmissionPublishedPlanningPermissionOutlineAll
  | PostSubmissionPublishedPlanningPermissionOutlineSome
  | PostSubmissionPublishedPlanningPermissionOutlineMinor
  | PostSubmissionPublishedPlanningPermissionOutlineMinorAll
  | PostSubmissionPublishedPlanningPermissionOutlineMinorSome
  | PostSubmissionPublishedPlanningPermissionOutlineMajor
  | PostSubmissionPublishedPlanningPermissionOutlineMajorAll
  | PostSubmissionPublishedPlanningPermissionOutlineMajorAllWaste
  | PostSubmissionPublishedPlanningPermissionOutlineMajorSome
  | PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWaste
  | PostSubmissionPublishedPlanningPermissionPermissionInPrinciple
  | PostSubmissionPublishedRightsOfWayOrder
  | PostSubmissionPublishedWorksToTreesConsent
  | PostSubmissionPublishedWorksToTreesNotice

export const PostSubmissionPublishedApplicationSchema: TSchema = Type.Union(
  [
    PostSubmissionPublishedAdvertConsentSchema,
    PostSubmissionPublishedAmendmentMinorMaterialSchema,
    PostSubmissionPublishedAmendmentNonMaterialSchema,
    PostSubmissionPublishedApprovalConditionsSchema,
    PostSubmissionPublishedApprovalReservedMattersSchema,
    PostSubmissionPublishedComplianceConfirmationSchema,
    PostSubmissionPublishedEnvironmentalImpactScopingSchema,
    PostSubmissionPublishedEnvironmentalImpactScreeningSchema,
    PostSubmissionPublishedHazardousSubstanceConsentSchema,
    PostSubmissionPublishedHedgerowRemovalNoticeSchema,
    PostSubmissionPublishedLandDrainageConsentSchema,
    PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfConditionSchema,
    PostSubmissionPublishedLawfulDevelopmentCertificateExistingSchema,
    PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorksSchema,
    PostSubmissionPublishedLawfulDevelopmentCertificateProposedSchema,
    PostSubmissionPublishedListedBuildingConsentSchema,
    PostSubmissionPublishedNotifyCompletionSchema,
    PostSubmissionPublishedObligationDischargeSchema,
    PostSubmissionPublishedObligationModifySchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasOtherSchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtensionSchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWasteSchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorkingSchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasReviewSchema,
    PostSubmissionPublishedOnshoreExtractionOilAndGasVariationSchema,
    PostSubmissionPublishedPriorApprovalPart1ClassASchema,
    PostSubmissionPublishedPriorApprovalPart1ClassAASchema,
    PostSubmissionPublishedPriorApprovalPart3ClassGSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassMSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassMASchema,
    PostSubmissionPublishedPriorApprovalPart3ClassNSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassQSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassRSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassSSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassTSchema,
    PostSubmissionPublishedPriorApprovalPart3ClassVSchema,
    PostSubmissionPublishedPriorApprovalPart4ClassBBSchema,
    PostSubmissionPublishedPriorApprovalPart4ClassBCSchema,
    PostSubmissionPublishedPriorApprovalPart4ClassCASchema,
    PostSubmissionPublishedPriorApprovalPart4ClassESchema,
    PostSubmissionPublishedPriorApprovalPart6Schema,
    PostSubmissionPublishedPriorApprovalPart6ClassASchema,
    PostSubmissionPublishedPriorApprovalPart6ClassBSchema,
    PostSubmissionPublishedPriorApprovalPart6ClassESchema,
    PostSubmissionPublishedPriorApprovalPart7ClassCSchema,
    PostSubmissionPublishedPriorApprovalPart7ClassMSchema,
    PostSubmissionPublishedPriorApprovalPart9ClassDSchema,
    PostSubmissionPublishedPriorApprovalPart11ClassBSchema,
    PostSubmissionPublishedPriorApprovalPart14ClassASchema,
    PostSubmissionPublishedPriorApprovalPart14ClassBSchema,
    PostSubmissionPublishedPriorApprovalPart14ClassJSchema,
    PostSubmissionPublishedPriorApprovalPart14ClassKSchema,
    PostSubmissionPublishedPriorApprovalPart14ClassOASchema,
    PostSubmissionPublishedPriorApprovalPart16ClassASchema,
    PostSubmissionPublishedPriorApprovalPart17Schema,
    PostSubmissionPublishedPriorApprovalPart17ClassBSchema,
    PostSubmissionPublishedPriorApprovalPart17ClassCSchema,
    PostSubmissionPublishedPriorApprovalPart17ClassGSchema,
    PostSubmissionPublishedPriorApprovalPart18ClassASchema,
    PostSubmissionPublishedPriorApprovalPart19ClassTASchema,
    PostSubmissionPublishedPriorApprovalPart20ClassASchema,
    PostSubmissionPublishedPriorApprovalPart20ClassAASchema,
    PostSubmissionPublishedPriorApprovalPart20ClassABSchema,
    PostSubmissionPublishedPriorApprovalPart20ClassACSchema,
    PostSubmissionPublishedPriorApprovalPart20ClassADSchema,
    PostSubmissionPublishedPriorApprovalPart20ClassZASchema,
    PostSubmissionPublishedPlanningPermissionFullAdvertConsentSchema,
    PostSubmissionPublishedPlanningPermissionFullDemolitionSchema,
    PostSubmissionPublishedPlanningPermissionFullFastTrackAffordableSchema,
    PostSubmissionPublishedPlanningPermissionFullHouseholderSchema,
    PostSubmissionPublishedPlanningPermissionFullHouseholderListedSchema,
    PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospectiveSchema,
    PostSubmissionPublishedPlanningPermissionFullMinorSchema,
    PostSubmissionPublishedPlanningPermissionFullMinorListedSchema,
    PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetailsSchema,
    PostSubmissionPublishedPlanningPermissionFullMajorSchema,
    PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsSchema,
    PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWasteSchema,
    PostSubmissionPublishedPlanningPermissionFullMajorWasteSchema,
    PostSubmissionPublishedPlanningPermissionMineralExtractionSchema,
    PostSubmissionPublishedPlanningPermissionOutlineSchema,
    PostSubmissionPublishedPlanningPermissionOutlineAllSchema,
    PostSubmissionPublishedPlanningPermissionOutlineSomeSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMinorSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMinorAllSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMinorSomeSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMajorSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMajorAllSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMajorAllWasteSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMajorSomeSchema,
    PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWasteSchema,
    PostSubmissionPublishedPlanningPermissionPermissionInPrincipleSchema,
    PostSubmissionPublishedRightsOfWayOrderSchema,
    PostSubmissionPublishedWorksToTreesConsentSchema,
    PostSubmissionPublishedWorksToTreesNoticeSchema
  ],
  {
    title: 'PostSubmissionPublishedApplication',
    description:
      'The root specification for a planning application in England after it has been through a digital planning service and into a back office system'
  }
)
