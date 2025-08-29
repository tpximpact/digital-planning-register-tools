import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { AdminHeader, type AdminHeaderProps } from '.'

const meta: Meta<typeof AdminHeader> = {
  title: 'Components/AdminHeader',
  component: AdminHeader,
  args: {
    title: 'Custom Admin Dashboard'
  }
}

export default meta

type Story = StoryObj<AdminHeaderProps>

export const Default: Story = {}
