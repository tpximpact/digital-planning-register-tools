import { notFound } from 'next/navigation'
import { getClientById } from '../actions'
import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading, GovukButton } from '@dpr/ui/components'
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
    <GovukPageLayout backLink={baseUrl}>
      <GovukHeading size={'l'} tag={'h2'}>
        Client details
      </GovukHeading>
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
        <GovukButton tag="a" href={`/clients/${client.id}/edit`}>
          Edit Client
        </GovukButton>
        <GovukButton
          variant="warning"
          tag="a"
          href={`/clients/${client.id}/delete`}
        >
          Delete Client
        </GovukButton>
      </div>
    </GovukPageLayout>
  )
}
