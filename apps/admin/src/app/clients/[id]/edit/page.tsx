import { clients } from 'apps/admin/src/db/clients'
import { db } from 'apps/admin/src/libs/db'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { updateClient } from '../../actions'
import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading, GovukButton } from '@dpr/ui/components'

export default async function EditClientPage(
  props: PageProps<'/clients/[id]/edit'>
) {
  const { id: idString } = await props.params
  const id = parseInt(idString, 10)
  if (isNaN(id)) {
    return (
      <GovukPageLayout>
        <p>Invalid client ID.</p>
      </GovukPageLayout>
    )
  }

  const client = await db.query.clients.findFirst({
    where: eq(clients.id, id)
  })

  if (!client) {
    notFound()
  }

  const baseUrl = `/clients/${client.id}`

  return (
    <GovukPageLayout backLink={baseUrl}>
      <GovukHeading size={'l'} tag={'h2'}>
        Edit {client.name}
      </GovukHeading>

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
        <GovukButton tag="button" type="submit">
          Update Client
        </GovukButton>
      </form>
    </GovukPageLayout>
  )
}
