import type { BopsApplication } from '../schemas/shared/BopsApplication'

export const validBopsApplication: BopsApplication = {
  type: { value: 'pp.full.minor', description: 'planning_permission' },
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
    publicUrl: 'https://example.com/25-00176-FULL',
    publishedComments: [
      {
        comment:
          '* Design, size or height of new buildings or extensions: Sed posuere consectetur est at lobortis.  \r\n* Impacts on natural light: Sed posuere consectetur est at lobortis. ',
        receivedAt: '2025-07-03T15:52:28.266+01:00',
        summaryTag: 'neutral'
      },
      {
        comment:
          'Use and function of the proposed development: Sed posuere consectetur est at lobortis.',
        receivedAt: '2025-07-03T15:53:49.030+01:00',
        summaryTag: 'objection'
      },
      {
        comment:
          '* Impacts on natural light: Sed posuere consectetur est at lobortis. ',
        receivedAt: '2025-07-04T09:50:45.939+01:00',
        summaryTag: 'supportive'
      },
      {
        comment:
          '* Design, size or height of new buildings or extensions: Sed posuere consectetur est at lobortis. ',
        receivedAt: '2025-07-04T10:42:52.200+01:00',
        summaryTag: 'supportive'
      }
    ],
    consulteeComments: [
      {
        comment: 'Sed posuere consectetur est at lobortis.\r\n',
        receivedAt: '2025-07-03T15:55:27.525+01:00'
      },
      {
        comment: 'Sed posuere consectetur est at lobortis.',
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
