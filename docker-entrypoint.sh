#!/bin/sh

# Accept parameters as positional arguments, with defaults
APP_NAME="${1:-DPR API}"
APP_PATH="${2:-/app/apps/api}"
APP_EXEC="${3:-./server}"


echo "Starting $APP_NAME..."

# Ensure the working directory is set to the DPR API directory
cd "$APP_PATH" || exit 1

# Run the Bun command to start the server

# If there are additional commands, run them instead of the app
if [ "$#" -gt 3 ]; then
  echo "Executing additional commands: $@"
  shift 3
  exec "$@"
else
  echo "Running $APP_EXEC"
  exec $APP_EXEC
fi


# bash version of the above

# $APP_EXEC &
# # Wait for the server to start
# sleep 5

# # Execute any additional commands passed to the entrypoint script
# if [ "$#" -gt 0 ]; then
#   echo "Executing additional commands: ${@:4}"
#   exec "${@:4}"
# else
#   echo "No additional commands to execute."
# fi