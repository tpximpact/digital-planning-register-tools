import React from 'react'

import './index.css'

export interface GovukPageLayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  backLink?: string
}

export function GovukPageLayout({
  children,
  fullWidth = false,
  backLink
}: GovukPageLayoutProps) {
  const widthClass = fullWidth
    ? 'govuk-no-width-container'
    : 'govuk-width-container'

  const wrapInContainer = (children: React.ReactNode, fullWidth: boolean) => {
    return fullWidth ? (
      children
    ) : (
      <div className="govuk-width-container">{children}</div>
    )
  }

  return (
    <div className={widthClass}>
      {/* phase banner + breadcrumbs + backlink */}

      {wrapInContainer(
        <>
          {backLink && (
            <a href={backLink} className="govuk-back-link">
              Back
            </a>
          )}
        </>,
        !fullWidth
      )}

      {/* govuk-main-wrapper--l (or govuk-main-wrapper--auto-spacing) is added when theres nothing before <main> */}
      <main
        className={`govuk-main-wrapper${backLink ? '' : ' govuk-main-wrapper--l'}`}
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
