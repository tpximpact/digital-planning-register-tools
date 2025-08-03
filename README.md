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

http://localhost:4000
# http://localhost:3000
http://localhost:3001

bun add --filter='components' govuk-frontend

bun run --filter '*' dev

./workspace.sh --filter='@apps/server-api' dev

./workspace.sh --filter='@apps/client-api' dev

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

# or
./run.sh --filter='@apps/dpr-api' config

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
