<p align="center">
    <a href="https://planningregister.org/">
        <img src="logo.svg" height="80px" />               
    </a>
</p>
  
<p align="center">
    <em>Digital Planning Register</em>
</p>

---

<p align="center">
  <a href="screenshot.png" target="_blank" rel="noopener noreferrer">
     <img src="screenshot.png" height="250px" />     
  </a>
</p>

<p align="center">
    <em>Screenshot of the planning register frontend</em>         
</p>

---

# Introduction

This repository contains the backend code for the Digital Planning Register (DPR) project. The DPR is a system for indexing and viewing public planning applications in the [Post-submission published application](https://github.com/theopensystemslab/digital-planning-data-schemas/) format. The data is sourced from local authorities' ODP compliant APIs, indexed, and made available via a public API and web interface.

- You can view the live site at [planningregister.org](https://planningregister.org).
- To read more about the schema, see the [digital-planning-data-schemas](https://github.com/theopensystemslab/digital-planning-data-schemas/) repository.

This project was created using `bun init` in `bun v1.2.19`. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

Technologies used:

- [Bun](https://bun.com) - JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Elysia](https://elysiajs.com/) - TypeScript with End-to-End Type Safety, type integrity, and exceptional developer experience. Supercharged by Bun.
- [TypeBox](https://github.com/sinclairzx81/typebox) - A Runtime Type System for JavaScript
- [Open API](https://www.openapis.org/) - API specification
- [JSON schema](https://json-schema.org/) - JSON schema standard
- [React](https://react.dev/) - Frontend library
- [Next.js](https://nextjs.org/) - React framework
- [picocss](https://picocss.com/) - CSS framework
- [GovUK Frontend](https://design-system.service.gov.uk/) - Design system for public sector services
- [Storybook](https://storybook.js.org/) - UI component development environment
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe SQL ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/#/) - Git hooks
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## Monorepo Structure

This repository is a _monorepo_. The structure is as follows:

### **`/apps`**

Contains applications, client and server, such as the api and the admin interface for managing the dpr

- `@dpr/admin` - The administration interface for the Digital Planning Register
- `@dpr/api` - The application programming interface (API) for the Digital Planning Register

### **`/converters`**

Contains methods and functions used to convert different payloads into ODP format

- `@dpr/converter-bops` - A utility module for converting data from the Back Office Planning System (BOPS) API to the ODP Post-submission format.

### **`/handlers`**

Contains methods and functions used to handle incoming requests and responses

- `@dpr/handler-bops` - An elysia plugin for handling requests and responses from the Back Office Planning System (BOPS) API.

### **`/packages`**

Contains shared libraries used across applications

- `@dpr/application-generator` - Generates dummy application data in Post-submission format for testing and development purposes
- `@dpr/config` - Configuration management for the packages in this monorepo, included eslint and base typescript configurations
- `@dpr/libs` - A shared library of common utilities to reduce code duplication and consolidate dependencies across packages.
- `@dpr/odp-schemas` - The post submission schema in typebox form - **eventually this will be replaced by the `digital-planning-data-schemas` package**
- `@dpr/ui` - Contains react components, styles and a storybook for the Digital Planning Register that comply with Post-submission schema. **Eventually all DPR components will come from here**

### **`/playground`**

> [!NOTE]
> Packages in here are not included in the `bun run` script and will need to be run manually with `bun run workspace`

A general purpose space for testing things out. A space to experiment with new ideas, packages, or technologies without affecting the main applications.

## Getting Started

You will need to have [Bun](https://bun.sh/) and [Docker](https://www.docker.com/) installed.

> [!TIP]
> Make sure you have the latest version of Bun by running `bun upgrade`.

To install dependencies, run:

```bash
bun install
```

To run the whole stack, use the following command:

```bash
docker compose up -d
bun run dev
bun run seed
```

You can then view the API at [http://localhost:4000](http://localhost:4000), the admin interface at [http://localhost:3000](http://localhost:3000), and Storybook at [http://localhost:6006](http://localhost:6006).

## Development Workflow

This repository has two helper scripts in the `scripts` directory:

- `run` - A script to run commands in the entire monorepo
- `workspace` - A script to run commands in a specific package

### Working with the Monorepo

There are standard commands in place across all packages. To use these scripts, you can run `bun run <command>` from the root of the repository and it will run the command in all packages that have that command defined in their `package.json`.

For example you can run the tests in all packages using:

```bash
bun run test
```

These scripts are **required** in every package's `package.json`:

> [!NOTE]
> eslint isn't fully set up yet so the commands may change, or in the case of nextjs applications it may already have its own linting command

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typeconfig": "tsc --showConfig",
    "lint": "eslint .",
    "format": "eslint . --fix"
  }
}
```

- `typecheck`: Type-check the codebase
- `typeconfig`: Show the TypeScript configuration (useful for debugging)
- `lint`: Lint the codebase using ESLint
- `format`: Format the codebase using ESLint with the `--fix` option

In addition, the following commands are used to setup the package's **development** environment:

```json
{
  "scripts": {
    "dev": "bun run --hot src/server.ts",
    "seed": "bun run scripts/seed.ts"
  }
}
```

- `dev`: Starts the development server
- `seed`: Seeds the package with any initial data

The following commands are used to run **tests**:

```json
{
  "scripts": {
    "test": "bun test",
    "test:unit": "bun test --filter 'unit'",
    "test:e2e": "bun test --filter 'e2e'",
    "coverage": "bun test --coverage"
  }
}
```

- `test`: Runs all tests, if `test:unit` and `test:e2e` are defined, it should run both
- `test:unit`: Runs unit tests only
- `test:e2e`: Runs end-to-end tests only
- `coverage`: Generates a test coverage report

For **production** builds and running the package in production mode, the following commands are used:

```json
{
  "scripts": {
    "build": "NODE_ENV=production bun build src/server.ts --outdir=dist --target=esnext",
    "start": "NODE_ENV=production bun dist/server.js",
    "serve": "bun run build && bun run start"
  }
}
```

- `build`: Builds the package for production
- `start`: Starts the package in production mode by directly executing the main entry point.
- `serve`: Combines `build` and `start` into a single command for convenience

The following commands are used to create a **production** Docker image:

```json
{
  "scripts": {
    "docker": "cd ../.. && docker build -t dpr-backend:<package-name> -f ./apps/<package-name>/Dockerfile ."
  }
}
```

- `docker`: Builds a Docker image for the package, replacing `<package-name>` with the actual name of the package

The following commands are **optional** utility scripts that can be included as needed:

```json
{
  "scripts": {
    "clean": "bun run scripts/clean.ts"
  }
}
```

- `clean`: Cleans up any build artifacts or temporary files

### Working with Individual Packages

To work within individual packages, you can use the `bun workspace` command. For example, to run the dev server for the API and Admin packages, run:

```bash
bun workspace @dpr/api bun run dev
bun workspace @dpr/admin bun run dev
```

> [!TIP]
> The `bun workspace` command allows you to run commands within a specific package in the monorepo without cding into its directory.

### Creating new packages

When creating a new package you will need to ensure that the standard commands are included in the `package.json` of the new package.

```json
{
  "name": "@dpr/<package-name>",
  "description": "<package-description>",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typeconfig": "tsc --showConfig",
    "lint": "eslint .",
    "format": "eslint . --fix",
    "dev": "bun run --hot src/server.ts",
    "seed": "bun run scripts/seed.ts",
    "test": "bun test",
    "test:unit": "bun test --filter 'unit'",
    "test:e2e": "bun test --filter 'e2e'",
    "coverage": "bun test --coverage",
    "build": "NODE_ENV=production bun build src/server.ts --outdir=dist --target=esnext",
    "start": "NODE_ENV=production bun dist/server.js",
    "serve": "bun run build && bun run start",
    "docker": "cd ../.. && docker build -t dpr-backend:<package-name> -f ./apps/<package-name>/Dockerfile .",
    "clean": "bun run scripts/clean.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@dpr/config": "workspace:*",
    "typescript": "^5"
  }
}
```

If you are using any **bun commands** in your package you will need to install the `@types/bun` package as a dev dependency. [See Bun docs](https://bun.sh/docs/typescript#typescript-typings) for more details.

```bash
bun add -d @types/bun # dev dependency
```

If you are using the **Post-submission schema** in your package you should use the `digital-planning-data-schemas` package. Add the following to your dependencies:

```json
{
  "digital-planning-data-schemas": "file:../../digital-planning-data-schemas-0.7.5.tgz"
}
```

The `@dpr/odp-schemas` package is a _temporary_ measure until the `digital-planning-data-schemas` package contains typebox types.

```json
{
  "@dpr/odp-schemas": "workspace:*"
}
```

## Package Details

Details about each package, its purpose, and how to work with it.

### `@dpr/admin` (apps/admin)

The administration interface for the Digital Planning Register

```bash
bun run workspace @dpr/admin bun run db:studio
bunx drizzle-kit generate --custom --name=seed-clients
```

### `@dpr/api` (apps/api)

The application programming interface (API) for the Digital Planning Register

### `@dpr/converter-bops` (converters/converter-bops)

A utility module for converting data from the Back Office Planning System (BOPS) API to the ODP Post-submission format.

### `@dpr/handler-bops` (handlers/handler-bops)

An elysia plugin for handling requests and responses from the Back Office Planning System (BOPS) API.

### `@dpr/application-generator` (packages/application-generator)

Generates dummy application data in Post-submission format for testing and development purposes

### - `@dpr/config` (packages/config)

Configuration management for the packages in this monorepo, included eslint and base typescript configurations

### - `@dpr/libs` (packages/libs)

A shared library of common utilities to reduce code duplication and consolidate dependencies across packages.

### - `@dpr/odp-schemas` (packages/odp-schemas)

The post submission schema in typebox form - **eventually this will be replaced by the `digital-planning-data-schemas` package**

### - `@dpr/ui` (packages/ui)

Contains react components, styles and a storybook for the Digital Planning Register that comply with Post-submission schema. **Eventually all DPR components will come from here**

## Configuration

@TODO

Each package has its own `.env.local` file for local development. You can create these files by copying the `.env.example` files in each package and filling in the required values.

> [!NOTE]
> Note: When `NODE_ENV=test`, `.env.local` is not loaded. [See Bun docs](https://bun.sh/docs/environment-variables#loading-environment-variables-from-env-files) for more details.

## Database & Migrations

> [!NOTE]
> The database is not currently being used in production but will be in the future

Currently the database is managed using [Drizzle ORM](https://orm.drizzle.team/).

If you want to make changes to the client table in the database, for example adding a new column, follow the instructions below:

Make changes to the clients pgTable in `apps/admin/src/db/client.ts`. Run the following commands:

- `bun workspace @dpr/admin bunx drizzle-kit generate`

  This will generate a new migration file in `apps/admin/migrations`

- `bun workspace @dpr/admin bunx drizzle-kit migrate`

  This will apply the new migration to the database table

## Deployment

@TODO

## Scripts & Conventions

### Bun things

```bash

# elide-lines needed for now https://github.com/oven-sh/bun/issues/17918
bun run --elide-lines 0 --filter='@apps/dpr-api'  config

# or https://bun.com/docs/runtime/bunfig#bun-run
bun run --filter='@apps/dpr-api' -c=bunfig.toml config

# or use our script
bun workspace @dpr/api bun run config
```

### Docker:

To debug docker builds you can run:

```bash
docker compose build  --progress=plain --no-cache
```

### Typescript

Currently `apps/api` uses

```json
{
  "target": "esnext",
  "module": "preserve",
  "moduleResolution": "bundler"
}
```

but if we get any issues (unlikely) we can switch to

```json
{
  "target": "es2021",
  "module": "es2022",
  "moduleResolution": "node10"
}
```

## Troubleshooting & FAQ

### I have a question or issue

If your question or issue relates to the **Post-submission schema** please raise it in the [digital-planning-data-schemas](https://github.com/your-org/digital-planning-data-schemas/issues) repository.

If your question or issue relates to the **MHCLG schema(s)** please raise it in one of the following repositories:

- **Designing planning and housing data that works for everyone**
  - repository: [planning-data-design](https://github.com/digital-land/planning-data-design)
  - website: [design.planning.data.gov.uk](https://design.planning.data.gov.uk/)
- **Planning application submissions project**
  - repository: [planning-application-data-specification](https://github.com/digital-land/planning-application-data-specification)
  - website: [design.planning.data.gov.uk/project/planning-applications](https://design.planning.data.gov.uk/project/planning-applications)

## Contributing

The DPR is happy to accept community contribution. Please ensure you submit an issue before submitting a pull request. We prefer open community discussion before accepting new features. If your contribution or issue relates to the schema please raise it in the [digital-planning-data-schemas](https://github.com/your-org/digital-planning-data-schemas/issues) repository.

## License

License information.
