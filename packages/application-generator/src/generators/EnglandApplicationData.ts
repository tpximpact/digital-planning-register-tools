import { fakerEN_GB as faker } from '@faker-js/faker'
import type { EnglandApplicationData } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/data/ApplicationData.ts'
import type { Declaration } from 'digital-planning-data-schemas/types/shared/Declarations.js'

export const generateDeclaration = (): Declaration => {
  return {
    accurate: faker.datatype.boolean(),
    connection: {
      value: faker.helpers.arrayElement([
        'employee',
        'relation.employee',
        'electedMember',
        'relation.electedMember',
        'none'
      ]),
      description: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
    }
  }
}

export const generateEnglandApplicationData = (): EnglandApplicationData => {
  return {
    declaration: generateDeclaration()
  }
}
