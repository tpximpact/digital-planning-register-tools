import type { PostSubmissionPlanningApplication } from '@dpr/api/schemas'

export const generateApplications = (
  count = 50
): PostSubmissionPlanningApplication[] => {
  const now = new Date().toISOString()
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Application ${i + 1}`,
    createdAt: now,
    updatedAt: now
    // Add other fields as needed for your schema
  }))
}
