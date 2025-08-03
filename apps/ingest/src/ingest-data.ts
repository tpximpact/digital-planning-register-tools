import { Database } from 'duckdb'
import { BlobServiceClient } from '@azure/storage-blob'
import { env } from '@libs'
import type { PostSubmissionPlanningApplication } from '@apps/server-api/schemas'

// DuckDB instance
const db = new Database(':memory:')

// Azure Blob Storage config
const AZURITE_BLOB_URL = env?.AZURE_BLOB_URL
const AZURITE_ACCOUNT = env?.AZURE_ACCOUNT
const AZURITE_KEY = env?.AZURE_KEY
const containerName = 'data'

if (!AZURITE_BLOB_URL || !AZURITE_ACCOUNT || !AZURITE_KEY) {
  throw new Error(
    'Missing required environment variables for Azurite connection'
  )
}

// Create BlobServiceClient for Azurite
const blobServiceClient = new BlobServiceClient(
  AZURITE_BLOB_URL,
  new (await import('@azure/storage-blob')).StorageSharedKeyCredential(
    AZURITE_ACCOUNT,
    AZURITE_KEY
  )
)

function isPostSubmissionPlanningApplication(
  obj: any
): obj is PostSubmissionPlanningApplication {
  return typeof obj.id === 'number' && typeof obj.name === 'string'
  // Add more property checks as needed
}

async function ingestBlobsToDuckDB(tableName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const allRows: PostSubmissionPlanningApplication[] = []

  // List blobs in the container
  for await (const blob of containerClient.listBlobsFlat()) {
    if (!blob.name.endsWith('.json')) continue
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name)
    const downloadResponse = await blockBlobClient.download()
    const downloaded = await streamToString(
      downloadResponse.readableStreamBody ?? null
    )
    const data = JSON.parse(downloaded)

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (isPostSubmissionPlanningApplication(item)) {
          allRows.push(item)
        }
      })
    } else {
      if (isPostSubmissionPlanningApplication(data)) {
        allRows.push(data)
      }
    }
  }

  if (allRows.length === 0) {
    console.log('No data found in blobs.')
    return
  }

  const firstRow = allRows[0]
  if (!firstRow) {
    throw new Error('No valid rows to infer columns from')
  }

  // Infer columns from the first row
  const columns = Object.keys(firstRow)
  const columnDefs = columns.map((col) => `${col} VARCHAR`).join(', ')

  // Create table
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`)

  // Insert rows
  const insertStmt = db.prepare(
    `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`
  )
  for (const row of allRows) {
    insertStmt.run(
      ...columns.map((col) => (row as Record<string, unknown>)[col])
    )
  }
  insertStmt.finalize()

  console.log(`Ingested ${allRows.length} rows into ${tableName}`)
}

// Helper to convert stream to string
async function streamToString(
  readableStream: NodeJS.ReadableStream | null
): Promise<string> {
  if (!readableStream) return ''
  const chunks: Buffer[] = []
  for await (const chunk of readableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

// Usage
const tableName = 'my_data_lake'
ingestBlobsToDuckDB(tableName)
  .then(() => console.log('Ingestion complete'))
  .catch((err) => console.error('Ingestion error:', err))
