import { describe, expect, it } from 'bun:test'
import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.d.ts'
import { getPrimaryApplicationTypeKey } from './getPrimaryApplicationTypeKey'

describe('getPrimaryApplicationTypeKey', () => {
  it('should return the primary application type key for a valid application type', () => {
    const applicationType: ApplicationType = 'pa.part1.classA'
    const result = getPrimaryApplicationTypeKey(applicationType)
    expect(result).toBe('pa')
  })

  it('should return undefined for an invalid application type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applicationType: any = 'invalidType.part1.classA'
    const result = getPrimaryApplicationTypeKey(applicationType)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an empty application type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applicationType: any = ''
    const result = getPrimaryApplicationTypeKey(applicationType)
    expect(result).toBeUndefined()
  })

  it('should return undefined for a null application type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applicationType: any = null
    const result = getPrimaryApplicationTypeKey(applicationType)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an undefined application type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applicationType: any = undefined
    const result = getPrimaryApplicationTypeKey(applicationType)
    expect(result).toBeUndefined()
  })
})
