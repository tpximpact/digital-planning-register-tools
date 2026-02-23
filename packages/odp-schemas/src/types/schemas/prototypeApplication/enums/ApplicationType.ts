import { Type, type Static } from '@sinclair/typebox'

export type AdvertConsent = Static<typeof AdvertConsentSchema>
const AdvertConsentSchema = Type.Literal('advertConsent', {
  description: 'Consent to display an advertisement'
})

export type Amendment = Static<typeof AmendmentSchema>
const AmendmentSchema = Type.Literal('amendment', {
  description:
    'Consent to make small changes to a project with Planning Permission'
})

export type AmendmentMinorMaterial = Static<typeof AmendmentMinorMaterialSchema>
const AmendmentMinorMaterialSchema = Type.Literal('amendment.minorMaterial', {
  description:
    'Consent to make small (minor material) changes to a project with Planning Permission'
})

export type AmendmentNonMaterial = Static<typeof AmendmentNonMaterialSchema>
const AmendmentNonMaterialSchema = Type.Literal('amendment.nonMaterial', {
  description: 'Consent to make small (non'
})

export type Approval = Static<typeof ApprovalSchema>
const ApprovalSchema = Type.Literal('approval', {
  description: 'Planning approval'
})

export type ApprovalConditions = Static<typeof ApprovalConditionsSchema>
const ApprovalConditionsSchema = Type.Literal('approval.conditions', {
  description: 'Approval of details reserved by condition'
})

export type ApprovalReservedMatters = Static<typeof ApprovalReservedMattersSchema>
const ApprovalReservedMattersSchema = Type.Literal('approval.reservedMatters', {
  description: 'Approval of reserved matters'
})

export type ComplianceConfirmation = Static<typeof ComplianceConfirmationSchema>
const ComplianceConfirmationSchema = Type.Literal('complianceConfirmation', {
  description: 'Written confirmation of compliance with a planning condition'
})

export type EnvironmentalImpact = Static<typeof EnvironmentalImpactSchema>
const EnvironmentalImpactSchema = Type.Literal('environmentalImpact', {
  description: 'Environmental Impact Decision'
})

export type EnvironmentalImpactScoping = Static<
  typeof EnvironmentalImpactScopingSchema
>
const EnvironmentalImpactScopingSchema = Type.Literal(
  'environmentalImpact.scoping',
  {
    description: 'Environmental Impact Decision'
  }
)

export type EnvironmentalImpactScreening = Static<
  typeof EnvironmentalImpactScreeningSchema
>
const EnvironmentalImpactScreeningSchema = Type.Literal(
  'environmentalImpact.screening',
  { description: 'Environmental Impact Decision' }
)

export type HazardousSubstanceConsent = Static<typeof HazardousSubstanceConsentSchema>
const HazardousSubstanceConsentSchema = Type.Literal(
  'hazardousSubstanceConsent',
  {
    description: 'Consent to move and dispose of hazardous substances'
  }
)

export type HedgerowRemovalNotice = Static<typeof HedgerowRemovalNoticeSchema>
const HedgerowRemovalNoticeSchema = Type.Literal('hedgerowRemovalNotice', {
  description: 'Notice to remove a hedge'
})

export type LandDrainageConsent = Static<typeof LandDrainageConsentSchema>
const LandDrainageConsentSchema = Type.Literal('landDrainageConsent', {
  description:
    'Consent to do works affecting ordinary watercourses or land drainage'
})

export type LDC = Static<typeof LDCSchema>
const LDCSchema = Type.Literal('ldc', {
  description: 'Lawful Development Certificate'
})

export type LDCBreachOfCondition = Static<typeof LDCBreachOfConditionSchema>
const LDCBreachOfConditionSchema = Type.Literal('ldc.breachOfCondition', {
  description: 'Lawful Development Certificate'
})

export type LDCExisting = Static<typeof LDCExistingSchema>
const LDCExistingSchema = Type.Literal('ldc.existing', {
  description: 'Lawful Development Certificate'
})

