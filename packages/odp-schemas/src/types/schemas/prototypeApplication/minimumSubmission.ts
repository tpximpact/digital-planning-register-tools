import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
// import { Applicant } from './data/Applicant'
import '../../shared/formats'

/**
 * This is generating the minimal things the DPR needs and uses right now in its interface
 */
export type Application<T extends TSchema> = Static<
  ReturnType<typeof ApplicationSchema<T>>
>
export const ApplicationSchema = <T extends TSchema>(T: T) =>
  Type.Object(
    {
      // applicationType: T,
      data: Type.Object(
        {
          // This should check Applicant but we're mostly handling it being missing already in the DPR
          applicant: Type.Optional(Type.Any()),
          property: Type.Object(
            {
              address: Type.Any(),
              boundary: Type.Optional(
                Type.Object(
                  {
                    site: Type.Any()
                  },
                  { additionalProperties: true }
                )
              )
            },
            { additionalProperties: true }
          ),
          proposal: Type.Object(
            {
              description: Type.String(),
              reason: Type.Optional(Type.String())
            },
            {
              additionalProperties: true
            }
          )
        },
        { additionalProperties: true }
      ),
      metadata: Type.Object(
        {
          submittedAt: Type.String({ format: 'date-time' })
        },
        {
          additionalProperties: true
        }
      )
    },
    { additionalProperties: true }
  )

export type PlanXPreAssessment = Static<typeof PlanXPreAssessmentSchema>
export const PlanXPreAssessmentSchema = Type.Object(
  {
    preAssessment: Type.Array(
      Type.Object({
        value: Type.String(),
        description: Type.String()
      })
    )
  },
  {
    title: 'PlanX pre',
    description:
      'The result of the application based on information provided by the user, prior to assessment by a planning officer'
  }
)

export type AdvertConsent = Static<typeof AdvertConsentSchema>
export const AdvertConsentSchema = ApplicationSchema(
  Type.Literal('advertConsent')
)

export type AmendmentMinorMaterial = Static<typeof AmendmentMinorMaterialSchema>
export const AmendmentMinorMaterialSchema = ApplicationSchema(
  Type.Literal('amendment.minorMaterial')
)

export type AmendmentNonMaterial = Static<typeof AmendmentNonMaterialSchema>
export const AmendmentNonMaterialSchema = ApplicationSchema(
  Type.Literal('amendment.nonMaterial')
)

export type ApprovalConditions = Static<typeof ApprovalConditionsSchema>
export const ApprovalConditionsSchema = ApplicationSchema(
  Type.Literal('approval.conditions')
)

export type ApprovalReservedMatters = Static<
  typeof ApprovalReservedMattersSchema
>
export const ApprovalReservedMattersSchema = ApplicationSchema(
  Type.Literal('approval.reservedMatters')
)

export type ComplianceConfirmation = Static<typeof ComplianceConfirmationSchema>
export const ComplianceConfirmationSchema = ApplicationSchema(
  Type.Literal('complianceConfirmation')
)

export type EnvironmentalImpactScoping = Static<
  typeof EnvironmentalImpactScopingSchema
>
export const EnvironmentalImpactScopingSchema = ApplicationSchema(
  Type.Literal('environmentalImpact.scoping')
)

export type EnvironmentalImpactScreening = Static<
  typeof EnvironmentalImpactScreeningSchema
>
export const EnvironmentalImpactScreeningSchema = ApplicationSchema(
  Type.Literal('environmentalImpact.screening')
)

export type HazardousSubstanceConsent = Static<
  typeof HazardousSubstanceConsentSchema
>
export const HazardousSubstanceConsentSchema = ApplicationSchema(
  Type.Literal('hazardousSubstanceConsent')
)

export type HedgerowRemovalNotice = Static<typeof HedgerowRemovalNoticeSchema>
export const HedgerowRemovalNoticeSchema = ApplicationSchema(
  Type.Literal('hedgerowRemovalNotice')
)

export type LandDrainageConsent = Static<typeof LandDrainageConsentSchema>
export const LandDrainageConsentSchema = ApplicationSchema(
  Type.Literal('landDrainageConsent')
)

export type LawfulDevelopmentCertificateBreachOfCondition = Static<
  typeof LawfulDevelopmentCertificateBreachOfConditionSchema
>
export const LawfulDevelopmentCertificateBreachOfConditionSchema =
  ApplicationSchema(Type.Literal('ldc.breachOfCondition'))

