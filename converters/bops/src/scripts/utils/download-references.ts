import path from 'path'
import fs from 'fs'
import { downloadFixture } from './download-fixture'
import type { Config } from '../download-fixtures'

export const downloadReferences = async (
  config: Config,
  references: string[],
  endpoint: string,
  filePrefix = endpoint,
  paginates = false
): Promise<void> => {
  console.log(`\n\nDownloading ${filePrefix} fixtures...`)
  const outputDir = path.join(config.outputDir, filePrefix)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Helper to build URLs for each source
  const buildUrl = (reference: string, page?: number) => {
    if (config.source === 'bops') {
      let url = `${config.apiBaseUrl}/${reference}${endpoint ? `/${endpoint}` : ''}`
      if (page !== undefined) url += `?page=${page}`
      return url
    } else if (config.source === 'dpr') {
      let url = `${config.apiBaseUrl.replace('%method%', endpoint)}&reference=${reference}`
      if (page !== undefined) url += `&page=${page}`
      return url
    } else {
      throw new Error(`Unknown source: ${config.source}`)
    }
  }

  for (let i = 0; i < references.length; i++) {
    const reference = references[i]

    if (!reference) {
      console.warn(`Skipping empty reference at index ${i}`)
      continue
    }

    // @TODO fix to work with bops' inconsistent pagination styles
    if (paginates) {
      // Download first page
      const urlFirst = buildUrl(reference, 1)
      const fileFirst = path.join(
        outputDir,
        `${filePrefix}-${i + 1}-page-1.json`
      )
      let totalPages = 1

      try {
        await downloadFixture(urlFirst, outputDir, fileFirst)
        console.log(`Downloaded ${urlFirst} to ${fileFirst}`)

        // Read the first page to get pagination info
        const firstPageData = JSON.parse(fs.readFileSync(fileFirst, 'utf8'))
        if (firstPageData?.pagination?.totalPages) {
          totalPages = firstPageData.pagination.totalPages
        }
      } catch (err) {
        console.error(`Error downloading ${urlFirst}:`, err)
        continue
      }

      // Download second page if it exists
      if (totalPages >= 2) {
        const urlSecond = buildUrl(reference, 2)
        const fileSecond = path.join(
          outputDir,
          `${filePrefix}-${i + 1}-page-2.json`
        )
        try {
          await downloadFixture(urlSecond, outputDir, fileSecond)
          console.log(`Downloaded ${urlSecond} to ${fileSecond}`)
        } catch (err) {
          console.error(`Error downloading ${urlSecond}:`, err)
        }
      }

      // Download last page if more than 2 pages
      if (totalPages > 2) {
        const urlLast = buildUrl(reference, totalPages)
        const fileLast = path.join(
          outputDir,
          `${filePrefix}-${i + 1}-page-last.json`
        )
        try {
          await downloadFixture(urlLast, outputDir, fileLast)
          console.log(`Downloaded ${urlLast} to ${fileLast}`)
        } catch (err) {
          console.error(`Error downloading ${urlLast}:`, err)
        }
      }
    } else {
      const url = buildUrl(reference)
      const file = path.join(outputDir, `${filePrefix}-${i + 1}.json`)
      try {
        await downloadFixture(url, outputDir, file)
        console.log(`Downloaded ${url} to ${file}`)
      } catch (err) {
        console.error(`Error downloading ${url}:`, err)
      }
    }
  }
}