export type LDCListedBuildingWorks = Static<typeof LDCListedBuildingWorksSchema>
const LDCListedBuildingWorksSchema = Type.Literal('ldc.listedBuildingWorks', {
  description: 'Lawful Development Certificate'
})

export type LDCProposed = Static<typeof LDCProposedSchema>
const LDCProposedSchema = Type.Literal('ldc.proposed', {
  description: 'Lawful Development Certificate'
})

export type Listed = Static<typeof ListedSchema>
const ListedSchema = Type.Literal('listed', {
  description: 'Consent to do works to a Listed Building'
})

export type NotifyCompletion = Static<typeof NotifyCompletionSchema>
const NotifyCompletionSchema = Type.Literal('notifyCompletion', {
  description: 'Notification of completion'
})

export type Obligation = Static<typeof ObligationSchema>
const ObligationSchema = Type.Literal('obligation', {
  description: 'Planning obligation'
})

export type ObligationDischarge = Static<typeof ObligationDischargeSchema>
const ObligationDischargeSchema = Type.Literal('obligation.discharge', {
  description: 'Discharge a planning obligation'
})

export type ObligationModify = Static<typeof ObligationModifySchema>
const ObligationModifySchema = Type.Literal('obligation.modify', {
  description: 'Modify a planning obligation'
})

export type OnshoreExtractionOilAndGas = Static<
  typeof OnshoreExtractionOilAndGasSchema
>
const OnshoreExtractionOilAndGasSchema = Type.Literal(
  'onshoreExtractionOilAndGas',
  {
    description: 'Onshore extraction of oil and gas'
  }
)

export type OnshoreExtractionOilAndGasOther = Static<
  typeof OnshoreExtractionOilAndGasOtherSchema
>
const OnshoreExtractionOilAndGasOtherSchema = Type.Literal(
  'onshoreExtractionOilAndGas.other',
  { description: 'Onshore extraction of oil and gas' }
)

export type OnshoreExtractionOilAndGasPPExtension = Static<
  typeof OnshoreExtractionOilAndGasPPExtensionSchema
>
const OnshoreExtractionOilAndGasPPExtensionSchema = Type.Literal(
  'onshoreExtractionOilAndGas.pp.extension',
  { description: 'Onshore extraction of oil and gas' }
)

export type OnshoreExtractionOilAndGasPPWaste = Static<
  typeof OnshoreExtractionOilAndGasPPWasteSchema
>
const OnshoreExtractionOilAndGasPPWasteSchema = Type.Literal(
  'onshoreExtractionOilAndGas.pp.waste',
  { description: 'Onshore extraction of oil and gas' }
)

export type OnshoreExtractionOilAndGasPPWorking = Static<
  typeof OnshoreExtractionOilAndGasPPWorkingSchema
>
const OnshoreExtractionOilAndGasPPWorkingSchema = Type.Literal(
  'onshoreExtractionOilAndGas.pp.working',
  { description: 'Onshore extraction of oil and gas' }
)

export type OnshoreExtractionOilAndGasReview = Static<
  typeof OnshoreExtractionOilAndGasReviewSchema
>
const OnshoreExtractionOilAndGasReviewSchema = Type.Literal(
  'onshoreExtractionOilAndGas.review',
  { description: 'Onshore extraction of oil and gas' }
)

export type OnshoreExtractionOilAndGasVariation = Static<
  typeof OnshoreExtractionOilAndGasVariationSchema
>
const OnshoreExtractionOilAndGasVariationSchema = Type.Literal(
  'onshoreExtractionOilAndGas.variation',
  { description: 'Onshore extraction of oil and gas' }
)

export type PA = Static<typeof PASchema>
const PASchema = Type.Literal('pa', { description: 'Prior Approval' })

export type PAPart1ClassA = Static<typeof PAPart1ClassASchema>
const PAPart1ClassASchema = Type.Literal('pa.part1.classA', {
  description: 'Prior Approval'
})

