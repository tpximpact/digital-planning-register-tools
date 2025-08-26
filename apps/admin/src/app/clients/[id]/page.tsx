import { notFound } from 'next/navigation'
import { getClientById } from '../actions'
import { BackButton } from 'apps/admin/src/components/BackButton/BackButton'
import { Button } from 'apps/admin/src/components/Button/Button'

export default async function ClientDetailPage({
  params
}: {
  params: { id: number }
}) {
  const clientId = params.id
  const client = await getClientById(clientId)

  if (!client) {
    notFound()
  }

  const baseUrl = `/clients/`

  return (
    <div className="govuk-width-container">
      <BackButton baseUrl={baseUrl} />
      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <h1 className="govuk-heading-l">Client Details</h1>
        <div>
          <p className="govuk-body">
            <strong>ID:</strong> {client.id}
          </p>
          <p className="govuk-body">
            <strong>Name:</strong> {client.name}
          </p>
          <p className="govuk-body">
            <strong>Endpoint:</strong> {client.endpoint}
          </p>
        </div>
        <div className="govuk-button-group">
          <Button element="link" href={`/clients/${client.id}/edit`}>
            Edit Client
          </Button>
          <Button
            variant="warning"
            element="link"
            href={`/clients/${client.id}/delete`}
          >
            Delete Client
          </Button>
        </div>
      </main>
    </div>
  )
}
