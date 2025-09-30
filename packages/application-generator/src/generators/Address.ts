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

export const fullAddress: Address = {
  line1: '29 Park Place',
  line2: 'Mertz Mount',
  town: 'Daugherty-under-Collins',
  county: 'Mid Glamorgan',
  postcode: 'OA81 8WG',
  country: 'Kiribati'
}

export const midAddress: Address = {
  line1: '6 North Avenue',
  town: 'Conn Green',
  county: 'Norfolk',
  postcode: 'ER0 2JN',
  country: 'Mauritania'
}

export const minimalAddress: Address = {
  line1: '93 Newton Road',
  town: 'Nether Gulgowskiham',
  postcode: 'HU0 7BB'
}
