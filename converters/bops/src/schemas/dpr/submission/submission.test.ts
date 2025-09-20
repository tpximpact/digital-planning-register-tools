// import { describe, it, expect } from 'bun:test'
// import { Value } from '@sinclair/typebox/value'
// import { DprApplicationSubmissionEndpoint } from '.'
// import { debugSchema } from '../../../utils/debugSchema'
// import fs from 'fs'
// import path from 'path'

// describe.skip('DprApplicationSubmissionEndpoint TypeBox schema', () => {
//   const dprApplicationSubmissionDir = path.join(
//     __dirname,
//     '../../../fixtures/dpr/submission'
//   )
//   const dprApplicationSubmissionFiles = fs
//     .readdirSync(dprApplicationSubmissionDir)
//     .filter((file) => file.startsWith('submission-') && file.endsWith('.json'))

//   if (dprApplicationSubmissionFiles.length === 0) {
//     throw new Error('No submission files found in fixtures directory')
//   }

//   for (const file of dprApplicationSubmissionFiles) {
//     const filePath = path.join(dprApplicationSubmissionDir, file)
//     const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//     it(`validates ${file} as a correct object`, () => {
//       debugSchema(DprApplicationSubmissionEndpoint, example)
//       expect(Value.Check(DprApplicationSubmissionEndpoint, example)).toBe(true)
//     })
//   }

//   it('rejects an invalid object', () => {
//     const invalid = {}
//     expect(Value.Check(DprApplicationSubmissionEndpoint, invalid)).toBe(false)
//   })
// })
