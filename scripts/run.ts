#!/usr/bin/env bun
/**
 * run.ts - Monorepo Concurrent Script Runner
 *
 * Usage:
 *   bun scripts/run.ts <script>
 *
 * Runs the given npm/yarn/bun script (from package.json) concurrently in all packages (in apps/ and packages/) that define it.
 *
 * - <script>: The name of the script to run (as defined in each package's package.json "scripts" field).
 *
 * Example:
 *   bun scripts/run.ts build
 *   bun scripts/run.ts test
 *
 * Requirements:
 * - Must be run from the root of the monorepo.
 * - Requires Bun runtime and the 'concurrently' package.
 *
 * The script will:
 * - Find all packages in apps/ and packages/ that define the given script.
 * - Run the script in each package concurrently, with colored output prefixes.
 * - Ignore packages that do not define the script.
 */
import { readdir } from 'fs/promises'
import concurrently from 'concurrently'

const [, , command] = process.argv

if (!command) {
  console.error(
    'Error: No command specified. Usage: bun scripts/run.ts <command>'
  )
  process.exit(1)
}

const mapPrefix = (prefix: string) => (folders: string[]) =>
  folders.map((folder) => `${prefix}/${folder}`)

const folders = await Promise.all([
  readdir('apps').then(mapPrefix('apps')),
  readdir('packages').then(mapPrefix('packages')),
  readdir('handlers').then(mapPrefix('handlers')),
  readdir('converters').then(mapPrefix('converters')),
  readdir('playground').then(mapPrefix('playground'))
]).then((x) => x.reduce((x, y) => [...x, ...y], []))

const paths = await Promise.all(
  folders.map(async (path) => {
    const file = Bun.file(`${path}/package.json`)

    if (!(await file.exists())) return

    const packageJson = await file.json()

    if (packageJson.scripts && command in packageJson.scripts) return path
  })
).then((x) => x.filter((x) => x !== undefined))

const colors = ['blue', 'green', 'magenta', 'yellow', 'red']

concurrently(
  paths.map((path, index) => ({
    name: path,
    command: `cd ${path} && bun run ${command}`,
    prefixColor: colors[index % colors.length]
  }))
).result.catch(() => {})
