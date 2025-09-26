import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.js'
import { isValidPrimaryApplicationType } from './isValidPrimaryApplicationType'

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
  if (type && isValidPrimaryApplicationType(type)) {
    return type || undefined
  }
}
