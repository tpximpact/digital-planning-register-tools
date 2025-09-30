// import { describe, it, expect } from 'bun:test'
// import { Value } from '@sinclair/typebox/value'
// import { DprSpecialistCommentsEndpoint } from '.'
// import fs from 'fs'
// import path from 'path'
// import { debugSchema } from '@dpr/libs'

// describe.skip('DprSpecialistCommentsEndpoint TypeBox schema', () => {
//   const specialistCommentsDir = path.join(
//     __dirname,
//     '../../../fixtures/dpr/specialistComments'
//   )
//   const specialistCommentsFiles = fs
//     .readdirSync(specialistCommentsDir)
//     .filter(
//       (file) => file.startsWith('specialistComments-') && file.endsWith('.json')
//     )
//   if (!specialistCommentsFiles || specialistCommentsFiles.length === 0) {
//     throw new Error('No specialist comments files found in fixtures directory')
//   }

//   for (const file of specialistCommentsFiles) {
//     const filePath = path.join(specialistCommentsDir, file)
//     const example = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//     it(`validates ${file} as a correct object`, () => {
//       debugSchema(DprSpecialistCommentsEndpoint, example)
//       expect(Value.Check(DprSpecialistCommentsEndpoint, example)).toBe(true)
//     })
//   }

//   it('rejects an invalid object', () => {
//     const invalid = {}
//     expect(Value.Check(DprSpecialistCommentsEndpoint, invalid)).toBe(false)
//   })
// })
