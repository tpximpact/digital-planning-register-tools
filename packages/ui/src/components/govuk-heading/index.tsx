import type { JSX } from 'react'
import './index.css'

export interface GovukHeadingProps {
  children: React.ReactNode | string
  tag: keyof JSX.IntrinsicElements
  size: 's' | 'm' | 'l' | 'xl'
  additionalClasses?: string
}

export function GovukHeading({
  children,
  tag: Tag,
  size,
  additionalClasses
}: GovukHeadingProps) {
  return (
    <Tag
      className={`dpr-heading__${size}${additionalClasses ? ` ${additionalClasses}` : ''}`}
    >
      {children}
    </Tag>
  )
}
