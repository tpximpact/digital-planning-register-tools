import { faker } from '@faker-js/faker'

/**
 * Generates a random reference string in the format `XX-XXXXX-XXXX`.
 *
 * @returns {string} A random reference string.
 */
export const generateReference = (): string => {
  const part1 = faker.number.int({ min: 10, max: 99 }).toString()
  const part2 = faker.number.int({ min: 10000, max: 99999 }).toString()
  const part3 = faker.string.alpha({ length: 4, casing: 'upper' })
  return `${part1}-${part2}-${part3}`
}
