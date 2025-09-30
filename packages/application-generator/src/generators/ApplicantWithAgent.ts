import type { ApplicantWithAgent } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/data/Applicant.ts'
import { generateAddress } from './Address'
import { generateContactDetails } from './ContactDetails'
import { generateBaseApplicant } from './BaseApplicant'

export const generateApplicantWithAgent = (): ApplicantWithAgent => {
  return {
    ...generateBaseApplicant(),
    agent: {
      ...generateContactDetails(),
      address: generateAddress()
    }
  }
}
