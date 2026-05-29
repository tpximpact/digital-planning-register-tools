import { describe, it, expect } from 'bun:test'
import {
  fullAddress,
  generateAddress,
  midAddress,
  minimalAddress
} from './Address'
import { assertSchema, AddressChecker } from '@dpr/test-libs'

describe('generateAddress', () => {
  it('returns an valid Address', () => {
    const address = generateAddress()
    expect(address).toBeDefined()
    assertSchema(AddressChecker, address)
  })

  it('returns an valid fullAddress', () => {
    const address = fullAddress
    expect(address).toBeDefined()
    assertSchema(AddressChecker, address)
  })

  it('returns an valid midAddress', () => {
    const address = midAddress
    expect(address).toBeDefined()
    assertSchema(AddressChecker, address)
  })

  it('returns an valid minimalAddress', () => {
    const address = minimalAddress
    expect(address).toBeDefined()
    assertSchema(AddressChecker, address)
  })
})
