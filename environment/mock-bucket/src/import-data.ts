import { BlobServiceClient } from '@azure/storage-blob'
import { env } from '@libs'
import * as fs from 'fs'
import * as path from 'path'

const AZURITE_BLOB_URL = env?.AZURE_BLOB_URL
const AZURITE_ACCOUNT = env?.AZURE_ACCOUNT
const AZURITE_KEY = env?.AZURE_KEY

if (!AZURITE_BLOB_URL || !AZURITE_ACCOUNT || !AZURITE_KEY) {
  throw new Error(
    'Missing required environment variables for Azurite connection'
  )
}

const containerName = 'data'
const dataDir = path.resolve(__dirname, '../data')

// Create BlobServiceClient for Azurite
const blobServiceClient = new BlobServiceClient(
  `${AZURITE_BLOB_URL}`,
  new (await import('@azure/storage-blob')).StorageSharedKeyCredential(
    AZURITE_ACCOUNT,
    AZURITE_KEY
  )
)

async function main() {
  // Ensure container exists
  const containerClient = blobServiceClient.getContainerClient(containerName)
  await containerClient.createIfNotExists()

  // Ingest all files from dataDir
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'))
  for (const file of files) {
    const filePath = path.join(dataDir, file)
    if (fs.statSync(filePath).isFile()) {
      const blockBlobClient = containerClient.getBlockBlobClient(file)
      await blockBlobClient.uploadFile(filePath)
      console.log(`Uploaded ${file} to Azurite container '${containerName}'`)
    }
  }
}

main().catch((err) => {
  console.error('Error ingesting files to Azurite:', err)
})
