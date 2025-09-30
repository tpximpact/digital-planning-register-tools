import { describe, it, expect, spyOn } from 'bun:test'
import { Type } from '@sinclair/typebox'
import { debugSchema } from './debug-schema'

const spy = spyOn(console, 'log')

// Example schema
const ExampleSchema = Type.Object({
  name: Type.String(),
  age: Type.Number()
})

describe('debugSchema', () => {
  it('logs no error for valid object', () => {
    const valid = { name: 'Alice', age: 30 }
    expect(spy).toHaveBeenCalledTimes(0)
    expect(() => debugSchema(ExampleSchema, valid)).not.toThrow()
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('logs error for invalid object', () => {
    const invalid = { name: 'Alice', age: 'not-a-number' }
    // Should log an error object
    expect(spy).toHaveBeenCalledTimes(0)
    expect(() => debugSchema(ExampleSchema, invalid)).not.toThrow()
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
