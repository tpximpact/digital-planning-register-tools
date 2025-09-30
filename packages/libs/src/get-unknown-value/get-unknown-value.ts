/**
 * Utility function used when working with unknown
 * objects to return values in a typesafe way
 */
export const getUnknownValue = <T = unknown>(
  obj: unknown,
  path: (string | number)[]
): T | undefined => {
  let current: unknown = obj

  for (const key of path) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string | number, unknown>)[key]
    } else {
      return undefined
    }
  }

  return current as T
}
