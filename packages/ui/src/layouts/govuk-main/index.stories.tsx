import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukMainLayout, type GovukMainLayoutProps } from '.'
import { AdminFooter, AdminHeader } from '../../components'

const meta: Meta<typeof GovukMainLayout> = {
  title: 'Layouts/GovukMainLayout',
  component: GovukMainLayout,
  /**
   * Known storybook bug: https://github.com/storybookjs/storybook/issues/32183#issuecomment-3148378004
   * Can't pass React.ReactNode as params as the docs plugin will try to parse it
   * The fix is to exclude any React.ReactNode props from the controls
   */
  parameters: {
    docs: {
      controls: { exclude: ['children', 'beforeMain', 'afterMain'] }
    }
  },
  args: {
    children: <div>hello</div>,
    beforeMain: <AdminHeader />,
    afterMain: <AdminFooter />
  }
}

export default meta

type Story = StoryObj<GovukMainLayoutProps>

export const Default: Story = {}
