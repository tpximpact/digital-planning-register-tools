// import type { PostSubmissionPlanningApplication } from '@apps/server-api/schemas'
// import duckdb from 'duckdb'

// export const db = new duckdb.Database(':memory:')

// export function connectDuckDBToMinio(
//   endpoint: string,
//   accessKey: string,
//   secretKey: string
// ) {
//   if (!endpoint || !accessKey || !secretKey) {
//     throw new Error(
//       'Missing required environment variables for MinIO connection'
//     )
//   }

//   // Load DuckDB httpfs extension for S3 support
//   db.run('INSTALL httpfs;')
//   db.run('LOAD httpfs;')

//   // Set S3 connection parameters
//   db.run(`SET s3_endpoint='${endpoint}';`)
//   db.run(`SET s3_access_key_id='${accessKey}';`)
//   db.run(`SET s3_secret_access_key='${secretKey}';`)
//   db.run('SET s3_use_ssl=false;')
// }

// export function queryMinioParquet(
//   bucket: string,
//   parquetFile: string
// ): Promise<PostSubmissionPlanningApplication[]> {
//   if (!bucket) {
//     throw new Error(
//       'Missing required environment variables for MinIO connection'
//     )
//   }
//   return new Promise((resolve, reject) => {
//     db.all(
//       `SELECT * FROM read_parquet('s3://${bucket}/${parquetFile}')`,
//       (err, rows) => {
//         if (err) return reject(err)
//         resolve(rows as PostSubmissionPlanningApplication[])
//       }
//     )
//   })
// }
