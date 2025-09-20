// import { describe, it, expect } from 'bun:test'
// import { Value } from '@sinclair/typebox/value'
// import { BopsSearchEndpoint } from '.'
// import fs from 'fs'
// import path from 'path'

// describe.skip('BopsSearchEndpoint TypeBox schema', () => {
//   const searchDir = path.join(__dirname, '../../../fixtures/bops/search')
//   const searchFiles = fs
//     .readdirSync(searchDir)
//     .filter((file) => file.startsWith('search-') && file.endsWith('.json'))

//   if (!searchFiles || searchFiles.length === 0) {
//     throw new Error('No search files found in fixtures directory')
//   }

//   for (const file of searchFiles) {
//     const filePath = path.join(searchDir, file)
//     const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//     it(`validates ${file} as a correct object`, () => {
//       expect(Value.Check(BopsSearchEndpoint, example)).toBe(true)
//     })
//   }

//   it('rejects an invalid object', () => {
//     const invalid = {}
//     expect(Value.Check(BopsSearchEndpoint, invalid)).toBe(false)
//   })
// })
