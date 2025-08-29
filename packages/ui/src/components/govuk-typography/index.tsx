import React from 'react'
import './index.css'

export interface GovukTypographyProps {
  children: React.ReactNode
}

export function GovukTypography({ children }: GovukTypographyProps) {
  return <React.Fragment>{children}</React.Fragment>
}
