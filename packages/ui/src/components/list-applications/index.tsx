import { type PostSubmissionPlanningApplication } from '@apps/server-api/schemas'

export interface ListApplicationsProps {
  items: PostSubmissionPlanningApplication[]
}

export function ListApplications({ items }: ListApplicationsProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
