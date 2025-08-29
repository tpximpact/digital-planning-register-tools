import type { JSX } from 'react'
import './index.css'

export interface GovukBodyProps {
  children: React.ReactNode | string
  tag?: keyof JSX.IntrinsicElements
  size?: 's' | 'm' | 'l' | 'lede'
  additionalClasses?: string
}

export function GovukBody({
  children,
  tag: Tag = 'p',
  size = 'm',
  additionalClasses
}: GovukBodyProps) {
  return (
    <Tag
      className={`dpr-body__${size}${additionalClasses ? ` ${additionalClasses}` : ''}`}
    >
      {children}
    </Tag>
  )
}
