#!/bin/sh

# Accept parameters as positional arguments, with defaults
APP_NAME="${1:-DPR API}"
APP_PATH="${2:-/app/apps/server/dpr-api}"
APP_EXEC="${3:-./server}"


echo "Starting $APP_NAME..."

# Ensure the working directory is set to the DPR API directory
cd "$APP_PATH" || exit 1

# Run the Bun command to start the server

$APP_EXEC &
# Wait for the server to start
sleep 5

# Execute any additional commands passed to the entrypoint script
if [ "$#" -gt 0 ]; then
  echo "Executing additional commands: ${@:4}"
  exec "${@:4}"
else
  echo "No additional commands to execute."
fi