export type LawfulDevelopmentCertificateExisting = Static<
  typeof LawfulDevelopmentCertificateExistingSchema
>
export const LawfulDevelopmentCertificateExistingSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('ldc.existing')),
  PlanXPreAssessmentSchema
])

export type LawfulDevelopmentCertificateListedBuildingWorks = Static<
  typeof LawfulDevelopmentCertificateListedBuildingWorksSchema
>
export const LawfulDevelopmentCertificateListedBuildingWorksSchema =
  ApplicationSchema(Type.Literal('ldc.listedBuildingWorks'))

export type LawfulDevelopmentCertificateProposed = Static<
  typeof LawfulDevelopmentCertificateProposedSchema
>
export const LawfulDevelopmentCertificateProposedSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('ldc.proposed')),
  PlanXPreAssessmentSchema
])

export type ListedBuildingConsent = Static<typeof ListedBuildingConsentSchema>
export const ListedBuildingConsentSchema = ApplicationSchema(
  Type.Literal('listed')
)

export type NotifyCompletion = Static<typeof NotifyCompletionSchema>
export const NotifyCompletionSchema = ApplicationSchema(
  Type.Literal('notifyCompletion')
)

export type ObligationDischarge = Static<typeof ObligationDischargeSchema>
export const ObligationDischargeSchema = ApplicationSchema(
  Type.Literal('obligation.discharge')
)

export type ObligationModify = Static<typeof ObligationModifySchema>
export const ObligationModifySchema = ApplicationSchema(
  Type.Literal('obligation.modify')
)

export type OnshoreExtractionOilAndGasOther = Static<
  typeof OnshoreExtractionOilAndGasOtherSchema
>
export const OnshoreExtractionOilAndGasOtherSchema = ApplicationSchema(
  Type.Literal('onshoreExtractionOilAndGas.other')
)

export type OnshoreExtractionOilAndGasPlanningPermissionExtension = Static<
  typeof OnshoreExtractionOilAndGasPlanningPermissionExtensionSchema
>
export const OnshoreExtractionOilAndGasPlanningPermissionExtensionSchema =
  ApplicationSchema(Type.Literal('onshoreExtractionOilAndGas.pp.extension'))

export type OnshoreExtractionOilAndGasPlanningPermissionWaste = Static<
  typeof OnshoreExtractionOilAndGasPlanningPermissionWasteSchema
>
export const OnshoreExtractionOilAndGasPlanningPermissionWasteSchema =
  ApplicationSchema(Type.Literal('onshoreExtractionOilAndGas.pp.waste'))

export type OnshoreExtractionOilAndGasPlanningPermissionWorking = Static<
  typeof OnshoreExtractionOilAndGasPlanningPermissionWorkingSchema
>
export const OnshoreExtractionOilAndGasPlanningPermissionWorkingSchema =
  ApplicationSchema(Type.Literal('onshoreExtractionOilAndGas.pp.working'))

export type OnshoreExtractionOilAndGasReview = Static<
  typeof OnshoreExtractionOilAndGasReviewSchema
>
export const OnshoreExtractionOilAndGasReviewSchema = ApplicationSchema(
  Type.Literal('onshoreExtractionOilAndGas.review')
)

export type OnshoreExtractionOilAndGasVariation = Static<
  typeof OnshoreExtractionOilAndGasVariationSchema
>
export const OnshoreExtractionOilAndGasVariationSchema = ApplicationSchema(
  Type.Literal('onshoreExtractionOilAndGas.variation')
)

export type PriorApprovalPart1ClassA = Static<
  typeof PriorApprovalPart1ClassASchema
>
export const PriorApprovalPart1ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part1.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart1ClassAA = Static<
  typeof PriorApprovalPart1ClassAASchema
>
export const PriorApprovalPart1ClassAASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part1.classAA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassG = Static<
  typeof PriorApprovalPart3ClassGSchema
>
export const PriorApprovalPart3ClassGSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classG')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassM = Static<
  typeof PriorApprovalPart3ClassMSchema
>
export const PriorApprovalPart3ClassMSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classM')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassMA = Static<
  typeof PriorApprovalPart3ClassMASchema
>
export const PriorApprovalPart3ClassMASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classMA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassN = Static<
  typeof PriorApprovalPart3ClassNSchema
>
export const PriorApprovalPart3ClassNSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classN')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassQ = Static<
  typeof PriorApprovalPart3ClassQSchema
