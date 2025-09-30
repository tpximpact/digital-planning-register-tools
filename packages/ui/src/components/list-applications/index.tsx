interface Applications {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ListApplicationsProps {
  items: Applications[]
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
