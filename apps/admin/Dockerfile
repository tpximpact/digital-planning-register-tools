FROM node:22-slim AS build

WORKDIR /app

# https://pnpm.io/installation#in-a-docker-container
RUN npm install -g bun

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY apps/next-example/package.json apps/next-example/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/dev-config/package.json packages/dev-config/package.json
COPY packages/libs/package.json packages/libs/package.json

RUN bun install

COPY apps/next-example apps/next-example
COPY packages/ui packages/ui
COPY packages/dev-config packages/dev-config
COPY packages/libs packages/libs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/next-example
RUN bun run build

# -----------
FROM node:22-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/apps/next-example/.next/standalone .

RUN chown nextjs:nodejs apps

USER nextjs

ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/next-example/server.js"]