# CMD ["tail", "-f", "/dev/null"]
# ---- Build Stage ----
# Use the Bun image as the base image
FROM oven/bun:1.2.23 AS build

# Set the working directory in the container
WORKDIR /app

# Copy and install dependencies
COPY package.json package.json
COPY bun.lock bun.lock
COPY bunfig.toml bunfig.toml

# Copy over the files for this application
COPY apps/api/package.json apps/api/package.json

# Copy over catalog
COPY package.json package.json

# Copy over the files for the dependency packages
COPY converters/bops/package.json converters/bops/package.json
COPY handlers/bops/package.json handlers/bops/package.json
COPY handlers/local/package.json handlers/local/package.json
COPY packages/application-generator/package.json packages/application-generator/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/dev-config/package.json packages/dev-config/package.json
COPY packages/odp-schemas/package.json packages/odp-schemas/package.json
COPY packages/libs/package.json packages/libs/package.json

# Copy the directory contents into the container at /app
COPY apps/api apps/api
COPY converters/bops converters/bops
COPY handlers/bops handlers/bops
COPY handlers/local handlers/local
COPY packages/application-generator packages/application-generator
COPY packages/config packages/config
COPY packages/dev-config packages/dev-config
COPY packages/odp-schemas packages/odp-schemas
COPY packages/libs packages/libs
COPY digital-planning-data-schemas-0.7.5.tgz digital-planning-data-schemas-0.7.5.tgz

# Install dependencies
RUN bun install

WORKDIR /app/apps/api
ENV NODE_ENV=production
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:1.2.23 AS prod

ENV NODE_ENV=production
WORKDIR /app

# Copy only the built output and runtime files from build stage
COPY --from=build /app/apps/api/server ./

# Copy the entrypoint script into the container
COPY docker-entrypoint.sh docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

# Expose the port on which the API will listen
EXPOSE 3000

# Run the server when the container launches
ENTRYPOINT ["./docker-entrypoint.sh", "DPR API", "."]
CMD ["./server"]
