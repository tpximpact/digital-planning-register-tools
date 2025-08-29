#!/usr/bin/env bun
import { spawn } from 'bun'
import { buildAllComponentAndLayoutStyles, buildStyles } from './compile'

// Paths
const styleDir = 'src/styles'
const scssFilename = `${styleDir}/index.scss`
const cssOutFile = `${styleDir}/index.css`

// START:

// Build Storybook standalone
spawn(['storybook', 'build', '--output-dir', 'dist/storybook'], {
  stdout: 'inherit',
  stderr: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
})

// Build style.css
await buildStyles(scssFilename, cssOutFile, { style: 'compressed' })

// Build all component and layout styles
await buildAllComponentAndLayoutStyles()
