import type { ApplicationStatus } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/ApplicationStatus.d.ts'
import type { ProcessStage } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/ProcessStage.d.ts'

export const getApplicationStatesByStage = (
  applicationStage: ProcessStage
): ApplicationStatus[] => {
  switch (applicationStage) {
    case 'submission':
      return ['undetermined']
    case 'validation':
      return ['returned', 'undetermined']
    case 'consultation':
      return ['withdrawn', 'undetermined']
    case 'assessment':
      return ['withdrawn', 'undetermined', 'determined']
    case 'appeal':
      return ['determined']
    case 'highCourtAppeal':
      return ['determined']
  }
}
