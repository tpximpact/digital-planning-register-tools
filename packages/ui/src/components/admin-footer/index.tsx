import './index.css'

export interface AdminFooterProps {
  title?: string
}

export function AdminFooter({ title = 'Admin Dashboard' }: AdminFooterProps) {
  return (
    <footer className="govuk-footer" title={title}>
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <span className="govuk-footer__licence-description">
              All content is available under the{' '}
              <a
                className="govuk-footer__link"
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                rel="license"
              >
                Open Government Licence v3.0
              </a>
              , except where otherwise stated
            </span>
          </div>
          <div className="govuk-footer__meta-item">
            © Digital Planning Register
          </div>
        </div>
      </div>
    </footer>
  )
}
