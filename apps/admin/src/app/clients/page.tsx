import { ClientsTable } from '../../components/ClientsTable'
import type { Client } from '../../types/types'
import { getClients } from './actions'
import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading, GovukButton } from '@dpr/ui/components'

export default async function ClientsPage() {
  let clients: Client[] = []
  let fetchError: string | null = null

  try {
    clients = await getClients()
  } catch (error) {
    console.error('Database query failed:', error)
    fetchError = 'Failed to load clients. Please try again later.'
  }

  return (
    <GovukPageLayout backLink="/">
      <GovukHeading size={'l'} tag={'h2'}>
        Clients
      </GovukHeading>
      <GovukButton tag="a" href="/clients/add">
        Add New Client
      </GovukButton>

      {fetchError && (
        <div role="alert">
          <p className="govuk-body">{fetchError}</p>
        </div>
      )}

      {!fetchError && (
        <>
          {clients.length > 0 ? (
            <ClientsTable clients={clients} />
          ) : (
            <div>
              <h2>No clients found</h2>
              <p>Get started by adding your first client.</p>
            </div>
          )}
        </>
      )}
    </GovukPageLayout>
  )
}
