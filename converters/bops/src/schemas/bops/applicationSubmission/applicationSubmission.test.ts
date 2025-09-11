import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsApplicationSubmissionEndpoint } from '.'
import fs from 'fs'
import path from 'path'

const submissionsDir = path.join(__dirname, '../../../fixtures/bops/submission')
const submissionFiles = fs
  .readdirSync(submissionsDir)
  .filter((file) => file.startsWith('submission-') && file.endsWith('.json'))

describe('BopsApplicationSubmissionEndpoint TypeBox schema', () => {
  if (submissionFiles.length === 0) {
    throw new Error('No submission files found in fixtures directory')
  }

  for (const file of submissionFiles) {
    const filePath = path.join(submissionsDir, file)
    const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    it(`validates ${file} as a correct object`, () => {
      expect(Value.Check(BopsApplicationSubmissionEndpoint, example)).toBe(true)
    })
  }

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsApplicationSubmissionEndpoint, invalid)).toBe(false)
  })
})
