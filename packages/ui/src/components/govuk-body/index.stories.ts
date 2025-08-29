import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukBody, type GovukBodyProps } from '.'

const meta: Meta<typeof GovukBody> = {
  title: 'Components/GovukBody',
  component: GovukBody,
  parameters: {
    layout: 'centered',
    docs: {
      controls: { exclude: ['children'] }
    }
  },
  args: {
    children: 'Text'
  }
}

export default meta

type Story = StoryObj<GovukBodyProps>

export const Default: Story = {}

export const Lede: Story = {
  args: {
    size: 'lede'
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
