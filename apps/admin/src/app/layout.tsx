import type { Metadata } from 'next'
import '../styles/global.scss'

export const metadata: Metadata = {
  title: 'DPR Tools Admin Dashboard',
  description: 'View and manage clients in the DPR Tools Admin Dashboard.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="govuk-template">
      <body className={`govuk-template__body`}>{children}</body>
    </html>
  )
}
