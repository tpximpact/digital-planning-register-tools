// @ts-check

import eslint from '@eslint/js';
import {importX} from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint, {
  parser as tsParser,
  configs as tsConfigs,
  plugin as tsPlugin,
} from 'typescript-eslint';

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

const esmConfigs = tseslint.config(
  esmApps.map(appPath => ({
    name: `esm configs for ${appPath}`,
    files: [`${appPath}/**/*.{ts,mts,cts}`],
    rules: {
      'import-x/no-nodejs-modules': 'warn',
    },
  })),
);

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
      tsConfigs.strictTypeChecked,
      tsConfigs.stylisticTypeChecked,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    plugins: {
      '@typescript-eslint/parser': tsParser,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      // ecmaVersion: 'latest',
      // sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-amd': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/no-import-module-exports': 'error',
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
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
  },
  ...browserConfigs,
  ...esmConfigs,
  {
    name: 'temporary disable for my sanity',
    rules: {
      // '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-unsafe-member-access': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      // '@typescript-eslint/no-unsafe-return': 'off',
      // '@typescript-eslint/no-unsafe-assignment': 'off',
      // '@typescript-eslint/no-unused-vars': 'off',
      // '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);

export default config;
