import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukTypography, type GovukTypographyProps } from '.'

const meta: Meta<typeof GovukTypography> = {
  title: 'Components/GovukTypography',
  component: GovukTypography,
  parameters: {
    docs: {
      controls: { exclude: ['children'] }
    }
  },
  args: {
    children: (
      <>
        <div className="govuk-body">
          Text,{' '}
          <a href="#" className={'govuk-link'}>
            link
          </a>
        </div>
      </>
    )
  }
}

export default meta

type Story = StoryObj<GovukTypographyProps>

export const Default: Story = {}
