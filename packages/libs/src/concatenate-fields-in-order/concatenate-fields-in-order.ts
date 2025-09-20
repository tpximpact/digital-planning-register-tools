/**
 * Concatenates specified fields of an object with values, separated by a comma.
 * @param obj - The object containing the fields.
 * @param fields - The array of field names in the order to concatenate.
 * @returns A concatenated string of field values.
 */
export const concatenateFieldsInOrder = (
  obj: object,
  fields: string[],
  separator = ', '
): string => {
  const data = fields
    .map((key) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key as keyof object]
        return value ?? ''
      }
    })
    .filter(Boolean)
  return data.join(separator).trim()
}
