#!/usr/bin/env bun
import path from 'path'
import { search } from './utils/search'
import { downloadReferences } from './utils/download-references'

export interface Config {
  source: string
  apiBaseUrl: string
  outputDir: string
  endpoints: { endpoint: string; filePrefix: string; paginates: boolean }[]
}

const configs: Config[] = [
  {
    source: 'bops',
    apiBaseUrl:
      'https://camden.bops-staging.services/api/v2/public/planning_applications',
    outputDir: path.join(__dirname, '..', 'src', 'fixtures', 'bops'),
    endpoints: [
      { endpoint: '', filePrefix: 'show', paginates: false },
      { endpoint: 'documents', filePrefix: 'documents', paginates: false },
      {
        endpoint: 'comments/public',
        filePrefix: 'publicComments',
        paginates: false
      },
      {
        endpoint: 'comments/specialist',
        filePrefix: 'specialistComments',
        paginates: false
      },
      { endpoint: 'submission', filePrefix: 'submission', paginates: false }
    ]
  },
  {
    source: 'dpr',
    apiBaseUrl:
      'http://localhost:3000/docs/json?handler=ApiV1&method=%method%&source=bops&council=camden',
    outputDir: path.join(__dirname, '..', 'src', 'fixtures', 'dpr'),
    endpoints: [
      { endpoint: 'show', filePrefix: 'show', paginates: false },
      { endpoint: 'documents', filePrefix: 'documents', paginates: false },
      {
        endpoint: 'publicComments',
        filePrefix: 'publicComments',
        paginates: false
      },
      {
        endpoint: 'specialistComments',
        filePrefix: 'specialistComments',
        paginates: false
      },
      {
        endpoint: 'applicationSubmission',
        filePrefix: 'submission',
        paginates: false
      }
    ]
  }
]

async function runAllDownloads() {
  for (const config of configs) {
    try {
      const references: string[] = await search(config)
      if (references?.length) {
        console.log(`\n\n[${config.source}] Found references:`, references)
        await Promise.all(
          config.endpoints.map(({ endpoint, filePrefix, paginates }) =>
            downloadReferences(
              config,
              references,
              endpoint,
              filePrefix,
              paginates
            )
          )
        )
        console.log(`[${config.source}] Fixtures downloaded successfully.`)
      } else {
        console.log(`[${config.source}] No references found.`)
      }
    } catch (err) {
      console.error(`[${config.source}] Error downloading fixtures:`, err)
      process.exit(1)
    }
  }
}

runAllDownloads()
