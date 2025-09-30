import { describe, it, expect } from 'bun:test'
import {
  generateDeclaration,
  generateEnglandApplicationData
} from './EnglandApplicationData'

describe('generateDeclaration', () => {
  it('returns an valid Declaration', () => {
    const obj = generateDeclaration()
    expect(obj).toBeDefined()
  })
})
describe('generateEnglandApplicationData', () => {
  it('returns an valid EnglandApplicationData', () => {
    const obj = generateEnglandApplicationData()
    expect(obj).toBeDefined()
  })
})
