import { containerClient } from './azure-client'
import { streamToString } from './utils'
import { Value } from '@sinclair/typebox/value'
import {
  PostSubmissionPlanningApplicationSchema,
  type PostSubmissionPlanningApplication
} from '@dpr/api/schemas'
import { uploadToMinio } from './store-client'

// Function to validate schema
function isValidPostSubmissionPlanningApplication(
  obj: unknown
): obj is PostSubmissionPlanningApplication {
  return Value.Check(PostSubmissionPlanningApplicationSchema, obj)
}

async function ingestBlobsToDuckDB() {
  for await (const blob of containerClient.listBlobsFlat()) {
    if (!blob.name.endsWith('.json')) continue
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name)
    const downloadResponse = await blockBlobClient.download()
    const downloaded = await streamToString(
      downloadResponse.readableStreamBody ?? null
    )
    let data: unknown
    try {
      data = JSON.parse(downloaded)
    } catch {
      console.warn(`Skipping ${blob.name}: invalid JSON`)
      continue
    }

    // If array, validate each; else, validate single object
    if (Array.isArray(data)) {
      for (const item of data) {
        if (isValidPostSubmissionPlanningApplication(item)) {
          // console.log(item)
          await uploadToMinio(item, `${item.id}.json`)
        } else {
          console.warn(`Invalid schema in ${blob.name} (id: ${item?.id})`)
        }
      }
    } else {
      if (isValidPostSubmissionPlanningApplication(data)) {
        // console.log(data)
        await uploadToMinio(
          data,
          `${(data as PostSubmissionPlanningApplication).id}.json`
        )
      } else {
        console.warn(`Invalid schema in ${blob.name}`)
      }
    }
  }
}

ingestBlobsToDuckDB().catch((err) => {
  console.error('Ingestion error:', err)
})
