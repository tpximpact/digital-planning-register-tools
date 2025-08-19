export interface Client {
  id: number
  name: string
  endpoint: string
  lastPolledAt?: Date | null
  updatedAt: Date
  createdAt: Date
}
