import { clients } from 'apps/admin/src/db/clients'
import { db } from 'apps/admin/src/libs/db'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { updateClient } from '../../actions'
import { BackButton } from 'apps/admin/src/components/BackButton/BackButton'

export default async function EditClientPage({
  params
}: {
  params: { id: number }
}) {
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, params.id)
  })

  if (!client) {
    notFound()
  }

  const baseUrl = `/clients/${client.id}`

  return (
    <div className="govuk-width-container">
      <BackButton baseUrl={baseUrl} />

      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <h1 className="govuk-heading-l">Edit {client.name}</h1>
        <form action={updateClient.bind(null, client.id)}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={client.name}
              required
              className="govuk-input govuk-!-width-two-thirds"
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="endpoint">
              Endpoint
            </label>
            <input
              type="endpoint"
              name="endpoint"
              id="endpoint"
              defaultValue={client.endpoint}
              required
              className="govuk-input govuk-!-width-two-thirds"
            />
          </div>
          <button
            type="submit"
            className="govuk-button"
            data-module="govuk-button"
          >
            Update Client
          </button>
        </form>
      </main>
    </div>
  )
}
