/**
 * Sorts an array of objects by a given path (dot notation) in asc or desc order.
 * @param arr Array of objects to sort
 * @param path Dot notation path to sort by (e.g. "user.name")
 * @param order "asc" or "desc"
 * @returns Sorted array of objects
 */
export const sortByPath = <T>(
  arr: T[],
  path: string,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  const getValue = (obj: unknown, path: string): unknown => {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, obj)
  }

  return [...arr].sort((a, b) => {
    const aVal = getValue(a, path)
    const bVal = getValue(b, path)

    if (aVal === bVal) return 0
    if (aVal == null) return order === 'asc' ? 1 : -1
    if (bVal == null) return order === 'asc' ? -1 : 1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }
    return 0
  })
}
