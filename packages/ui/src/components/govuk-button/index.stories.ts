import type { Meta, StoryObj } from '@storybook/react'

import '../../styles/index.css'

import { GovukButton, type GovukButtonProps } from '.'

const meta: Meta<typeof GovukButton> = {
  title: 'Components/GovukButton',
  component: GovukButton,
  parameters: {
    layout: 'centered',
    docs: {
      controls: { exclude: ['children'] }
    }
  },
  args: {
    children: 'Text',
    tag: 'button',
    type: 'submit'
  }
}

export default meta

type Story = StoryObj<GovukButtonProps>

export const Default: Story = {}

export const DefaultDisabled: Story = {
  args: {
    disabled: true
  }
}

export const DefaultInverse: Story = {
  globals: {
    // 👇 Override background value for this story
    backgrounds: { value: 'dark' }
  },
  args: {
    inverse: true
  }
}
export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
}

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    disabled: true
  }
}

export const SecondaryInverse: Story = {
  globals: {
    // 👇 Override background value for this story
    backgrounds: { value: 'dark' }
  },
  args: {
    variant: 'secondary',
    inverse: true
  }
}

export const Warning: Story = {
  args: {
    variant: 'warning'
  }
}

export const WarningDisabled: Story = {
  args: {
    variant: 'warning',
    disabled: true
  }
}

export const WarningInverse: Story = {
  globals: {
    // 👇 Override background value for this story
    backgrounds: { value: 'dark' }
  },
  args: {
    variant: 'warning',
    inverse: true
  }
}

export const Link: Story = {
  args: {
    tag: 'a',
    href: '#',
    type: undefined
  }
}
