import { fakerEN_GB as faker } from '@faker-js/faker'
import type { BaseApplicant } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/data/Applicant.ts'
import { generateContactDetails } from './ContactDetails'
import { generateAddress } from './Address'

export const generateBaseApplicant = (): BaseApplicant => {
  return {
    ...generateContactDetails(),
    type: faker.helpers.arrayElement([
      'individual',
      'company',
      'charity',
      'public',
      'parishCouncil'
    ]),
    address: faker.datatype.boolean()
      ? { sameAsSiteAddress: true }
      : {
          sameAsSiteAddress: false,
          ...generateAddress()
        }
  }
}
