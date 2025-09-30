import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { Address } from '@dpr/odp-schemas/types/shared/Addresses.ts'
import {
  fullAddress,
  generateAddress,
  midAddress,
  minimalAddress
} from './Address'

describe('generateAddress', () => {
  it('returns an valid Address', () => {
    const address = generateAddress()
    expect(address).toBeDefined()
    expect(Value.Check(Address, address)).toBe(true)
  })

  it('returns an valid fullAddress', () => {
    const address = fullAddress
    expect(address).toBeDefined()
    expect(Value.Check(Address, address)).toBe(true)
  })

  it('returns an valid midAddress', () => {
    const address = midAddress
    expect(address).toBeDefined()
    expect(Value.Check(Address, address)).toBe(true)
  })

  it('returns an valid minimalAddress', () => {
    const address = minimalAddress
    expect(address).toBeDefined()
    expect(Value.Check(Address, address)).toBe(true)
  })
})
