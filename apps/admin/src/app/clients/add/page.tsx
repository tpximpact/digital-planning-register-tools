import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading } from '@dpr/ui/components'
import { createClient } from '../actions'

export default function AddClientPage() {
  const baseUrl = '/clients'
  return (
    <GovukPageLayout backLink={baseUrl}>
      <GovukHeading size={'l'} tag={'h2'}>
        Add New Client
      </GovukHeading>

      <form action={createClient}>
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="name">
            Name
          </label>
          <input
            className="govuk-input"
            name="name"
            id="name"
            type="text"
            required
          />
        </div>
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="endpoint">
            Endpoint
          </label>
          <input
            className="govuk-input"
            name="endpoint"
            id="endpoint"
            type="text"
            required
          />
        </div>
        <button
          type="submit"
          className="govuk-button"
          data-module="govuk-button"
        >
          Save Client
        </button>
      </form>
    </GovukPageLayout>
  )
}
