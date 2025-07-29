import { type PostSubmissionPlanningApplication } from '@apps/server-api/schemas'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@libs'

const MINIO_ENDPOINT = 'http://localhost:9000'
const MINIO_BUCKET = 'public-applications'
const MINIO_ACCESS_KEY = env?.MINIO_ROOT_USER
const MINIO_SECRET_KEY = env?.MINIO_ROOT_PASSWORD

if (
  !MINIO_ENDPOINT ||
  !MINIO_BUCKET ||
  !MINIO_ACCESS_KEY ||
  !MINIO_SECRET_KEY
) {
  throw new Error('Missing required environment variables for MinIO connection')
}

const s3 = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY
  },
  forcePathStyle: true
})

export async function uploadToMinio(
  obj: PostSubmissionPlanningApplication,
  key: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
      Body: JSON.stringify(obj, null, 2)
    })
  )
  console.log(`Uploaded ${key} to MinIO bucket ${MINIO_BUCKET}`)
}
