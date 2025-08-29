import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { ExampleComponent, type ExampleComponentProps } from '.'

const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent
}

export default meta

type Story = StoryObj<ExampleComponentProps>

export const Default: Story = {}

export const Customised: Story = {
  args: {
    name: 'Bob'
  }
}