>
export const PriorApprovalPart3ClassQSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classQ')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassR = Static<
  typeof PriorApprovalPart3ClassRSchema
>
export const PriorApprovalPart3ClassRSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classR')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassS = Static<
  typeof PriorApprovalPart3ClassSSchema
>
export const PriorApprovalPart3ClassSSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classS')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassT = Static<
  typeof PriorApprovalPart3ClassTSchema
>
export const PriorApprovalPart3ClassTSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classT')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart3ClassV = Static<
  typeof PriorApprovalPart3ClassVSchema
>
export const PriorApprovalPart3ClassVSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part3.classV')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart4ClassBB = Static<
  typeof PriorApprovalPart4ClassBBSchema
>
export const PriorApprovalPart4ClassBBSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part4.classBB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart4ClassBC = Static<
  typeof PriorApprovalPart4ClassBCSchema
>
export const PriorApprovalPart4ClassBCSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part4.classBC')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart4ClassCA = Static<
  typeof PriorApprovalPart4ClassCASchema
>
export const PriorApprovalPart4ClassCASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part4.classCA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart4ClassE = Static<
  typeof PriorApprovalPart4ClassESchema
>
export const PriorApprovalPart4ClassESchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part4.classE')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart6 = Static<typeof PriorApprovalPart6Schema>
export const PriorApprovalPart6Schema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part6')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart6ClassA = Static<
  typeof PriorApprovalPart6ClassASchema
>
export const PriorApprovalPart6ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part6.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart6ClassB = Static<
  typeof PriorApprovalPart6ClassBSchema
>
export const PriorApprovalPart6ClassBSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part6.classB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart6ClassE = Static<
  typeof PriorApprovalPart6ClassESchema
>
export const PriorApprovalPart6ClassESchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part6.classE')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart7ClassC = Static<
  typeof PriorApprovalPart7ClassCSchema
>
export const PriorApprovalPart7ClassCSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part7.classC')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart7ClassM = Static<
  typeof PriorApprovalPart7ClassMSchema
>
export const PriorApprovalPart7ClassMSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part7.classM')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart9ClassD = Static<
  typeof PriorApprovalPart9ClassDSchema
>
export const PriorApprovalPart9ClassDSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part9.classD')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart11ClassB = Static<
  typeof PriorApprovalPart11ClassBSchema
>
export const PriorApprovalPart11ClassBSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part11.classB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart14ClassA = Static<
  typeof PriorApprovalPart14ClassASchema
>
export const PriorApprovalPart14ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part14.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart14ClassB = Static<
  typeof PriorApprovalPart14ClassBSchema
>
export const PriorApprovalPart14ClassBSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part14.classB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart14ClassJ = Static<
  typeof PriorApprovalPart14ClassJSchema
>
export const PriorApprovalPart14ClassJSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part14.classJ')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart14ClassK = Static<
  typeof PriorApprovalPart14ClassKSchema
>
export const PriorApprovalPart14ClassKSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part14.classK')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart14ClassOA = Static<
  typeof PriorApprovalPart14ClassOASchema
>
export const PriorApprovalPart14ClassOASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part14.classOA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart16ClassA = Static<
  typeof PriorApprovalPart16ClassASchema
>
export const PriorApprovalPart16ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part16.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart17 = Static<typeof PriorApprovalPart17Schema>
export const PriorApprovalPart17Schema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part17')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart17ClassB = Static<
  typeof PriorApprovalPart17ClassBSchema
>
export const PriorApprovalPart17ClassBSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part17.classB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart17ClassC = Static<
  typeof PriorApprovalPart17ClassCSchema
>
export const PriorApprovalPart17ClassCSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part17.classC')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart17ClassG = Static<
  typeof PriorApprovalPart17ClassGSchema
>
export const PriorApprovalPart17ClassGSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part17.classG')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart18ClassA = Static<
  typeof PriorApprovalPart18ClassASchema
>
export const PriorApprovalPart18ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part18.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart19ClassTA = Static<
  typeof PriorApprovalPart19ClassTASchema
>
export const PriorApprovalPart19ClassTASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part19.classTA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassA = Static<
  typeof PriorApprovalPart20ClassASchema
>
export const PriorApprovalPart20ClassASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassAA = Static<
  typeof PriorApprovalPart20ClassAASchema
>
export const PriorApprovalPart20ClassAASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classAA')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassAB = Static<
  typeof PriorApprovalPart20ClassABSchema
>
export const PriorApprovalPart20ClassABSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classAB')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassAC = Static<
  typeof PriorApprovalPart20ClassACSchema
