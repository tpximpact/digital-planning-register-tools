import fs from 'fs'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const downloadFixture = async (
  url: string,
  outputDir: string,
  outputFile: string
) => {
  await sleep(5000) // Wait for 5 seconds before downloading

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    )
  }
  const data = await response.json()

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Downloaded fixture to ${outputFile}`)
}
