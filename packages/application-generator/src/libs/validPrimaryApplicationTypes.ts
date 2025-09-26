import type { PrimaryApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.js'

/**
 * List of valid primary application types based on PrimaryApplicationType
 */
export const validPrimaryApplicationTypes: PrimaryApplicationType[] = [
  'advertConsent',
  'amendment',
  'approval',
  'complianceConfirmation',
  'environmentalImpact',
  'hazardousSubstanceConsent',
  'hedgerowRemovalNotice',
  'landDrainageConsent',
  'ldc',
  'listed',
  'notifyCompletion',
  'obligation',
  'onshoreExtractionOilAndGas',
  'pa',
  'pp',
  'rightsOfWayOrder',
  'wtt'
]
