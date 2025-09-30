# Use the Bun image as the base image
FROM oven/bun:1.2.10 AS build

# Set the working directory in the container
WORKDIR /app

# Copy and install dependencies
COPY package.json package.json
COPY bun.lock bun.lock

# Copy over the files for this application
COPY apps/react-app/package.json apps/react-app/package.json

# Copy over the files for the dependency packages
COPY packages/ui/package.json packages/ui/package.json
COPY packages/dev-config/package.json packages/dev-config/package.json

# Install dependencies
RUN bun install

# Copy the directory contents into the container at /app
COPY apps/react-app apps/react-app
COPY packages/ui packages/ui
COPY packages/dev-config packages/dev-config

ENV NODE_ENV=production

WORKDIR /app/apps/react-app

RUN bun run build

ENV NODE_ENV=production
ENV PORT=3000

# Copy the entrypoint script into the container
COPY docker-entrypoint.sh docker-entrypoint.sh

# Expose the port on which the API will listen
EXPOSE 3000

# Run the server when the container launches
ENTRYPOINT ["./docker-entrypoint.sh", "DPR React App", "/app/apps/react-app"]
CMD ["bun src/server.tsx"]
