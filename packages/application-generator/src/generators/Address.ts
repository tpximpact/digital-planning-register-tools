import { fakerEN_GB as faker } from '@faker-js/faker'
import type { Address } from 'digital-planning-data-schemas/types/shared/Addresses.js'

export const generateAddress = (): Address => {
  return {
    line1: faker.location.streetAddress(),
    line2: faker.location.street(),
    town: faker.location.city(),
    county: faker.location.county(),
    postcode: faker.location.zipCode(),
    country: faker.location.country()
  }
}
