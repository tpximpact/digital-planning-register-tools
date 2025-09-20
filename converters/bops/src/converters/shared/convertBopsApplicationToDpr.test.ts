import { describe, it, expect } from 'bun:test'
import { convertBopsApplicationToDpr } from './convertBopsApplicationToDpr'
import { DprApplicationStatus } from '../../schemas/shared/DprApplication'
import type { BopsApplication } from '../../schemas/shared/BopsApplication'
import { validBopsApplication } from '../../mocks/validBopsApplication'

describe('convertBopsApplicationToDpr', () => {
  it('converts a valid BopsApplication', () => {
    const result = convertBopsApplicationToDpr(validBopsApplication)
    expect(result.reference).toBe('25-00176-FULL')
    expect(result.status).toBe('determined' as DprApplicationStatus)
    expect(result.consultation.startDate).toBe('2025-07-03')
    expect(result.consultation.endDate).toBe('2025-07-25')
    expect(result.receivedAt).toBe('2025-07-03T14:23:53Z')
    expect(result.validAt).toBe('2025-07-03T14:23:53Z')
    expect(result.publishedAt).toBe('2025-07-03T14:46:02Z')
    expect(result.determinedAt).toBe('2025-08-04T15:26:53Z')
    expect(result.decision).toBe('granted')
  })

  it('throws for invalid status', () => {
    const bopsApp = {
      reference: '25-00176-FULL',
      status: 'not-a-valid-status',
      consultation: {},
      receivedAt: '2025-07-01T10:00:00.000+01:00'
    }
    expect(() =>
      convertBopsApplicationToDpr(bopsApp as BopsApplication)
    ).toThrow('Invalid status: not-a-valid-status')
  })

  it('handles missing optional fields', () => {
    const bopsApp = {
      reference: '25-00176-FULL',
      status: 'determined' as DprApplicationStatus,
      consultation: {},
      receivedAt: null,
      validAt: undefined,
      publishedAt: undefined,
      determinedAt: undefined,
      decision: undefined
    }
    const result = convertBopsApplicationToDpr(
      bopsApp as unknown as BopsApplication
    )
    expect(result.reference).toBe('25-00176-FULL')
    expect(result.status).toBe('determined' as DprApplicationStatus)
    expect(result.consultation.startDate).toBeNull()
    expect(result.consultation.endDate).toBeNull()
    expect(result.receivedAt).toBe('')
    expect(result.validAt).toBeNull()
    expect(result.publishedAt).toBeNull()
    expect(result.determinedAt).toBeNull()
    expect(result.decision).toBeNull()
  })
})
