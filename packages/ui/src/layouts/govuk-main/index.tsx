import React from 'react'

import './index.css'

export interface GovukMainLayoutProps {
  children: React.ReactNode
  beforeMain?: React.ReactNode
  afterMain?: React.ReactNode
}

export function GovukMainLayout({
  children,
  beforeMain,
  afterMain
}: GovukMainLayoutProps) {
  return (
    <React.Fragment>
      <a
        href="#main-content"
        className="govuk-skip-link"
        data-module="govuk-skip-link"
      >
        Skip to main content
      </a>
      {beforeMain}
      {children}
      {afterMain}
    </React.Fragment>
  )
}
