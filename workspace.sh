#!/bin/sh

# Check if we are in the dpr-tools monorepo by verifying the package name
PKG_NAME=$(bun run get-package-name 2>/dev/null)

if [ "$PKG_NAME" != "dpr-tools" ]; then
  echo "Error: Not in the dpr-tools monorepo (package name: $PKG_NAME)"
  exit 1
fi


# Execute any additional commands passed to the entrypoint script
if [ "$#" -gt 0 ]; then
  # Pass control to the command line  
  exec bun run --elide-lines 0 "$@"
else
  echo "No command to execute."
fi

