import { GovukHeading } from '../govuk-heading'
import './index.css'

export interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title = 'Admin Dashboard' }: AdminHeaderProps) {
  return (
    <header className="dpr-header">
      <div className="dpr-header__wrapper">
        <div className="dpr-header__grid-row">
          <div className="dpr-header__grid-column-one-third">
            <GovukHeading
              tag={'h1'}
              size={'l'}
              additionalClasses={'dpr-header__title'}
            >
              {title}
            </GovukHeading>
          </div>
        </div>
      </div>
    </header>
  )
}
