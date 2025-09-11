import path from 'path'
import fs from 'fs'
import { downloadFixture } from './download-fixture'
import { BopsSearchEndpoint } from '../../schemas/bops/search'
import type { Config } from '../download-fixtures'

export const search = async (config: Config): Promise<string[]> => {
  console.log('\n\nDownloading search fixtures and references')

  // Build search URL based on source
  const searchUrl =
    config.source === 'bops'
      ? `${config.apiBaseUrl}/search`
      : config.source === 'dpr'
        ? `${config.apiBaseUrl.replace('%method%', 'search')}`
        : (() => {
            throw new Error(`Unknown source: ${config.source}`)
          })()

  const searchDir = path.join(config.outputDir, 'search')
  const getSearchFile = (page: number) =>
    path.join(searchDir, `search-page-${page}.json`)

  try {
    // Download first page
    await downloadFixture(searchUrl, searchDir, getSearchFile(1))
    const firstPage: BopsSearchEndpoint = JSON.parse(
      fs.readFileSync(getSearchFile(1), 'utf8')
    )

    if (!firstPage.data) return []

    // Helper to extract references from a page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractReferences = (data: any[]) =>
      config.source === 'bops'
        ? data.map((item) => item.application.reference)
        : data.map((item) => item.data.application.reference)

    const references = extractReferences(firstPage.data)
    const totalPages = Math.min(firstPage.pagination?.totalPages ?? 1, 5)

    if (totalPages > 1) {
      const pageNumbers = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2
      )

      // Download remaining pages in parallel
      await Promise.all(
        pageNumbers.map(async (page) => {
          const pagedUrl =
            config.source === 'bops'
              ? `${searchUrl}?page=${page}`
              : `${searchUrl}&page=${page}`
          await downloadFixture(pagedUrl, searchDir, getSearchFile(page))
        })
      )

      // Collect references from additional pages
      for (const page of pageNumbers) {
        const pagedResults: BopsSearchEndpoint = JSON.parse(
          fs.readFileSync(getSearchFile(page), 'utf8')
        )
        if (pagedResults.data) {
          references.push(...extractReferences(pagedResults.data))
        }
      }
    }

    return references
  } catch (err) {
    console.error('Error downloading search fixture:', err)
    process.exit(1)
  }
}
