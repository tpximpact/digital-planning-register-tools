import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { ServiceNavigation, type ServiceNavigationProps } from '.'

const meta: Meta<typeof ServiceNavigation> = {
  title: 'Components/ServiceNavigation',
  component: ServiceNavigation
}

export default meta

type Story = StoryObj<ServiceNavigationProps>

export const Default: Story = {}

export const Customised: Story = {
  args: {
    items: [
      { label: 'Navigation item 1', href: '#' },
      { label: 'Navigation item 2', href: '#', active: true },
      { label: 'Navigation item 3', href: '#' }
    ]
  }
}
