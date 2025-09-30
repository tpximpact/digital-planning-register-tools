import * as Codegen from '@sinclair/typebox-codegen'

const Code = Codegen.TypeScriptToTypeBox.Generate(`
  type T = { x: number, y: number, z: number }
`)

console.log(Code)

// export const SiteAddress = Codegen.ts2typebox()
