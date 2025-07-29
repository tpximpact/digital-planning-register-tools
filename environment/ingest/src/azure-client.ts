import { BlobServiceClient } from '@azure/storage-blob'
import { env } from '@libs'

const AZURITE_BLOB_URL = env?.AZURE_BLOB_URL
const AZURITE_ACCOUNT = env?.AZURE_ACCOUNT
const AZURITE_KEY = env?.AZURE_KEY
const AZURITE_CONTAINER_NAME = env?.AZURE_CONTAINER_NAME

if (
  !AZURITE_BLOB_URL ||
  !AZURITE_ACCOUNT ||
  !AZURITE_KEY ||
  !AZURITE_CONTAINER_NAME
) {
  throw new Error(
    'Missing required environment variables for Azurite connection'
  )
}

// Create BlobServiceClient for Azurite
export const blobServiceClient = new BlobServiceClient(
  AZURITE_BLOB_URL,
  new (await import('@azure/storage-blob')).StorageSharedKeyCredential(
    AZURITE_ACCOUNT,
    AZURITE_KEY
  )
)

export const containerClient = blobServiceClient.getContainerClient(
  AZURITE_CONTAINER_NAME
)
