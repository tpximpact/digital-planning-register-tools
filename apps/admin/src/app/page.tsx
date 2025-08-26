import { Button } from '../components/Button/Button'

export default async function Home() {
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper govuk-main-wrapper--l">
        <h1 className="govuk-heading-l">Admin Dashboard</h1>
        <p className="govuk-body">
          Welcome to the admin dashboard. Click below to view the client table.
        </p>
        <Button element="link" href="/clients" className="govuk-link">
          View all clients
        </Button>
      </main>
    </div>
  )
}
