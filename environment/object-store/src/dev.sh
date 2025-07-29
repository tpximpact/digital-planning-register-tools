#!/bin/sh

# Ensure network exists (create only if not present)
docker network inspect dpr-tools >/dev/null 2>&1 || \
    docker network create dpr-tools

# Ensure volume exists (create only if not present)
docker volume inspect minio-data >/dev/null 2>&1 || \
    docker volume create minio-data

docker run --rm -p 9000:9000 -p 9001:9001 \
    --env-file .env.development \
    --name object-store \
    -v minio-data:/data --network dpr-tools \
    quay.io/minio/minio server /data --console-address ":9001"