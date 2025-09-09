import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { BopsApplication } from './BopsApplication'

describe('BopsApplication TypeBox schema', () => {
  const valid = {
    type: {
      value: 'pp.full.minor',
      description: 'planning_permission'
    },
    reference: '25-00176-FULL',
    fullReference: 'CMD-25-00176-FULL',
    targetDate: '2025-08-07',
    expiryDate: '2025-08-28',
    receivedAt: '2025-07-03T15:23:53.264+01:00',
    validAt: '2025-07-03T15:23:53.264+01:00',
    publishedAt: '2025-07-03T15:46:02.342+01:00',
    determinedAt: '2025-08-04T16:26:53.630+01:00',
    decision: 'granted',
    status: 'determined',
    consultation: {
      startDate: '2025-07-03',
      endDate: '2025-07-25',
      publicUrl:
        'https://camden.bops-applicants-staging.services/planning_applications/25-00176-FULL',
      publishedComments: [
        {
          comment:
            '* Design, size or height of new buildings or extensions: Looks a bit big to me  \r\n* Impacts on natural light: The sunlight in my back garden! Nooooooo! ',
          receivedAt: '2025-07-03T15:52:28.266+01:00',
          summaryTag: 'neutral'
        },
        {
          comment:
            "Use and function of the proposed development: This is in CAZ, don't give the office away.  ",
          receivedAt: '2025-07-03T15:53:49.030+01:00',
          summaryTag: 'objection'
        },
        {
          comment: '* Impacts on natural light: geerrth ',
          receivedAt: '2025-07-04T09:50:45.939+01:00',
          summaryTag: 'supportive'
        },
        {
          comment:
            '* Design, size or height of new buildings or extensions: few ',
          receivedAt: '2025-07-04T10:42:52.200+01:00',
          summaryTag: 'supportive'
        }
      ],
      consulteeComments: [
        {
          comment:
            'The original factory building at 5-6 Underhill Street was partially destroyed by enemy action during WWII and rebuilt in 1946. The site is located within Camden Town Conservation Area.\r\n\r\nIn 1988 consent was granted for external alterations to the building (plus small extension). This is the building we find today.\r\n\r\nUnderhill Street façade (ref 8701306)\r\n\r\nThe current proposal seeks to return the Underhill Street elevation to an arrangement of four windows at ground floor level as previously granted in 1988.\r\n\r\nTo ensure the building retains an architecturally coherent appearance there should be a condition attached to any consent requiring the new windows to match the existing windows in style i.e. have an ‘Art Deco’ metal Crittall-like appearance.\r\n\r\nProviding the design of the proposed windows is in keeping, the elevational changes are considered not to harm the contribution made by this building to the character and appearance of the streetscape and hence the conservation area.\r\n',
          receivedAt: '2025-07-03T15:55:27.525+01:00'
        },
        {
          comment: 'Secure cycle parking via condition and car-free via s106. ',
          receivedAt: '2025-07-03T15:56:58.839+01:00'
        }
      ]
    },
    pressNotice: {
      required: true,
      reason: 'Conservation area',
      publishedAt: '2025-07-03T00:00:00.000+01:00'
    }
  }
  it('validates a correct object', () => {
    expect(Value.Check(BopsApplication, valid)).toBe(true)
  })

  it('rejects an invalid object', () => {
    const invalid = {
      // missing type
      reference: '25-00176-FULL',
      fullReference: 'CMD-25-00176-FULL',
      targetDate: '2025-08-07',
      expiryDate: '2025-08-28',
      receivedAt: '2025-07-03T15:23:53.264+01:00',
      validAt: '2025-07-03T15:23:53.264+01:00',
      publishedAt: '2025-07-03T15:46:02.342+01:00',
      determinedAt: '2025-08-04T16:26:53.630+01:00',
      decision: 'granted',
      status: 'determined',
      consultation: {
        startDate: '2025-07-03',
        endDate: '2025-07-25',
        publicUrl:
          'https://camden.bops-applicants-staging.services/planning_applications/25-00176-FULL',
        publishedComments: [
          {
            comment:
              '* Design, size or height of new buildings or extensions: Looks a bit big to me  \r\n* Impacts on natural light: The sunlight in my back garden! Nooooooo! ',
            receivedAt: '2025-07-03T15:52:28.266+01:00',
            summaryTag: 'neutral'
          },
          {
            comment:
              "Use and function of the proposed development: This is in CAZ, don't give the office away.  ",
            receivedAt: '2025-07-03T15:53:49.030+01:00',
            summaryTag: 'objection'
          },
          {
            comment: '* Impacts on natural light: geerrth ',
            receivedAt: '2025-07-04T09:50:45.939+01:00',
            summaryTag: 'supportive'
          },
          {
            comment:
              '* Design, size or height of new buildings or extensions: few ',
            receivedAt: '2025-07-04T10:42:52.200+01:00',
            summaryTag: 'supportive'
          }
        ],
        consulteeComments: [
          {
            comment:
              'The original factory building at 5-6 Underhill Street was partially destroyed by enemy action during WWII and rebuilt in 1946. The site is located within Camden Town Conservation Area.\r\n\r\nIn 1988 consent was granted for external alterations to the building (plus small extension). This is the building we find today.\r\n\r\nUnderhill Street façade (ref 8701306)\r\n\r\nThe current proposal seeks to return the Underhill Street elevation to an arrangement of four windows at ground floor level as previously granted in 1988.\r\n\r\nTo ensure the building retains an architecturally coherent appearance there should be a condition attached to any consent requiring the new windows to match the existing windows in style i.e. have an ‘Art Deco’ metal Crittall-like appearance.\r\n\r\nProviding the design of the proposed windows is in keeping, the elevational changes are considered not to harm the contribution made by this building to the character and appearance of the streetscape and hence the conservation area.\r\n',
            receivedAt: '2025-07-03T15:55:27.525+01:00'
          },
          {
            comment:
              'Secure cycle parking via condition and car-free via s106. ',
            receivedAt: '2025-07-03T15:56:58.839+01:00'
          }
        ]
      },
      pressNotice: {
        required: true,
        reason: 'Conservation area',
        publishedAt: '2025-07-03T00:00:00.000+01:00'
      }
    }
    expect(Value.Check(BopsApplication, invalid)).toBe(false)
  })

  describe('bops-date-time field', () => {
    it('validates bops-date-time field', () => {
      expect(Value.Check(BopsApplication, valid)).toBe(true)
    })
    it('rejects an invalid bops-date-time field', () => {
      expect(
        Value.Check(BopsApplication, {
          ...valid,
          receivedAt: '2025-07-03T14:23:53Z',
          validAt: '2025-07-03T14:23:53Z',
          publishedAt: '2025-07-03T14:23:53Z',
          determinedAt: '2025-07-03T14:23:53Z'
        })
      ).toBe(false)
    })
  })

  describe('date field', () => {
    it('validates date field', () => {
      expect(Value.Check(BopsApplication, valid)).toBe(true)
    })
    it('rejects an invalid date field', () => {
      expect(
        Value.Check(BopsApplication, {
          ...valid,
          targetDate: '2025-07-03T14:23:53Z'
        })
      ).toBe(false)
    })
  })
})