>
export const PriorApprovalPart20ClassACSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classAC')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassAD = Static<
  typeof PriorApprovalPart20ClassADSchema
>
export const PriorApprovalPart20ClassADSchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classAD')),
  PlanXPreAssessmentSchema
])

export type PriorApprovalPart20ClassZA = Static<
  typeof PriorApprovalPart20ClassZASchema
>
export const PriorApprovalPart20ClassZASchema = Type.Intersect([
  ApplicationSchema(Type.Literal('pa.part20.classZA')),
  PlanXPreAssessmentSchema
])

export type PlanningPermissionFullAdvertConsent = Static<
  typeof PlanningPermissionFullAdvertConsentSchema
>
export const PlanningPermissionFullAdvertConsentSchema = ApplicationSchema(
  Type.Literal('pp.full.advertConsent')
)

export type PlanningPermissionFullDemolition = Static<
  typeof PlanningPermissionFullDemolitionSchema
>
export const PlanningPermissionFullDemolitionSchema = ApplicationSchema(
  Type.Literal('pp.full.demolition')
)

export type PlanningPermissionFullFastTrackAffordable = Static<
  typeof PlanningPermissionFullFastTrackAffordableSchema
>
export const PlanningPermissionFullFastTrackAffordableSchema =
  ApplicationSchema(Type.Literal('pp.full.fastTrack.affordable'))

export type PlanningPermissionFullHouseholder = Static<
  typeof PlanningPermissionFullHouseholderSchema
>
export const PlanningPermissionFullHouseholderSchema = ApplicationSchema(
  Type.Literal('pp.full.householder')
)

export type PlanningPermissionFullHouseholderListed = Static<
  typeof PlanningPermissionFullHouseholderListedSchema
>
export const PlanningPermissionFullHouseholderListedSchema = ApplicationSchema(
  Type.Literal('pp.full.householder.listed')
)

export type PlanningPermissionFullHouseholderRetrospective = Static<
  typeof PlanningPermissionFullHouseholderRetrospectiveSchema
>
export const PlanningPermissionFullHouseholderRetrospectiveSchema =
  ApplicationSchema(Type.Literal('pp.full.householder.retro'))

export type PlanningPermissionFullMinor = Static<
  typeof PlanningPermissionFullMinorSchema
>
export const PlanningPermissionFullMinorSchema = ApplicationSchema(
  Type.Literal('pp.full.minor')
)

export type PlanningPermissionFullMinorListed = Static<
  typeof PlanningPermissionFullMinorListedSchema
>
export const PlanningPermissionFullMinorListedSchema = ApplicationSchema(
  Type.Literal('pp.full.minor.listed')
)

export type PlanningPermissionFullMinorTechnicalDetails = Static<
  typeof PlanningPermissionFullMinorTechnicalDetailsSchema
>
export const PlanningPermissionFullMinorTechnicalDetailsSchema =
  ApplicationSchema(Type.Literal('pp.full.minor.technicalDetails'))

export type PlanningPermissionFullMajor = Static<
  typeof PlanningPermissionFullMajorSchema
>
export const PlanningPermissionFullMajorSchema = ApplicationSchema(
  Type.Literal('pp.full.major')
)

export type PlanningPermissionFullMajorTechnicalDetails = Static<
  typeof PlanningPermissionFullMajorTechnicalDetailsSchema
>
export const PlanningPermissionFullMajorTechnicalDetailsSchema =
  ApplicationSchema(Type.Literal('pp.full.major.technicalDetails'))

export type PlanningPermissionFullMajorTechnicalDetailsWaste = Static<
  typeof PlanningPermissionFullMajorTechnicalDetailsWasteSchema
>
export const PlanningPermissionFullMajorTechnicalDetailsWasteSchema =
  ApplicationSchema(Type.Literal('pp.full.major.technicalDetails.waste'))

export type PlanningPermissionFullMajorWaste = Static<
  typeof PlanningPermissionFullMajorWasteSchema
>
export const PlanningPermissionFullMajorWasteSchema = ApplicationSchema(
  Type.Literal('pp.full.major.waste')
)

export type PlanningPermissionMineralExtraction = Static<
  typeof PlanningPermissionMineralExtractionSchema
>
export const PlanningPermissionMineralExtractionSchema = ApplicationSchema(
  Type.Literal('pp.mineralExtraction')
)

export type PlanningPermissionOutline = Static<
  typeof PlanningPermissionOutlineSchema
