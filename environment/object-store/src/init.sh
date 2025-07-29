#!/bin/sh

docker run --rm --name object-init \
  --network dpr-tools \
  --env-file .env.development \
  --entrypoint /bin/sh \
  minio/mc:latest -c \
    "
      mc alias set myminio http://object-store:9000 minio minio123 && \
      mc mb myminio/private-applications && \
      mc mb myminio/public-applications
    "