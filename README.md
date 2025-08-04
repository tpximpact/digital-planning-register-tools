# dpr-api

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

This repository is a monorepo. The structure is as follows

- apps contains your applications (client and server)
- packages contains shared libraries used across applications
- components contains shared libraries used across applications
- infrastructure holds infrastructure-related files like Dockerfiles

## Run locally

```bash
bun install

bun run dev

bun run seed

http://localhost:4000
# http://localhost:3000
http://localhost:3001


# to run in individual packages
bun workspace components bun add govuk-frontend
bun workspace @apps/server-api bun run dev
bun workspace @apps/client-api bun run dev

```

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
bun workspace @apps/server-api bun run config
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
