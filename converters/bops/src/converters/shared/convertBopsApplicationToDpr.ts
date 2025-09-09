import type { BopsApplication } from '../../schemas/shared/BopsApplication'
import type { DprApplication } from '../../schemas/shared/DprApplication'
import { DprApplicationStatus } from '../../schemas/shared/DprApplication'
import { convertDateTimeToUtc } from '../../utils/formatDates'
import { Value } from '@sinclair/typebox/value'

export const convertBopsApplicationToDpr = (
  application: BopsApplication
): DprApplication => {
  const status = Value.Check(DprApplicationStatus, application?.status)
    ? application.status
    : null
  if (!status) {
    throw new Error(`Invalid status: ${application.status}`)
  }
  return {
    reference: application.reference,
    status,
    consultation: {
      startDate: application.consultation?.startDate ?? null,
      endDate: application.consultation?.endDate ?? null,
      consulteeComments: null,
      publishedComments: null
    },
    receivedAt: application.receivedAt
      ? convertDateTimeToUtc(application.receivedAt)
      : '',
    validAt: application.validAt
      ? convertDateTimeToUtc(application.validAt)
      : null,
    publishedAt: application.publishedAt
      ? convertDateTimeToUtc(application.publishedAt)
      : null,
    determinedAt: application.determinedAt
      ? convertDateTimeToUtc(application.determinedAt)
      : null,
    decision: application.decision ?? null
  }
}
