import { fakerEN_GB as faker } from '@faker-js/faker'
import type { ContactDetails } from 'digital-planning-data-schemas/types/shared/Contacts.js'

export const generateContactDetails = (): ContactDetails => {
  return {
    name: {
      title: faker.person.prefix(),
      first: faker.person.firstName(),
      last: faker.person.lastName()
    },
    email: faker.internet.email(),
    phone: {
      primary: faker.phone.number()
    },
    company: {
      name: faker.company.name()
    }
  }
}
