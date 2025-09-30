import type { PrimaryApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.d.ts'

/**
 * Utility class that checks if a value is a valid PrimaryApplicationType
 * @param value
 * @returns
 */
export const isValidPrimaryApplicationType = (
  value: string
): value is PrimaryApplicationType => {
  return Object.keys(primaryApplicationTypeTitles).includes(value)
}

/**
 * pp.part1.classA = pp = Planning Permission
 * Maps the primary application type eg the pp in pp.part1.classA to its display title eg Planning Permission
 * @TODO should this be moved to the schema or is this unique enough to the DPR?
 * https://github.com/theopensystemslab/digital-planning-data-schemas/blob/main/types/schemas/prototypeApplication/enums/ApplicationType.d.ts
 */
const primaryApplicationTypeTitles: Record<PrimaryApplicationType, string> = {
  advertConsent: 'Advertisement consent',
  amendment: 'Amendment',
  approval: 'Approval',
  complianceConfirmation: 'Compliance Confirmation',
  environmentalImpact: 'Environmental impact',
  hazardousSubstanceConsent: 'Hazardous substance consent',
  hedgerowRemovalNotice: 'Hedgerow removal notice',
  landDrainageConsent: 'Land drainage consent',
  ldc: 'Lawful development certificate',
  listed: 'Listed building consent',
  notifyCompletion: 'Notification of completion',
  obligation: 'Planning obligation',
  onshoreExtractionOilAndGas: 'Onshore extraction of oil and gas',
  pa: 'Prior approval',
  pp: 'Planning permission',
  rightsOfWayOrder: 'Rights of way order',
  wtt: 'Works to trees'
}
