import { type PostSubmissionPlanningApplication } from '@dpr/api/schemas'

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
