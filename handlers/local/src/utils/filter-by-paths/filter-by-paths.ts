import { getValueByPath } from '../get-value-by-path'

export const filterByPaths = <T>(
  items: T[],
  value: string | undefined,
  paths: string[]
): T[] => {
  if (value && typeof value === 'string') {
    const q = value.toLowerCase()
    return items.filter((app) =>
      paths.some((path) => {
        const v = getValueByPath(app, path)
        return typeof v === 'string' && v.toLowerCase().includes(q)
      })
    )
  }
  return items
}
