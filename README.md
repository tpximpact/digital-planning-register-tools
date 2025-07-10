# dpr-api

## Setup

```
<!-- clone the repo -->

git submodule update --init --recursive

yarn install
```

## Update all submodules to their latest remote commits with:

```
git submodule update --remote --merge
```

## Product

Anything that is DPR specific

### API

The api designed to mock an ODP compliant endpoint. For development use, designed to be used by DPR when developing and others for examples on how the API should be implemented.

`yarn workspace @product/api run dev`

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
