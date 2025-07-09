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
