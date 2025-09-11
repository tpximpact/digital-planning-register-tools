import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsSpecialistCommentsEndpoint } from '.'
import fs from 'fs'
import path from 'path'

const specialistCommentsDir = path.join(
  __dirname,
  '../../../fixtures/bops/specialistComments'
)
const specialistCommentsFiles = fs
  .readdirSync(specialistCommentsDir)
  .filter(
    (file) => file.startsWith('specialistComments-') && file.endsWith('.json')
  )

describe('BopsSpecialistCommentsEndpoint TypeBox schema', () => {
  if (!specialistCommentsFiles || specialistCommentsFiles.length === 0) {
    throw new Error('No specialist comments files found in fixtures directory')
  }

  for (const file of specialistCommentsFiles) {
    const filePath = path.join(specialistCommentsDir, file)
    const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    it(`validates ${file} as a correct object`, () => {
      expect(Value.Check(BopsSpecialistCommentsEndpoint, example)).toBe(true)
    })
  }

  it('rejects an invalid object', () => {
    const invalid = {}
    expect(Value.Check(BopsSpecialistCommentsEndpoint, invalid)).toBe(false)
  })
})
