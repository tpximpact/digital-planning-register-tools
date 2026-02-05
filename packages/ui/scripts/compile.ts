import * as sass from 'sass-embedded'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

// Function to compile SCSS
export async function buildStyles(
  scssFilename: string,
  cssOutFile: string,
  compileOptions?: sass.Options<'async'>
) {
  try {
    const result = await sass.compileAsync(scssFilename, {
      loadPaths: ['node_modules', '../../node_modules', 'src/styles/legacy'],
      quietDeps: true,
      ...compileOptions
    })
    await Bun.write(cssOutFile, result.css)
    console.log(
      `\x1b[32m[STYLES]\x1b[0m Compiled ${scssFilename} -> ${cssOutFile}`
    )
  } catch (err) {
    console.error('\x1b[31m[STYLES ERROR]\x1b[0m', err)
  }
}

// Find all index.scss files in a directory tree
async function findScssEntries(baseDir: string): Promise<string[]> {
  const entries: string[] = []
  async function walk(dir: string) {
    for (const entry of await readdir(dir)) {
      const fullPath = join(dir, entry)
      const stats = await stat(fullPath)
      if (stats.isDirectory()) {
        await walk(fullPath)
      } else if (entry === 'index.scss') {
        entries.push(fullPath)
      }
    }
  }
  await walk(baseDir)
  return entries
}

// Build all found index.scss files initially
export async function buildAllComponentAndLayoutStyles() {
  const componentScss = await findScssEntries('src/components')
  const layoutScss = await findScssEntries('src/layouts')
  for (const srcPath of [...componentScss, ...layoutScss]) {
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
}