export type PAPart1ClassAA = Static<typeof PAPart1ClassAASchema>
const PAPart1ClassAASchema = Type.Literal('pa.part1.classAA', {
  description: 'Prior Approval'
})

export type PAPart3ClassG = Static<typeof PAPart3ClassGSchema>
const PAPart3ClassGSchema = Type.Literal('pa.part3.classG', {
  description: 'Prior Approval'
})

export type PAPart3ClassM = Static<typeof PAPart3ClassMSchema>
const PAPart3ClassMSchema = Type.Literal('pa.part3.classM', {
  description: 'Prior Approval'
})

export type PAPart3ClassMA = Static<typeof PAPart3ClassMASchema>
const PAPart3ClassMASchema = Type.Literal('pa.part3.classMA', {
  description: 'Prior Approval'
})

export type PAPart3ClassN = Static<typeof PAPart3ClassNSchema>
const PAPart3ClassNSchema = Type.Literal('pa.part3.classN', {
  description: 'Prior Approval'
})

export type PAPart3ClassQ = Static<typeof PAPart3ClassQSchema>
const PAPart3ClassQSchema = Type.Literal('pa.part3.classQ', {
  description: 'Prior Approval'
})

export type PAPart3ClassR = Static<typeof PAPart3ClassRSchema>
const PAPart3ClassRSchema = Type.Literal('pa.part3.classR', {
  description: 'Prior Approval'
})

export type PAPart3ClassS = Static<typeof PAPart3ClassSSchema>
const PAPart3ClassSSchema = Type.Literal('pa.part3.classS', {
  description: 'Prior Approval'
})

export type PAPart3ClassT = Static<typeof PAPart3ClassTSchema>
const PAPart3ClassTSchema = Type.Literal('pa.part3.classT', {
  description: 'Prior Approval'
})

export type PAPart3ClassV = Static<typeof PAPart3ClassVSchema>
const PAPart3ClassVSchema = Type.Literal('pa.part3.classV', {
  description: 'Prior Approval'
})

export type PAPart4ClassBB = Static<typeof PAPart4ClassBBSchema>
const PAPart4ClassBBSchema = Type.Literal('pa.part4.classBB', {
  description: 'Prior Approval'
})

export type PAPart4ClassBC = Static<typeof PAPart4ClassBCSchema>
const PAPart4ClassBCSchema = Type.Literal('pa.part4.classBC', {
  description: 'Prior Approval'
})

export type PAPart4ClassCA = Static<typeof PAPart4ClassCASchema>
const PAPart4ClassCASchema = Type.Literal('pa.part4.classCA', {
  description: 'Prior Approval'
})

export type PAPart4ClassE = Static<typeof PAPart4ClassESchema>
const PAPart4ClassESchema = Type.Literal('pa.part4.classE', {
  description: 'Prior Approval'
})

export type PAPart6 = Static<typeof PAPart6Schema>
const PAPart6Schema = Type.Literal('pa.part6', {
  description: 'Prior Approval'
})

export type PAPart6ClassA = Static<typeof PAPart6ClassASchema>
const PAPart6ClassASchema = Type.Literal('pa.part6.classA', {
  description: 'Prior Approval'
})

export type PAPart6ClassB = Static<typeof PAPart6ClassBSchema>
const PAPart6ClassBSchema = Type.Literal('pa.part6.classB', {
  description: 'Prior Approval'
})

export type PAPart6ClassE = Static<typeof PAPart6ClassESchema>
const PAPart6ClassESchema = Type.Literal('pa.part6.classE', {
  description: 'Prior Approval'
})

export type PAPart7ClassC = Static<typeof PAPart7ClassCSchema>
const PAPart7ClassCSchema = Type.Literal('pa.part7.classC', {
  description: 'Prior Approval'
})

export type PAPart7ClassM = Static<typeof PAPart7ClassMSchema>
const PAPart7ClassMSchema = Type.Literal('pa.part7.classM', {
  description: 'Prior Approval'
})

