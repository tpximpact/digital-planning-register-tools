export interface Client {
  id: number
  name: string
  slug?: string | null
  endpoint: string
  lastPolledAt?: Date | null
  updatedAt: Date
  createdAt: Date
}
