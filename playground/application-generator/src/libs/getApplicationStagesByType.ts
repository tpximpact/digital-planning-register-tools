import type { ProcessStage } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/ProcessStage.js'
import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.js'

export const getApplicationStagesByType = (
  applicationType: ApplicationType
): ProcessStage[] => {
  const validStages = new Set<ProcessStage>([
    'submission',
    'validation',
    'consultation',
    'assessment',
    'appeal'
    // "highCourtAppeal",
  ])

  if (applicationType === 'ldc') {
    validStages.delete('consultation')
  }

  return Array.from(validStages)
}