>
export const PlanningPermissionOutlineSchema = ApplicationSchema(
  Type.Literal('pp.outline')
)

export type PlanningPermissionOutlineAll = Static<
  typeof PlanningPermissionOutlineAllSchema
>
export const PlanningPermissionOutlineAllSchema = ApplicationSchema(
  Type.Literal('pp.outline.all')
)

export type PlanningPermissionOutlineSome = Static<
  typeof PlanningPermissionOutlineSomeSchema
>
export const PlanningPermissionOutlineSomeSchema = ApplicationSchema(
  Type.Literal('pp.outline.some')
)

export type PlanningPermissionOutlineMinor = Static<
  typeof PlanningPermissionOutlineMinorSchema
>
export const PlanningPermissionOutlineMinorSchema = ApplicationSchema(
  Type.Literal('pp.outline.minor')
)

export type PlanningPermissionOutlineMinorAll = Static<
  typeof PlanningPermissionOutlineMinorAllSchema
>
export const PlanningPermissionOutlineMinorAllSchema = ApplicationSchema(
  Type.Literal('pp.outline.minor.all')
)

export type PlanningPermissionOutlineMinorSome = Static<
  typeof PlanningPermissionOutlineMinorSomeSchema
>
export const PlanningPermissionOutlineMinorSomeSchema = ApplicationSchema(
  Type.Literal('pp.outline.minor.some')
)

export type PlanningPermissionOutlineMajor = Static<
  typeof PlanningPermissionOutlineMajorSchema
>
export const PlanningPermissionOutlineMajorSchema = ApplicationSchema(
  Type.Literal('pp.outline.major')
)

export type PlanningPermissionOutlineMajorAll = Static<
  typeof PlanningPermissionOutlineMajorAllSchema
>
export const PlanningPermissionOutlineMajorAllSchema = ApplicationSchema(
  Type.Literal('pp.outline.major.all')
)

export type PlanningPermissionOutlineMajorAllWaste = Static<
  typeof PlanningPermissionOutlineMajorAllWasteSchema
>
export const PlanningPermissionOutlineMajorAllWasteSchema = ApplicationSchema(
  Type.Literal('pp.outline.major.all.waste')
)

export type PlanningPermissionOutlineMajorSome = Static<
  typeof PlanningPermissionOutlineMajorSomeSchema
>
export const PlanningPermissionOutlineMajorSomeSchema = ApplicationSchema(
  Type.Literal('pp.outline.major.some')
)

export type PlanningPermissionOutlineMajorSomeWaste = Static<
  typeof PlanningPermissionOutlineMajorSomeWasteSchema
>
export const PlanningPermissionOutlineMajorSomeWasteSchema = ApplicationSchema(
  Type.Literal('pp.outline.major.some.waste')
)

export type PlanningPermissionPermissionInPrinciple = Static<
  typeof PlanningPermissionPermissionInPrincipleSchema
>
export const PlanningPermissionPermissionInPrincipleSchema = ApplicationSchema(
  Type.Literal('pp.pip')
)

export type RightsOfWayOrder = Static<typeof RightsOfWayOrderSchema>
export const RightsOfWayOrderSchema = ApplicationSchema(
  Type.Literal('rightsOfWayOrder')
)

export type WorksToTreesConsent = Static<typeof WorksToTreesConsentSchema>
export const WorksToTreesConsentSchema = ApplicationSchema(
  Type.Literal('wtt.consent')
)

export type WorksToTreesNotice = Static<typeof WorksToTreesNoticeSchema>
export const WorksToTreesNoticeSchema = ApplicationSchema(
  Type.Literal('wtt.notice')
)

