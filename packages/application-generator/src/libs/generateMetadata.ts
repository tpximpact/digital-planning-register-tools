import type { PostSubmissionMetadata } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/Metadata.d.ts'
import {
  generateAllPossibleDates,
  type PossibleDates
} from './generateAllPossibleDates'

export const generateMetadata = (
  dates?: PossibleDates
): PostSubmissionMetadata => {
  if (!dates) {
    dates = generateAllPossibleDates()
  }
  const metadata: PostSubmissionMetadata = {
    organisation: 'BOPS',
    id: '1234',
    generatedAt: dates.generatedAt.toISOString(),
    submittedAt: dates.submission.submittedAt.toISOString(),
    schema: `https://theopensystemslab.github.io/digital-planning-data-schemas/@next/schemas/postSubmissionApplication.json`
  }
  return metadata
}
