import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsShowEndpoint } from '.'
import fs from 'fs'
import path from 'path'

const showDir = path.join(__dirname, '../../../fixtures/bops/show')
const showFiles = fs
  .readdirSync(showDir)
  .filter((file) => file.startsWith('show-') && file.endsWith('.json'))

describe('BopsShowEndpoint TypeBox schema', () => {
  if (!showFiles || showFiles.length === 0) {
    throw new Error('No show files found in fixtures directory')
  }

  for (const file of showFiles) {
    const filePath = path.join(showDir, file)
    const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    it(`validates ${file} as a correct object`, () => {
      expect(Value.Check(BopsShowEndpoint, example)).toBe(true)
    })
  }

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsShowEndpoint, invalid)).toBe(false)
  })
})
