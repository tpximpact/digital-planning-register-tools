// Helper to convert stream to string
export async function streamToString(
  readableStream: NodeJS.ReadableStream | null
): Promise<string> {
  if (!readableStream) return ''
  const chunks: Buffer[] = []
  for await (const chunk of readableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}
