import { BackButton } from 'apps/admin/src/components/BackButton/BackButton'
import { createClient } from '../actions'

export default function AddClientPage() {
  const baseUrl = '/clients'
  return (
    <div className="govuk-width-container">
      <BackButton baseUrl={baseUrl} />
      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <h1 className="govuk-heading-l">Add New Client</h1>

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
      </main>
    </div>
  )
}
