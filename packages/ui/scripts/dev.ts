#!/usr/bin/env bun
import { spawn } from 'bun'
import { watch } from 'fs'
import { buildAllComponentAndLayoutStyles, buildStyles } from './compile'
import { join } from 'path'

// Paths
const styleDir = 'src/styles'
const scssFilename = `${styleDir}/index.scss`
const cssOutFile = `${styleDir}/index.css`

// START:

// Start Storybook dev server
spawn(['storybook', 'dev', '--no-open', '-p', '6006'], {
  stdout: 'inherit',
  stderr: 'inherit'
})

// Build style.css
await buildStyles(scssFilename, cssOutFile)

// Build all component and layout styles
await buildAllComponentAndLayoutStyles()

// WATCH:

// Watch all files in the styleDir folder for changes
watch(styleDir, { recursive: true }, async (eventType, filename) => {
  if (typeof filename !== 'string' || !filename.endsWith('.scss')) return
  if (filename.endsWith('index.scss')) {
    if (eventType === 'change' || eventType === 'rename') {
      console.log(
        `\x1b[36m[STYLES WATCH]\x1b[0m Detected change in ${filename}`
      )
      await buildStyles(scssFilename, cssOutFile)
    }
  }
})

// Watch for changes and new files in components and layouts
function watchComponentAndLayoutStyles() {
  const watchDirs = ['src/components', 'src/layouts']
  for (const dir of watchDirs) {
    watch(dir, { recursive: true }, async (_eventType, filename) => {
      if (typeof filename !== 'string' || !filename.endsWith('.scss')) return
      if (filename.endsWith('index.scss')) {
        const srcPath = join(dir, filename)
        // Put CSS file next to SCSS file: src/components/button/index.scss -> src/components/button/index.css
        const cssOutFile = srcPath.replace(/\.scss$/, '.css')
        await buildStyles(srcPath, cssOutFile, {
          loadPaths: [
            'node_modules',
            '../../node_modules',
            'src/styles/modules',
            'src/styles/legacy'
          ]
        })
      }
    })
  }
}
watchComponentAndLayoutStyles()
