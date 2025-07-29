import '@dpr/ui/global.css'

import type { Meta, StoryObj } from '@storybook/react'

import { ListApplications, type ListApplicationsProps } from '.'

const meta: Meta<typeof ListApplications> = {
  title: 'Components/ListApplications',
  component: ListApplications,
  args: {
    items: [
      {
        id: 1,
        name: `Application 1`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: `Application 2`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
}

export default meta

type Story = StoryObj<ListApplicationsProps>

export const Default: Story = {}
