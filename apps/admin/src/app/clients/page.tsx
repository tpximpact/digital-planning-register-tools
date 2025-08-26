import { ClientsTable } from '../../components/ClientsTable'
import type { Client } from '../../types/types'
import { getClients } from './actions'
import { Button } from '../../components/Button/Button'
import { BackButton } from '../../components/BackButton/BackButton'

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
    <div className="govuk-width-container">
      <BackButton baseUrl="/" />
      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <header className="govuk-header">
          <h1 className="govuk-heading-l">All clients</h1>
        </header>
        <div>
          <Button element="link" href="/clients/add">
            Add New Client
          </Button>
        </div>

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
      </main>
    </div>
  )
}
