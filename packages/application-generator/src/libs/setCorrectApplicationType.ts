import type * as PostSubmissionPublishedTypes from 'digital-planning-data-schemas/types/schemas/postSubmissionPublishedApplication/index.js'

export const setCorrectApplicationType = (
  applicationType: string,
  application: PostSubmissionPublishedTypes.PostSubmissionPublishedApplication
) => {
  switch (applicationType) {
    case 'advertConsent':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedAdvertConsent
    case 'amendment.minorMaterial':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedAmendmentMinorMaterial
    case 'amendment.nonMaterial':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedAmendmentNonMaterial
    case 'approval.conditions':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedApprovalConditions
    case 'approval.reservedMatters':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedApprovalReservedMatters
    case 'complianceConfirmation':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedComplianceConfirmation
    case 'environmentalImpact.scoping':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedEnvironmentalImpactScoping
    case 'environmentalImpact.screening':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedEnvironmentalImpactScreening
    case 'hazardousSubstanceConsent':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedHazardousSubstanceConsent
    case 'hedgerowRemovalNotice':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedHedgerowRemovalNotice
    case 'landDrainageConsent':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedLandDrainageConsent
    case 'ldc.breachOfCondition':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedLawfulDevelopmentCertificateBreachOfCondition
    case 'ldc.existing':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedLawfulDevelopmentCertificateExisting
    case 'ldc.listedBuildingWorks':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedLawfulDevelopmentCertificateListedBuildingWorks
    case 'ldc.proposed':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedLawfulDevelopmentCertificateProposed
    case 'listed':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedListedBuildingConsent
    case 'notifyCompletion':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedNotifyCompletion
    case 'obligation.discharge':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedObligationDischarge
    case 'obligation.modify':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedObligationModify
    case 'onshoreExtractionOilAndGas.other':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasOther
    case 'onshoreExtractionOilAndGas.pp.extension':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionExtension
    case 'onshoreExtractionOilAndGas.pp.waste':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWaste
    case 'onshoreExtractionOilAndGas.pp.working':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasPlanningPermissionWorking
    case 'onshoreExtractionOilAndGas.review':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasReview
    case 'onshoreExtractionOilAndGas.variation':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedOnshoreExtractionOilAndGasVariation
    case 'pa.part1.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart1ClassA
    case 'pa.part1.classAA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart1ClassAA
    case 'pa.part3.classG':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassG
    case 'pa.part3.classM':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassM
    case 'pa.part3.classMA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassMA
    case 'pa.part3.classN':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassN
    case 'pa.part3.classQ':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassQ
    case 'pa.part3.classR':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassR
    case 'pa.part3.classS':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassS
    case 'pa.part3.classT':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassT
    case 'pa.part3.classV':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart3ClassV
    case 'pa.part4.classBB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart4ClassBB
    case 'pa.part4.classBC':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart4ClassBC
    case 'pa.part4.classCA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart4ClassCA
    case 'pa.part4.classE':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart4ClassE
    case 'pa.part6':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart6
    case 'pa.part6.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart6ClassA
    case 'pa.part6.classB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart6ClassB
    case 'pa.part6.classE':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart6ClassE
    case 'pa.part7.classC':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart7ClassC
    case 'pa.part7.classM':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart7ClassM
    case 'pa.part9.classD':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart9ClassD
    case 'pa.part11.classB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart11ClassB
    case 'pa.part14.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart14ClassA
    case 'pa.part14.classB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart14ClassB
    case 'pa.part14.classJ':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart14ClassJ
    case 'pa.part14.classK':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart14ClassK
    case 'pa.part14.classOA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart14ClassOA
    case 'pa.part16.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart16ClassA
    case 'pa.part17':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart17
    case 'pa.part17.classB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart17ClassB
    case 'pa.part17.classC':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart17ClassC
    case 'pa.part17.classG':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart17ClassG
    case 'pa.part18.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart18ClassA
    case 'pa.part19.classTA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart19ClassTA
    case 'pa.part20.classA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassA
    case 'pa.part20.classAA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassAA
    case 'pa.part20.classAB':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassAB
    case 'pa.part20.classAC':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassAC
    case 'pa.part20.classAD':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassAD
    case 'pa.part20.classZA':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPriorApprovalPart20ClassZA

    case 'pp.full.advertConsent':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullAdvertConsent
    case 'pp.full.demolition':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullDemolition
    case 'pp.full.fastTrack.affordable':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullFastTrackAffordable
    case 'pp.full.householder':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullHouseholder
    case 'pp.full.householder.listed':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullHouseholderListed
    case 'pp.full.householder.retro':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullHouseholderRetrospective
    case 'pp.full.minor':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMinor
    case 'pp.full.minor.listed':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMinorListed
    case 'pp.full.minor.technicalDetails':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMinorTechnicalDetails
    case 'pp.full.major':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMajor
    case 'pp.full.major.technicalDetails':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetails
    case 'pp.full.major.technicalDetails.waste':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMajorTechnicalDetailsWaste
    case 'pp.full.major.waste':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionFullMajorWaste
    case 'pp.mineralExtraction':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionMineralExtraction
    case 'pp.outline':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutline
    case 'pp.outline.all':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineAll
    case 'pp.outline.some':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineSome
    case 'pp.outline.minor':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMinor
    case 'pp.outline.minor.all':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMinorAll
    case 'pp.outline.minor.some':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMinorSome
    case 'pp.outline.major':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMajor
    case 'pp.outline.major.all':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMajorAll
    case 'pp.outline.major.all.waste':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMajorAllWaste
    case 'pp.outline.major.some':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMajorSome
    case 'pp.outline.major.some.waste':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionOutlineMajorSomeWaste
    case 'pp.pip':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedPlanningPermissionPermissionInPrinciple
    case 'rightsOfWayOrder':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedRightsOfWayOrder
    case 'wtt.consent':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedWorksToTreesConsent
    case 'wtt.notice':
      return application as unknown as PostSubmissionPublishedTypes.PostSubmissionPublishedWorksToTreesNotice
    default:
      throw new Error(`Unknown application type: ${applicationType}`)
  }
}
