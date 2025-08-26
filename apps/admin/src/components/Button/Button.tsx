import './Button.scss'
import Link from 'next/link'

// The types for the Button component are defined here
type ButtonElement = 'button' | 'link' | 'span' | 'div'
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'information'
  | 'warning'
  | 'text-only'

type LinkHref =
  | string
  | {
      pathname: string
      query?: Record<string, string>
    }

interface ButtonProps {
  children: React.ReactNode
  element?: ButtonElement
  type?: 'button' | 'submit' | 'reset'
  href?: LinkHref
  className?: string
  onClick?: React.MouseEventHandler<
    HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | HTMLDivElement
  >
  ariaLabel?: string
  variant?: ButtonVariant
  value?: string
  name?: string
  prefetch?: boolean
}

export const Button = ({
  children,
  element = 'button',
  type = 'button',
  href,
  className = '',
  onClick,
  ariaLabel,
  variant = 'default',
  value,
  name,
  prefetch
}: ButtonProps) => {
  const getVariantClass = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return 'govuk-button--primary'
      case 'secondary':
        return 'govuk-button--secondary'
      case 'warning':
        return 'govuk-button--warning'
      case 'information':
        return 'dpr-button--information'
      case 'text-only':
        return 'govuk-link'
      default:
        return ''
    }
  }

  // If it is text-only variant, we don't want to add the govuk-button class
  const baseClassName = `${
    variant === 'text-only' ? '' : 'govuk-button'
  } ${getVariantClass(variant)} ${className}`.trim()

  const optionalProps = {
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(value && { value }),
    ...(name && { name })
  }

  if (element === 'link' && href) {
    return (
      <Link
        href={href}
        className={baseClassName}
        onClick={onClick}
        role={variant === 'text-only' ? undefined : 'button'}
        data-module={variant === 'text-only' ? undefined : 'govuk-button'}
        {...optionalProps}
        prefetch={prefetch}
      >
        {children}
      </Link>
    )
  }

  if (element === 'span' || element === 'div') {
    const Element = element
    return (
      <Element
        className={baseClassName}
        onClick={onClick}
        role="button"
        {...optionalProps}
      >
        {children}
      </Element>
    )
  }

  if (element === 'button') {
    return (
      <button
        type={type}
        className={baseClassName}
        onClick={onClick}
        data-module={variant === 'text-only' ? undefined : 'govuk-button'}
        data-prevent-double-click="true"
        {...optionalProps}
      >
        {children}
      </button>
    )
  }

  return null
}
