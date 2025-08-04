# Paths

We don't always install our packages as npm packages, we use the paths feature in typescript and our monorepo to neatly link to other packages.

We don't always include all the paths but this file serves as a place to capture all the ones we've referenced throughout the repo.

Nb you may have to change the paths to fix any relevant links etc

```json
{
  "baseUrl": ".",
  "paths": {
    "@apps/server-api": ["../server-api/src/index.ts"],
    "@apps/server-api/*": ["../server-api/src/*"],
    "@apps/client-api": ["src/index.ts"],
    "@apps/client-api/*": ["src/*"],
    "@libs": ["../../packages/libs/src/index.ts"],
    "@libs/*": ["../../packages/libs/src/*"],
    "@ui": ["../../packages/ui/src/index.ts"],
    "@ui/*": ["../../packages/ui/src/*"],
    "@ui/components": ["../../packages/ui/src/components/index.ts"],
    "@ui/layouts": ["../../packages/ui/src/layouts/index.ts"]
  }
}
```