export type PAPart9ClassD = Static<typeof PAPart9ClassDSchema>
const PAPart9ClassDSchema = Type.Literal('pa.part9.classD', {
  description: 'Prior Approval'
})

export type PAPart11ClassB = Static<typeof PAPart11ClassBSchema>
const PAPart11ClassBSchema = Type.Literal('pa.part11.classB', {
  description: 'Prior Approval'
})

export type PAPart14ClassA = Static<typeof PAPart14ClassASchema>
const PAPart14ClassASchema = Type.Literal('pa.part14.classA', {
  description: 'Prior Approval'
})

export type PAPart14ClassB = Static<typeof PAPart14ClassBSchema>
const PAPart14ClassBSchema = Type.Literal('pa.part14.classB', {
  description: 'Prior Approval'
})

export type PAPart14ClassJ = Static<typeof PAPart14ClassJSchema>
const PAPart14ClassJSchema = Type.Literal('pa.part14.classJ', {
  description: 'Prior Approval'
})

export type PAPart14ClassK = Static<typeof PAPart14ClassKSchema>
const PAPart14ClassKSchema = Type.Literal('pa.part14.classK', {
  description: 'Prior Approval'
})

export type PAPart14ClassOA = Static<typeof PAPart14ClassOASchema>
const PAPart14ClassOASchema = Type.Literal('pa.part14.classOA', {
  description: 'Prior Approval'
})

export type PAPart16ClassA = Static<typeof PAPart16ClassASchema>
const PAPart16ClassASchema = Type.Literal('pa.part16.classA', {
  description: 'Prior Approval'
})

export type PAPart17 = Static<typeof PAPart17Schema>
const PAPart17Schema = Type.Literal('pa.part17', {
  description: 'Prior Approval'
})

export type PAPart17ClassB = Static<typeof PAPart17ClassBSchema>
const PAPart17ClassBSchema = Type.Literal('pa.part17.classB', {
  description: 'Prior Approval'
})

export type PAPart17ClassC = Static<typeof PAPart17ClassCSchema>
const PAPart17ClassCSchema = Type.Literal('pa.part17.classC', {
  description: 'Prior Approval'
})

export type PAPart17ClassG = Static<typeof PAPart17ClassGSchema>
const PAPart17ClassGSchema = Type.Literal('pa.part17.classG', {
  description: 'Prior Approval'
})

export type PAPart18ClassA = Static<typeof PAPart18ClassASchema>
const PAPart18ClassASchema = Type.Literal('pa.part18.classA', {
  description: 'Prior Approval'
})

export type PAPart19ClassTA = Static<typeof PAPart19ClassTASchema>
const PAPart19ClassTASchema = Type.Literal('pa.part19.classTA', {
  description: 'Prior Approval'
})

export type PAPart20ClassA = Static<typeof PAPart20ClassASchema>
const PAPart20ClassASchema = Type.Literal('pa.part20.classA', {
  description: 'Prior Approval'
})

export type PAPart20ClassAA = Static<typeof PAPart20ClassAASchema>
const PAPart20ClassAASchema = Type.Literal('pa.part20.classAA', {
  description: 'Prior Approval'
})

export type PAPart20ClassAB = Static<typeof PAPart20ClassABSchema>
const PAPart20ClassABSchema = Type.Literal('pa.part20.classAB', {
  description: 'Prior Approval'
})

export type PAPart20ClassAC = Static<typeof PAPart20ClassACSchema>
const PAPart20ClassACSchema = Type.Literal('pa.part20.classAC', {
  description: 'Prior Approval'
})

export type PAPart20ClassAD = Static<typeof PAPart20ClassADSchema>
const PAPart20ClassADSchema = Type.Literal('pa.part20.classAD', {
  description: 'Prior Approval'
})

export type PAPart20ClassZA = Static<typeof PAPart20ClassZASchema>
const PAPart20ClassZASchema = Type.Literal('pa.part20.classZA', {
  description: 'Prior Approval'
})

export type PP = Static<typeof PPSchema>
const PPSchema = Type.Literal('pp', { description: 'Planning Permission' })

