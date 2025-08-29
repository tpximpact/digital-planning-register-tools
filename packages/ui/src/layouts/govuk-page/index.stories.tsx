import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukPageLayout, type GovukPageLayoutProps } from '.'

const meta: Meta<typeof GovukPageLayout> = {
  title: 'Layouts/GovukPageLayout',
  component: GovukPageLayout,
  /**
   * Known storybook bug: https://github.com/storybookjs/storybook/issues/32183#issuecomment-3148378004
   * Can't pass React.ReactNode as params as the docs plugin will try to parse it
   * The fix is to exclude any React.ReactNode props from the controls
   */
  parameters: {
    docs: {
      controls: { exclude: ['children'] }
    }
  },
  args: {
    children: <>hello</>
  }
}

export default meta

type Story = StoryObj<GovukPageLayoutProps>

export const Default: Story = {}

export const FullWidth: Story = {
  args: {
    fullWidth: true
  }
}

export const ContentPage: Story = {
  args: {
    backLink: '#'
  }
}

export const FullWidthContentPage: Story = {
  args: {
    fullWidth: true,
    backLink: '#'
  }
}
