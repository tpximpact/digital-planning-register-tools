import './index.css'

export interface ServiceNavigationItem {
  label: string
  href: string
  active?: boolean
}

export interface ServiceNavigationProps {
  title?: string
  items?: ServiceNavigationItem[]
}

export function ServiceNavigation({
  items = [
    { label: 'Navigation item 1', href: '#' },
    { label: 'Navigation item 2', href: '#', active: true },
    { label: 'Navigation item 3', href: '#' }
  ]
}: ServiceNavigationProps) {
  return (
    <div
      className="govuk-service-navigation"
      data-module="govuk-service-navigation"
    >
      <div className="govuk-width-container">
        <div className="govuk-service-navigation__container">
          <nav aria-label="Menu" className="govuk-service-navigation__wrapper">
            <button
              type="button"
              className="govuk-service-navigation__toggle govuk-js-service-navigation-toggle"
              aria-controls="navigation"
              hidden
            >
              Menu
            </button>
            <ul className="govuk-service-navigation__list" id="navigation">
              {items.map((item, idx) => (
                <li
                  key={item.label + idx}
                  className={
                    'govuk-service-navigation__item' +
                    (item.active
                      ? ' govuk-service-navigation__item--active'
                      : '')
                  }
                >
                  <a
                    className="govuk-service-navigation__link"
                    href={item.href}
                    aria-current={item.active ? 'true' : undefined}
                  >
                    {item.active ? (
                      <strong className="govuk-service-navigation__active-fallback">
                        {item.label}
                      </strong>
                    ) : (
                      item.label
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