export type PPFull = Static<typeof PPFullSchema>
const PPFullSchema = Type.Literal('pp.full', {
  description:
    'Planning Permission for development, including all householder, minor, and major applications'
})

export type PPFullAdvertConsent = Static<typeof PPFullAdvertConsentSchema>
const PPFullAdvertConsentSchema = Type.Literal('pp.full.advertConsent', {
  description: 'Full Planning Permission and consent to display an advert'
})

export type PPFullDemolition = Static<typeof PPFullDemolitionSchema>
const PPFullDemolitionSchema = Type.Literal('pp.full.demolition', {
  description:
    'Full Planning Permission including demolition in a Conservation Area'
})

export type PPFullFastTrackAffordable = Static<typeof PPFullFastTrackAffordableSchema>
const PPFullFastTrackAffordableSchema = Type.Literal(
  'pp.full.fastTrack.affordable',
  {
    description: 'Full Planning Permission'
  }
)

export type PPFullHouseholder = Static<typeof PPFullHouseholderSchema>
const PPFullHouseholderSchema = Type.Literal('pp.full.householder', {
  description: 'Planning Permission'
})

export type PPFullHouseholderListed = Static<typeof PPFullHouseholderListedSchema>
const PPFullHouseholderListedSchema = Type.Literal(
  'pp.full.householder.listed',
  {
    description: 'Planning Permission'
  }
)

export type PPFullHouseholderRetro = Static<typeof PPFullHouseholderRetroSchema>
const PPFullHouseholderRetroSchema = Type.Literal('pp.full.householder.retro', {
  description: 'Planning Permission'
})

export type PPFullMajor = Static<typeof PPFullMajorSchema>
const PPFullMajorSchema = Type.Literal('pp.full.major', {
  description: 'Planning Permission'
})

export type PPFullMajorTechnicalDetails = Static<
  typeof PPFullMajorTechnicalDetailsSchema
>
const PPFullMajorTechnicalDetailsSchema = Type.Literal(
  'pp.full.major.technicalDetails',
  { description: 'Planning Permission' }
)

export type PPFullMajorTechnicalDetailsWaste = Static<
  typeof PPFullMajorTechnicalDetailsWasteSchema
>
const PPFullMajorTechnicalDetailsWasteSchema = Type.Literal(
  'pp.full.major.technicalDetails.waste',
  { description: 'Planning Permission' }
)

export type PPFullMajorWaste = Static<typeof PPFullMajorWasteSchema>
const PPFullMajorWasteSchema = Type.Literal('pp.full.major.waste', {
  description: 'Planning Permission'
})

export type PPFullMinor = Static<typeof PPFullMinorSchema>
const PPFullMinorSchema = Type.Literal('pp.full.minor', {
  description: 'Planning Permission'
})

export type PPFullMinorListed = Static<typeof PPFullMinorListedSchema>
const PPFullMinorListedSchema = Type.Literal('pp.full.minor.listed', {
  description: 'Planning Permission'
})

export type PPFullMinorTechnicalDetails = Static<
  typeof PPFullMinorTechnicalDetailsSchema
>
const PPFullMinorTechnicalDetailsSchema = Type.Literal(
  'pp.full.minor.technicalDetails',
  { description: 'Planning Permission' }
)

export type PPMineralExtraction = Static<typeof PPMineralExtractionSchema>
const PPMineralExtractionSchema = Type.Literal('pp.mineralExtraction', {
  description: 'Planning Permission'
})

export type PPOutline = Static<typeof PPOutlineSchema>
const PPOutlineSchema = Type.Literal('pp.outline', {
  description: 'Planning permission'
})

export type PPOutlineAll = Static<typeof PPOutlineAllSchema>
const PPOutlineAllSchema = Type.Literal('pp.outline.all', {
  description: 'Outline Planning Permission'
})

export type PPOutlineSome = Static<typeof PPOutlineSomeSchema>
const PPOutlineSomeSchema = Type.Literal('pp.outline.some', {
  description: 'Outline Planning Permission'
})

