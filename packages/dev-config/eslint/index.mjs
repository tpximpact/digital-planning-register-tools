// @ts-check

import eslint from '@eslint/js'
import globals from 'globals'
import tseslint, { configs as tsConfigs } from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
// import next from '@next/eslint-plugin-next'

// base apps - cli scripts w typescript etc
// const baseApps = ['']

// packages that run in the browser
const browserApps = ['apps/api', 'packages/react-app', 'apps/admin']

// packages that use react
const reactApps = ['packages/react-app', 'apps/admin']

// packages that use nextjs
// const nextApps = ['apps/admin']

const reactConfigs = reactApps.map((appPath) => ({
  files: [`${appPath}/**/*.{js,mjs,cjs,ts,mts,cts}`],
  // add global variables for browser environment
  name: `browser configs for ${appPath}`,
  // --- Accessibility Rules ---
  extends: [jsxA11y.flatConfigs.recommended]
}))

const browserConfigs = browserApps.map((appPath) => ({
  files: [`${appPath}/**/*.{js,mjs,cjs,ts,mts,cts}`],
  // add global variables for browser environment
  name: `browser configs for ${appPath}`,
  languageOptions: { globals: globals.browser }
}))

// const nextConfigs = nextApps.map((appPath) => ({
//   files: [`${appPath}/**/*.{js,mjs,cjs,ts,mts,cts}`],
//   name: 'nextjs recommended',
//   extends: flatConfig
// }))

const config = tseslint.config(
  {
    name: 'Ignore all dist folders everywhere in the monorepo',
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      'scripts/**',
      '**/.storybook/**'
    ]
  },
  {
    languageOptions: { globals: { ...globals.node } }
  },
  {
    name: 'eslint recommended',
    extends: [eslint.configs.recommended]
  },
  {
    name: 'tseslint recommended',
    extends: [tsConfigs.strict, tsConfigs.stylistic],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ]
    }
  },
  ...browserConfigs,
  ...reactConfigs
  // ...nextConfigs
)

export default config