export type PrototypeApplication = Static<typeof PrototypeApplicationSchema>
export const PrototypeApplicationSchema = Type.Union(
  [
    AdvertConsentSchema,
    AmendmentMinorMaterialSchema,
    AmendmentNonMaterialSchema,
    ApprovalConditionsSchema,
    ApprovalReservedMattersSchema,
    ComplianceConfirmationSchema,
    EnvironmentalImpactScopingSchema,
    EnvironmentalImpactScreeningSchema,
    HazardousSubstanceConsentSchema,
    HedgerowRemovalNoticeSchema,
    LandDrainageConsentSchema,
    LawfulDevelopmentCertificateBreachOfConditionSchema,
    LawfulDevelopmentCertificateExistingSchema,
    LawfulDevelopmentCertificateListedBuildingWorksSchema,
    LawfulDevelopmentCertificateProposedSchema,
    ListedBuildingConsentSchema,
    NotifyCompletionSchema,
    ObligationDischargeSchema,
    ObligationModifySchema,
    OnshoreExtractionOilAndGasOtherSchema,
    OnshoreExtractionOilAndGasPlanningPermissionExtensionSchema,
    OnshoreExtractionOilAndGasPlanningPermissionWasteSchema,
    OnshoreExtractionOilAndGasPlanningPermissionWorkingSchema,
    OnshoreExtractionOilAndGasReviewSchema,
    OnshoreExtractionOilAndGasVariationSchema,
    PriorApprovalPart1ClassASchema,
    PriorApprovalPart1ClassAASchema,
    PriorApprovalPart3ClassGSchema,
    PriorApprovalPart3ClassMSchema,
    PriorApprovalPart3ClassMASchema,
    PriorApprovalPart3ClassNSchema,
    PriorApprovalPart3ClassQSchema,
    PriorApprovalPart3ClassRSchema,
    PriorApprovalPart3ClassSSchema,
    PriorApprovalPart3ClassTSchema,
    PriorApprovalPart3ClassVSchema,
    PriorApprovalPart4ClassBBSchema,
    PriorApprovalPart4ClassBCSchema,
    PriorApprovalPart4ClassCASchema,
    PriorApprovalPart4ClassESchema,
    PriorApprovalPart6Schema,
    PriorApprovalPart6ClassASchema,
    PriorApprovalPart6ClassBSchema,
    PriorApprovalPart6ClassESchema,
    PriorApprovalPart7ClassCSchema,
    PriorApprovalPart7ClassMSchema,
    PriorApprovalPart9ClassDSchema,
    PriorApprovalPart11ClassBSchema,
    PriorApprovalPart14ClassASchema,
    PriorApprovalPart14ClassBSchema,
    PriorApprovalPart14ClassJSchema,
    PriorApprovalPart14ClassKSchema,
    PriorApprovalPart14ClassOASchema,
    PriorApprovalPart16ClassASchema,
    PriorApprovalPart17Schema,
    PriorApprovalPart17ClassBSchema,
    PriorApprovalPart17ClassCSchema,
    PriorApprovalPart17ClassGSchema,
    PriorApprovalPart18ClassASchema,
    PriorApprovalPart19ClassTASchema,
    PriorApprovalPart20ClassASchema,
    PriorApprovalPart20ClassAASchema,
    PriorApprovalPart20ClassABSchema,
    PriorApprovalPart20ClassACSchema,
    PriorApprovalPart20ClassADSchema,
    PriorApprovalPart20ClassZASchema,
    PlanningPermissionFullAdvertConsentSchema,
    PlanningPermissionFullDemolitionSchema,
    PlanningPermissionFullFastTrackAffordableSchema,
    PlanningPermissionFullHouseholderSchema,
    PlanningPermissionFullHouseholderListedSchema,
    PlanningPermissionFullHouseholderRetrospectiveSchema,
    PlanningPermissionFullMinorSchema,
    PlanningPermissionFullMinorListedSchema,
    PlanningPermissionFullMinorTechnicalDetailsSchema,
    PlanningPermissionFullMajorSchema,
    PlanningPermissionFullMajorTechnicalDetailsSchema,
    PlanningPermissionFullMajorTechnicalDetailsWasteSchema,
    PlanningPermissionFullMajorWasteSchema,
    PlanningPermissionMineralExtractionSchema,
    PlanningPermissionOutlineSchema,
    PlanningPermissionOutlineAllSchema,
    PlanningPermissionOutlineSomeSchema,
    PlanningPermissionOutlineMinorSchema,
    PlanningPermissionOutlineMinorAllSchema,
    PlanningPermissionOutlineMinorSomeSchema,
    PlanningPermissionOutlineMajorSchema,
    PlanningPermissionOutlineMajorAllSchema,
    PlanningPermissionOutlineMajorAllWasteSchema,
    PlanningPermissionOutlineMajorSomeSchema,
    PlanningPermissionOutlineMajorSomeWasteSchema,
    PlanningPermissionPermissionInPrincipleSchema,
    RightsOfWayOrderSchema,
    WorksToTreesConsentSchema,
    WorksToTreesNoticeSchema
  ],
  {
    title: 'PrototypeApplication',
    description:
      'The (prototype) root specification for a planning application in England generated by a digital planning service'
  }
)
