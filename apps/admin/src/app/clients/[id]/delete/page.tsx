import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading, GovukButton } from '@dpr/ui/components'
import { deleteClient, getClientById } from '../../actions'

export default async function DeleteClientPage({
  params
}: {
  params: { id: number }
}) {
  const client = await getClientById(params.id)

  if (!client) {
    return <p>Client not found.</p>
  }

  const deleteClientWithId = deleteClient.bind(null, client.id)

  const baseUrl = `/clients/${client.id}`
  return (
    <GovukPageLayout backLink={baseUrl}>
      <GovukHeading size={'l'} tag={'h2'}>
        Are you sure you want to delete this client?
      </GovukHeading>

      <p className="govuk-body">Client: {client.name}</p>

      <div className="govuk-warning-text">
        <strong className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          This action is permanent and cannot be undone.
        </strong>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-button-group">
          <form action={deleteClientWithId}>
            <button
              type="submit"
              className="govuk-button govuk-button--warning"
            >
              Yes, delete client
            </button>
          </form>
          <div>
            <GovukButton
              href={`/clients/${client.id}`}
              variant="secondary"
              tag="a"
            >
              Cancel and go back to client details
            </GovukButton>
          </div>
        </div>
      </div>
    </GovukPageLayout>
  )
}
