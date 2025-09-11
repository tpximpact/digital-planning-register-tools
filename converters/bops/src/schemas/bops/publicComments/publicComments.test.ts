import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsPublicCommentsEndpoint } from '.'
import fs from 'fs'
import path from 'path'

const publicCommentsDir = path.join(
  __dirname,
  '../../../fixtures/bops/publicComments'
)
const publicCommentsFiles = fs
  .readdirSync(publicCommentsDir)
  .filter(
    (file) => file.startsWith('publicComments-') && file.endsWith('.json')
  )

describe('BopsPublicCommentsEndpoint TypeBox schema', () => {
  if (!publicCommentsFiles || publicCommentsFiles.length === 0) {
    throw new Error('No public comments files found in fixtures directory')
  }

  for (const file of publicCommentsFiles) {
    const filePath = path.join(publicCommentsDir, file)
    const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    it(`validates ${file} as a correct object`, () => {
      expect(Value.Check(BopsPublicCommentsEndpoint, example)).toBe(true)
    })
  }

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsPublicCommentsEndpoint, invalid)).toBe(false)
  })
})
