import { Button } from 'apps/admin/src/components/Button/Button'
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

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">
              Are you sure you want to delete this client?
            </h1>

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
                  <Button
                    href={`/clients/${client.id}`}
                    variant="secondary"
                    element="link"
                  >
                    Cancel and go back to client details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
