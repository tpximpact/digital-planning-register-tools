import type { TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

/**
 * Debug a TypeBox schema by checking an example against it.
 *
 * @example
 * ```ts
 * import { debugSchema } from '../../../test/test-helpers'
 * debugSchema(BopsApplication, valid)
 * ```
 *
 * @param schema The TypeBox schema to debug.
 * @param example The example object to validate against the schema.
 */
export const debugSchema = <T extends TSchema>(schema: T, example: unknown) => {
  const compiler = TypeCompiler.Compile(schema)
  if (compiler.Check(example)) return

  console.log('Validation failed. Errors:')
  const errors = [...compiler.Errors(example)]

  // console.log(JSON.stringify(errors))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function printError(error: any, indent = 0) {
    const pad = '  '.repeat(indent)
    console.log(
      `${pad}- Path: ${error.path}\n` +
        `${pad}  Message: ${error.message}\n` +
        `${pad}  Errors: ${error.errors?.length}`
    )
    if (error.errors?.length) {
      for (const nested of error.errors) {
        printError(nested.First(), indent + 1)
      }
    }
  }

  for (const error of errors) {
    printError(error)
  }
}
