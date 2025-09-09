import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { DprApplication } from './DprApplication'

describe('DprApplication TypeBox schema', () => {
  const valid = {
    reference: '25-00176-FULL',
    status: 'determined',
    consultation: {
      startDate: '2025-07-03',
      endDate: '2025-07-25',
      consulteeComments: null,
      publishedComments: null
    },
    receivedAt: '2025-07-03T14:23:53Z',
    validAt: '2025-07-03T14:23:53Z',
    publishedAt: '2025-07-03T14:46:02Z',
    determinedAt: '2025-08-04T15:26:53Z',
    decision: 'granted'
  }
  it('validates a correct object', () => {
    expect(Value.Check(DprApplication, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {
      // missing reference
      status: 'determined',
      consultation: {
        startDate: '2025-07-03',
        endDate: '2025-07-25',
        consulteeComments: null,
        publishedComments: null
      },
      receivedAt: '2025-07-03T14:23:53Z',
      validAt: '2025-07-03T14:23:53Z',
      publishedAt: '2025-07-03T14:46:02Z',
      determinedAt: '2025-08-04T15:26:53Z',
      decision: 'granted'
    }
    expect(Value.Check(DprApplication, invalid)).toBe(false)
  })
})
