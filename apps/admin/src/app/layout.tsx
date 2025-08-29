import type { Metadata } from 'next'
import { GovukMainLayout } from '@dpr/ui/layouts'
import { AdminHeader, AdminFooter, ServiceNavigation } from '@dpr/ui/components'
import '@dpr/ui/styles/index.css'

export function generateMetadata(): Metadata {
  const title = 'DPR Tools Admin Dashboard'
  const description = 'Admin dashboard for the DPR'

  return {
    title: {
      template: '%s | DPR Tools Admin Dashboard',
      default: title
    },
    description
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="govuk-template govuk-template--rebranded">
      <body className={`govuk-template__body`}>
        <GovukMainLayout
          beforeMain={
            <>
              <AdminHeader />
              <ServiceNavigation
                items={[
                  { label: 'Home', href: '/', active: true },
                  { label: 'Clients', href: '/clients' }
                ]}
              />
            </>
          }
          afterMain={<AdminFooter />}
        >
          {children}
        </GovukMainLayout>
      </body>
    </html>
  )
}
