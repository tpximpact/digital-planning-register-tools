// import { describe, it, expect } from 'bun:test'
// import { Value } from '@sinclair/typebox/value'
// import { BopsDocumentsEndpoint } from '.'
// import fs from 'fs'
// import path from 'path'

// describe.skip('BopsDocumentsEndpoint TypeBox schema', () => {
//   const documentsDir = path.join(__dirname, '../../../fixtures/bops/documents')
//   const documentFiles = fs
//     .readdirSync(documentsDir)
//     .filter((file) => file.startsWith('documents-') && file.endsWith('.json'))

//   if (!documentFiles || documentFiles.length === 0 || !documentFiles[0]) {
//     throw new Error('No document files found in fixtures directory')
//   }

//   for (const file of documentFiles) {
//     const filePath = path.join(documentsDir, file)
//     const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//     it(`validates ${file} as a correct object`, () => {
//       expect(Value.Check(BopsDocumentsEndpoint, example)).toBe(true)
//     })
//   }

//   const filePath = path.join(documentsDir, documentFiles[0])
//   const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//   it('rejects an invalid object', () => {
//     const invalid = {}
//     expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
//   })

//   it('rejects an object with duplicate files', () => {
//     const invalid = { ...example, files: [example.files[0], example.files[0]] }
//     expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
//   })

//   it('rejects an object with invalid decision notice uri', () => {
//     const invalid = {
//       ...example,
//       decisionNotice: { ...example.decisionNotice, url: 'invalid-uri' }
//     }
//     expect(Value.Check(BopsDocumentsEndpoint, invalid)).toBe(false)
//   })
// })
