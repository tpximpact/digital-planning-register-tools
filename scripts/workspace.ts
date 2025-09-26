#!/usr/bin/env bun
/**
 * workspace.ts - Monorepo Package Command Runner
 *
 * Usage:
 *   bun scripts/workspace.ts <package-name> <command> [args...]
 *
 * Runs a command in the directory of a workspace package by its package.json name.
 *
 * - <package-name>: The name field from a package's package.json (e.g. react-app, object-store, etc).
 * - <command> [args...]: The command and its arguments to run in the package directory.
 *
 * Example:
 *   bun scripts/workspace.ts react-app bun test
 *
 * Requirements:
 * - Must be run from the root of the dpr-tools monorepo (package.json name must be 'dpr-tools').
 * - Requires Bun runtime.
 *
 * The script will:
 * - Verify the monorepo root.
 * - Find the package path in apps/ or packages/ by name.
 * - Run the given command in that directory, forwarding all output.
 * - Exit with an error if arguments are missing or the package is not found.
 */
import { readdir } from 'fs/promises'

// Check if we are in the dpr-tools monorepo by verifying the package name
const pkg = await Bun.file('package.json').json()
const PKG_NAME = pkg.name

if (PKG_NAME !== 'dpr-tools') {
  console.error(
    `Error: Not in the dpr-tools monorepo (package name: ${PKG_NAME})`
  )
  process.exit(1)
}

// Function to get a map of the workspace packages
// Returns an object where keys are package names and values are their paths
async function getWorkspacePackages() {
  const mapPrefix = (prefix: string) => (folders: string[]) =>
    folders.map((folder) => ({ path: `${prefix}/${folder}` }))

  const folders = [
    ...(await readdir('apps')).map((folder) => ({ prefix: 'apps', folder })),
    ...(await readdir('packages')).map((folder) => ({
      prefix: 'packages',
      folder
    })),
    ...(await readdir('handlers')).map((folder) => ({
      prefix: 'handlers',
      folder
    })),
    ...(await readdir('converters')).map((folder) => ({
      prefix: 'converters',
      folder
    })),
    ...(await readdir('playground')).map((folder) => ({
      prefix: 'playground',
      folder
    }))
  ]

  const results: { [pkgName: string]: string } = {}

  for (const { prefix, folder } of folders) {
    const pkgPath = `${prefix}/${folder}/package.json`
    try {
      const pkgJson = await Bun.file(pkgPath).json()
      if (pkgJson.name) {
        results[pkgJson.name] = `${prefix}/${folder}`
      }
    } catch {
      // Ignore folders without package.json
    }
  }

  return results
}

// Parse arguments
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('No arguments provided.')
  process.exit(1)
}

const packageName = args[0]
if (!packageName) {
  console.error('Package name cannot be empty.')
  process.exit(1)
}

const command = args.slice(1)
if (command.length === 0) {
  console.error('No command to execute.')
  process.exit(1)
}

const packages = await getWorkspacePackages()
const packagePath = packages[packageName]
if (!packagePath) {
  console.error(`Package "${packageName}" not found in the workspace.`)
  process.exit(1)
}

console.log(
  '\n' +
    '\x1b[44m\x1b[1m[WORKSPACE RUN]\x1b[0m\n' +
    `\x1b[33m▶ Command:\x1b[0m \x1b[1m${command.join(' ')}\x1b[0m\n` +
    `\x1b[36m▶ Package Path:\x1b[0m \x1b[1m${packagePath}\x1b[0m\n` +
    `\x1b[35m▶ Package Name:\x1b[0m \x1b[1m${packageName}\x1b[0m\n`
)

await Bun.spawn([...command], {
  cwd: packagePath,
  stdout: 'inherit',
  stderr: 'inherit'
})
