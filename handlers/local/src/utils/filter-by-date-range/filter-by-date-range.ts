/**
 * Filters objects by a date property, keeping only those between `from` and `to` dates (inclusive).
 * @param items Array of objects to filter
 * @param from ISO string or Date for lower bound (inclusive)
 * @param to ISO string or Date for upper bound (inclusive)
 * @param datePath Dot-separated path to the date property (e.g. 'metadata.publishedAt')
 */
export const filterByDateRange = <T extends object>(
  items: T[],
  from: string | Date | undefined,
  to: string | Date | undefined,
  datePath: string
): T[] => {
  if (!from && !to) return items

  const fromDate = from ? new Date(from) : undefined
  const toDate = to ? new Date(to) : undefined

  return items.filter((item) => {
    // Traverse the object to get the date value
    const keys = datePath.split('.')
    let dateValue: unknown = item
    for (const key of keys) {
      if (
        typeof dateValue === 'object' &&
        dateValue !== null &&
        key in dateValue
      ) {
        dateValue = (dateValue as Record<string, unknown>)[key]
      } else {
        dateValue = undefined
        break
      }
    }
    if (typeof dateValue !== 'string' && !(dateValue instanceof Date))
      return false
    const itemDate = new Date(dateValue as string | Date)
    if (isNaN(itemDate.getTime())) return false
    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false
    return true
  })
}
