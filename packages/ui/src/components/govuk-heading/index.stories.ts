import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukHeading, type GovukHeadingProps } from '.'

const meta: Meta<typeof GovukHeading> = {
  title: 'Components/GovukHeading',
  component: GovukHeading,
  parameters: {
    layout: 'centered',
    docs: {
      controls: { exclude: ['children'] }
    }
  },
  args: {
    children: 'Text',
    tag: 'h1',
    size: 'xl'
  }
}

export default meta

type Story = StoryObj<GovukHeadingProps>

export const Default: Story = {}

export const Xl: Story = {
  args: {
    size: 'xl'
  }
}

export const L: Story = {
  args: {
    size: 'l'
  }
}

export const M: Story = {
  args: {
    size: 'm'
  }
}

export const S: Story = {
  args: {
    size: 's'
  }
}

export const Span: Story = {
  args: {
    size: 's',
    tag: 'span'
  }
}
