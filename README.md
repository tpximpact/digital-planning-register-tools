# dpr-api

## Monorepo

```
yarn install
```

## Commands

```sh
# Check types in all projects
yarn run typecheck

# Lint
yarn run lint

# Lint and fix all projects
yarn run lint-fix

# Lint just code
yarn run lint:code

# Lint just formatting
yarn run lint:format



# Link and fix and prettify all projects
yarn run format

# Ensure that multiple packages requiring the same dependency define the same version, so that every package requires eg. react@16.4.2, instead of a combination of react@16.4.2, react@0.15.9, and react@16.0.0.
yarn run sync-packages

# Find unused dependencies, exports and files in projects
yarn run knip

# Find unused dependencies, exports and files in projects and Fix
yarn run knip:fix
```

## Product

Anything that is DPR specific

```sh
yarn run typecheck
yarn run lint:code
yarn run lint:format
yarn run lint
yarn run lint-fix
yarn run format
yarn run sync-packages
yarn run knip
yarn run knip:fix
yarn run prepare
```

### API

The api designed to mock an ODP compliant endpoint. For development use, designed to be used by DPR when developing and others for examples on how the API should be implemented.

```sh

yarn workspace @product/api run typecheck
yarn workspace @product/api run config
yarn workspace @product/api run config:prod
yarn workspace @product/api run generate
yarn workspace @product/api run dev
yarn workspace @product/api run start
yarn workspace @product/api run test
yarn workspace @product/api run coverage
yarn workspace @product/api run performance
yarn workspace @product/api run clean

```

### Open API

```sh

yarn workspace @product/open-api run typecheck
yarn workspace @product/open-api run config
yarn workspace @product/open-api run generate
yarn workspace @product/open-api run build
yarn workspace @product/open-api run clean

```

## Lib

Packages that can go anywhere, no dependencies on us

### odp-schema-repo

This is a git submodule

```
yarn workspace digital-planning-data-schemas build-json-examples
```

### ODP package process

Go to odp main branch and `git pull`

Add this to `package.json`

```
  "files": [
    "build/types",
    "build/schemas",
    "build/examples"
  ],
  "exports": {
    "./types/*": "./build/types/*",
    "./schemas/*": "./build/schemas/*",
    "./examples/*": "./build/examples/*"
  },
```

then run:

```sh
# in ODP repo
pnpm exec tsc
pnpm pack
mv digital-planning-data-schemas-0.7.5.tgz ~/src/camden/dpr-api

# in project repo
cd ~/src/camden/dpr-api
yarn install
```

Add to packages using

```json
    "@odp/schemas": "file:../../digital-planning-data-schemas-0.7.5.tgz",
```
