// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import {importX} from 'eslint-plugin-import-x';

// packages that run in the browser
const browserApps = ['product/api'];
// packages that use esm
const esmApps = ['product/api'];

const browserConfigs = browserApps.map(appPath => ({
  files: [`${appPath}/**/*.{js,mjs,cjs,ts,mts,cts}`],
  // add global variables for browser environment
  name: 'browser global variables',
  languageOptions: {globals: globals.browser},
}));

const esmConfigs = esmApps.map(appPath => ({
  name: `esm configs for ${appPath}`,
  files: [`${appPath}/**/*.{ts,mts,cts}`],
  extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript],
  plugins: {
    //   //   '@typescript-eslint': tseslint.plugin,
    '@typescript-eslint/parser': tseslint.parser,
  },
  // {
  //   files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  languageOptions: {
    parser: tseslint.parser,
    // ecmaVersion: 'latest',
    // sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  // },
  // settings: {
  //   //   'import/parsers': {
  //   //     '@typescript-eslint/parser': ['.ts', '.tsx'],
  //   //   },
  //   'import/resolver': {
  //     // typescript: true,
  //     typescript: {
  //       noWarnOnMultipleProjects: true, // suppresses the warning

  //       // alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
  //       //       bun: true, // Resolve Bun modules (https://github.com/import-js/eslint-import-resolver-typescript#bun)
  //       //       // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json or <root>/jsconfig.json by default
  //       //       // Use <root>/path/to/folder/tsconfig.json or <root>/path/to/folder/jsconfig.json
  //       project: `${appPath}/tsconfig.json`,
  //       //       // Multiple tsconfigs (Useful for monorepos, but discouraged in favor of `references` supported)
  //       //       // Use a glob pattern
  //       //       project: 'packages/*/{ts,js}config.json',
  //       //       // Use an array
  //       //       project: [
  //       //         'packages/module-a/tsconfig.json',
  //       //         'packages/module-b/jsconfig.json',
  //       //       ],
  //       //       // Use an array of glob patterns
  //       //       project: ['packages/*/tsconfig.json', 'other-packages/*/jsconfig.json'],
  //     },
  //   },
  // },
  rules: {
    // 'import-x/no-dynamic-require': 'warn',
    // 'import-x/no-nodejs-modules': 'warn',
    'import-x/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {order: 'asc', caseInsensitive: true},
      },
    ],
  },
}));

const config = tseslint.config(
  {
    name: 'Ignore all dist folders everywhere in the monorepo',
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    languageOptions: {globals: {...globals.node, ...globals.es2022}},
  },
  {
    name: 'eslint recommended',
    extends: [eslint.configs.recommended],
  },
  {
    name: 'tseslint recommended',
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
    ],
  },
  ...browserConfigs,
  ...esmConfigs,
  {
    name: 'temporary disable for my sanity',
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);

console.log(config);
export default config;