export type PPOutlineMinor = Static<typeof PPOutlineMinorSchema>
const PPOutlineMinorSchema = Type.Literal('pp.outline.minor', {
  description: 'Planning permission'
})

export type PPOutlineMinorAll = Static<typeof PPOutlineMinorAllSchema>
const PPOutlineMinorAllSchema = Type.Literal('pp.outline.minor.all', {
  description: 'Outline Planning Permission'
})

export type PPOutlineMinorSome = Static<typeof PPOutlineMinorSomeSchema>
const PPOutlineMinorSomeSchema = Type.Literal('pp.outline.minor.some', {
  description: 'Outline Planning Permission'
})

export type PPOutlineMajor = Static<typeof PPOutlineMajorSchema>
const PPOutlineMajorSchema = Type.Literal('pp.outline.major', {
  description: 'Planning permission'
})

export type PPOutlineMajorAll = Static<typeof PPOutlineMajorAllSchema>
const PPOutlineMajorAllSchema = Type.Literal('pp.outline.major.all', {
  description: 'Outline Planning Permission'
})

export type PPOutlineMajorAllWaste = Static<typeof PPOutlineMajorAllWasteSchema>
const PPOutlineMajorAllWasteSchema = Type.Literal(
  'pp.outline.major.all.waste',
  {
    description: 'Outline Planning Permission'
  }
)

export type PPOutlineMajorSome = Static<typeof PPOutlineMajorSomeSchema>
const PPOutlineMajorSomeSchema = Type.Literal('pp.outline.major.some', {
  description: 'Outline Planning Permission'
})

export type PPOutlineMajorSomeWaste = Static<typeof PPOutlineMajorSomeWasteSchema>
const PPOutlineMajorSomeWasteSchema = Type.Literal(
  'pp.outline.major.some.waste',
  {
    description: 'Outline Planning Permission'
  }
)

export type PPPip = Static<typeof PPPipSchema>
const PPPipSchema = Type.Literal('pp.pip', {
  description: 'Planning Permission in Principle'
})

export type RightsOfWayOrder = Static<typeof RightsOfWayOrderSchema>
const RightsOfWayOrderSchema = Type.Literal('rightsOfWayOrder', {
  description: 'Rights of Way Order'
})

export type WTT = Static<typeof WTTSchema>
const WTTSchema = Type.Literal('wtt', { description: 'Works to trees' })

export type WTTConsent = Static<typeof WTTConsentSchema>
const WTTConsentSchema = Type.Literal('wtt.consent', {
  description:
    'Consent to carry out works to a tree with a Tree Preservation Order'
})

export type WTTNotice = Static<typeof WTTNoticeSchema>
const WTTNoticeSchema = Type.Literal('wtt.notice', {
  description: 'Notification of proposed works to a tree in a Conservation Area'
})

