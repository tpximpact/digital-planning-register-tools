import { getValueByPath } from '../get-value-by-path'

export const getByPaths = <T>(
  items: T[],
  value: string | undefined,
  paths: string[]
): T[] => {
  if (value && typeof value === 'string') {
    const q = value.toLowerCase()
    return items.filter((app) =>
      paths.some((path) => {
        const v = getValueByPath(app, path)
        if (typeof v === 'string') {
          return v.toLowerCase() === q
        }
        if (Array.isArray(v)) {
          return v.some(
            (item) => typeof item === 'string' && item.toLowerCase() === q
          )
        }
        return false
      })
    )
  }
  return items
}
