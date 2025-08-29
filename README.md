# dpr-api

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

This repository is a monorepo. The structure is as follows

- apps contains your applications (client and server)
- packages contains shared libraries used across applications
- components contains shared libraries used across applications
- infrastructure holds infrastructure-related files like Dockerfiles

## Run locally

```bash
# make sure you have latest bun version!
bun upgrade

bun install

docker compose up -d
bun run dev

bun run seed

# view the API at
http://localhost:4000

# view admin at
http://localhost:3000

# view storybook at
http://localhost:6006

# to run in individual packages
bun workspace components bun add govuk-frontend
bun workspace @dpr/api bun run dev
bun workspace @dpr/api bun run dev

#
bun run typecheck

```

## Admin

You may need .env instead of .env.development

```
bun run workspace @dpr/admin bun run db:studio
bunx drizzle-kit generate --custom --name=seed-clients

```

### Database migrations:

If you want to make changes to the client table in the database, for example adding a new column, follow the instructions below:

Make changes to the clients pgTable in `apps/admin/src/db/client.ts`. Run the following commands:

- `bun workspace @dpr/admin bunx drizzle-kit generate`

  This will generate a new migration file in `apps/admin/migrations`

- `bun workspace @dpr/admin bunx drizzle-kit migrate`

  This will apply the new migration to the database table

## Deploy

```bash
bun run docker
docker compose up -d
```

### Bun things

```bash

# elide-lines needed for now https://github.com/oven-sh/bun/issues/17918
bun run --elide-lines 0 --filter='@apps/dpr-api'  config

# or https://bun.com/docs/runtime/bunfig#bun-run
bun run --filter='@apps/dpr-api' -c=bunfig.toml config

# or use our script
bun workspace @dpr/api bun run config
```

---

## Docker

```bash
docker compose up -d
```

### Debugging docker

```bash
docker compose build  --progress=plain --no-cache
```

## Typescript notes

Currently `apps/server/dpr-api` uses

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

## mock-bucket

Download https://azure.microsoft.com/en-us/products/storage/storage-explorer/#Download-4

## Script naming conventions

- `seed` - will run seed scripts, initialisations etc called immediatley after dev, startr or serve

## Experimental environment

```sh
docker compose -f environment/docker-compose.yml up -d
```