export type ApplicationType = Static<typeof ApplicationTypeSchema>
export const ApplicationTypeSchema = Type.Union(
  [
    AdvertConsentSchema,
    AmendmentSchema,
    AmendmentMinorMaterialSchema,
    AmendmentNonMaterialSchema,
    ApprovalSchema,
    ApprovalConditionsSchema,
    ApprovalReservedMattersSchema,
    ComplianceConfirmationSchema,
    EnvironmentalImpactSchema,
    EnvironmentalImpactScopingSchema,
    EnvironmentalImpactScreeningSchema,
    HazardousSubstanceConsentSchema,
    HedgerowRemovalNoticeSchema,
    LandDrainageConsentSchema,
    LDCSchema,
    LDCBreachOfConditionSchema,
    LDCExistingSchema,
    LDCListedBuildingWorksSchema,
    LDCProposedSchema,
    ListedSchema,
    NotifyCompletionSchema,
    ObligationSchema,
    ObligationDischargeSchema,
    ObligationModifySchema,
    OnshoreExtractionOilAndGasSchema,
    OnshoreExtractionOilAndGasOtherSchema,
    OnshoreExtractionOilAndGasPPExtensionSchema,
    OnshoreExtractionOilAndGasPPWasteSchema,
    OnshoreExtractionOilAndGasPPWorkingSchema,
    OnshoreExtractionOilAndGasReviewSchema,
    OnshoreExtractionOilAndGasVariationSchema,
    PASchema,
    PAPart1ClassASchema,
    PAPart1ClassAASchema,
    PAPart3ClassGSchema,
    PAPart3ClassMSchema,
    PAPart3ClassMASchema,
    PAPart3ClassNSchema,
    PAPart3ClassQSchema,
    PAPart3ClassRSchema,
    PAPart3ClassSSchema,
    PAPart3ClassTSchema,
    PAPart3ClassVSchema,
    PAPart4ClassBBSchema,
    PAPart4ClassBCSchema,
    PAPart4ClassCASchema,
    PAPart4ClassESchema,
    PAPart6Schema,
    PAPart6ClassASchema,
    PAPart6ClassBSchema,
    PAPart6ClassESchema,
    PAPart7ClassCSchema,
    PAPart7ClassMSchema,
    PAPart9ClassDSchema,
    PAPart11ClassBSchema,
    PAPart14ClassASchema,
    PAPart14ClassBSchema,
    PAPart14ClassJSchema,
    PAPart14ClassKSchema,
    PAPart14ClassOASchema,
    PAPart16ClassASchema,
    PAPart17Schema,
    PAPart17ClassBSchema,
    PAPart17ClassCSchema,
    PAPart17ClassGSchema,
    PAPart18ClassASchema,
    PAPart19ClassTASchema,
    PAPart20ClassASchema,
    PAPart20ClassAASchema,
    PAPart20ClassABSchema,
    PAPart20ClassACSchema,
    PAPart20ClassADSchema,
    PAPart20ClassZASchema,
    PPSchema,
    PPFullSchema,
    PPFullAdvertConsentSchema,
    PPFullDemolitionSchema,
    PPFullFastTrackAffordableSchema,
    PPFullHouseholderSchema,
    PPFullHouseholderListedSchema,
    PPFullHouseholderRetroSchema,
    PPFullMajorSchema,
    PPFullMajorTechnicalDetailsSchema,
    PPFullMajorTechnicalDetailsWasteSchema,
    PPFullMajorWasteSchema,
    PPFullMinorSchema,
    PPFullMinorListedSchema,
    PPFullMinorTechnicalDetailsSchema,
    PPMineralExtractionSchema,
    PPOutlineSchema,
    PPOutlineAllSchema,
    PPOutlineSomeSchema,
    PPOutlineMinorSchema,
    PPOutlineMinorAllSchema,
    PPOutlineMinorSomeSchema,
    PPOutlineMajorSchema,
    PPOutlineMajorAllSchema,
    PPOutlineMajorAllWasteSchema,
    PPOutlineMajorSomeSchema,
    PPOutlineMajorSomeWasteSchema,
    PPPipSchema,
    RightsOfWayOrderSchema,
    WTTSchema,
    WTTConsentSchema,
    WTTNoticeSchema
  ],
  { id: '#ApplicationType', description: 'Planning application types' }
)

// Get all literal values from ApplicationType
const allValues: string[] = Array.isArray(ApplicationTypeSchema.anyOf)
  ? ApplicationTypeSchema.anyOf.map((type) => type.const as string)
  : []

// Extract primary keys (first segment before '.')
const primaryKeys: string[] = Array.from(
  new Set(
    allValues
      .map((v) => (typeof v === 'string' ? v.split('.')[0] : undefined))
      .filter((k): k is string => !!k)
  )
)

export type PrimaryApplicationType = Static<typeof PrimaryApplicationTypeSchema>
export const PrimaryApplicationTypeSchema = Type.Union(
  primaryKeys.map((k) => Type.Literal(k)),
  {
    title: 'Primary application type',
    description: 'The first segment of the application type hierarchical code'
  }
)
