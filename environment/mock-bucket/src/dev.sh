#!/bin/sh

# Ensure network exists (create only if not present)
docker network inspect dpr-network >/dev/null 2>&1 || \
    docker network create dpr-network

# Ensure volume exists (create only if not present)
docker volume inspect azurite-data >/dev/null 2>&1 || \
    docker volume create azurite-data

docker run --rm -p 10000:10000 -p 10001:10001 -p 10002:10002 --name mock-bucket -v azurite-data:/data --network dpr-network mcr.microsoft.com/azure-storage/azurite 
