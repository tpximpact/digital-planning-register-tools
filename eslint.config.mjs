// @ts-check

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const baseConfig = tseslint.config(
  {
    languageOptions: {globals: {...globals.node, ...globals.es2022}},
  },
  {
    name: 'eslint recommended',
    extends: [eslint.configs.recommended],
  },
  {
    name: 'tseslint recommended',
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: ['eslint.config.mjs'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@typescript-eslint/parser': tseslint.parser,
    },
    // rules that require type checking
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    name: 'Disable type-aware linting on JS files',
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    name: 'Configure type-aware rules',
    files: ['**/*.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // config for eslint-plugin-import only
    ...importPlugin.flatConfigs.recommended,
    ...importPlugin.flatConfigs.typescript,
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          // use an array of glob patterns
          project: [
            'tsconfig.json',
            'product/*/tsconfig.json',
            'lib/*/tsconfig.json',
          ],

          noWarnOnMultipleProjects: true, // suppresses the warning
        },
      },
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
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
      // 'import/extensions': [
      //   'error',
      //   'ignorePackages',
      //   {
      //     js: 'always',
      //     jsx: 'always',
      //     ts: 'always',
      //     tsx: 'always',
      //     mjs: 'always',
      //     cjs: 'always',
      //   },
      // ],
    },
  },
  {
    name: 'Default rules',
    rules: {
      // '@typescript-eslint/no-empty-object-type': [
      //   'off',
      //   {allowEmptyObject: true},
      // ],

      // Core
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-console': 'warn',
      'no-fallthrough': 'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports'},
      ],
      '@typescript-eslint/no-inferrable-types': 'warn',

      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
    },
  },
  {
    name: 'temporary disable for my sanity',
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);

const browserApps = ['lib/example-ts-app', 'product/api'];

const browserConfigs = browserApps.map(appPath => ({
  files: [`${appPath}/**/*.{js,mjs,cjs,ts,mts,cts}`],
  // add global variables for browser environment
  name: 'browser global variables',
  languageOptions: {globals: globals.browser},
}));

export default [
  // Ignore all dist folders everywhere in the monorepo
  {
    name: 'Ignore all dist folders everywhere in the monorepo',
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  ...baseConfig,
  ...browserConfigs,
];
