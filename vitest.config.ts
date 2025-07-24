import {loadEnv} from 'vite';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          env: loadEnv('test', `${process.cwd()}/product/api`, ''),
          name: '@product/api',
        },
      },
    ],
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60,
      },
    },
  },
});
