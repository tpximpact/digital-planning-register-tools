import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { AdminFooter, type AdminFooterProps } from '.'

const meta: Meta<typeof AdminFooter> = {
  title: 'Components/AdminFooter',
  component: AdminFooter,
  args: {
    title: 'Custom Admin Dashboard'
  }
}

export default meta

type Story = StoryObj<AdminFooterProps>

export const Default: Story = {}
