import type { JSX } from 'react'
import './index.css'

export interface GovukButtonProps {
  children: React.ReactNode | string
  tag: keyof Pick<JSX.IntrinsicElements, 'button' | 'a'>
  href?: string
  disabled?: boolean
  variant?: 'secondary' | 'warning'
  type?: 'submit' | 'reset' | 'button'
  inverse?: boolean
  additionalClasses?: string
}

export function GovukButton({
  children,
  tag: Tag,
  href,
  disabled,
  variant,
  type,
  inverse,
  additionalClasses
}: GovukButtonProps) {
  if (Tag === 'a' && !href) {
    return null
  }

  if (Tag === 'button' && !type) {
    return null
  }

  let classes = 'govuk-button'
  if (disabled) {
    classes += ' govuk-button--disabled'
  }
  if (variant) {
    classes += ` govuk-button--${variant}`
  }
  if (inverse) {
    classes += ' govuk-button--inverse'
  }
  classes += additionalClasses ? ` ${additionalClasses}` : ''
  return (
    <Tag
      className={classes}
      {...(Tag === 'a' && href && { href })}
      {...(Tag === 'button' && type && { type })}
      {...(disabled && { disabled, 'aria-disabled': 'true' })}
    >
      {children}
    </Tag>
  )
}
