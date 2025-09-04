export interface ClientConfig {
  id: number
  name: string
  slug: string | null
  endpoint: string
  lastPolledAt: string | null
  updatedAt: string
  createdAt: string
}

/**
 * Fetches the configuration for a given council from the admin service.
 */
export async function getCouncilConfig(
  council: string
): Promise<ClientConfig | null> {
  try {
    const response = await fetch(
      `${process.env.ADMIN_API_URL}/api/internal/clients/${council}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`
        }
      }
    )
    console.log(response, 'response from admin service')

    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Admin service returned status ${response.status}`)
    }

    const config: ClientConfig = await response.json()

    return config
  } catch (error) {
    console.error(
      `Failed to fetch config for ${council} from admin service:`,
      error
    )
    return null
  }
}
