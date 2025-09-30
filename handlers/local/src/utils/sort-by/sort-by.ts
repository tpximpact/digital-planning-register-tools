import { sortByPath } from '@dpr/libs'

export const sortBy = <T>(
  items: T[],
  sortBy: string | undefined,
  orderBy: string | undefined,
  sortPaths: Record<string, string>
): T[] => {
  const sortPath = sortBy ? sortPaths[sortBy] : undefined
  const validOrder = orderBy === 'asc' || orderBy === 'desc' ? orderBy : 'asc'
  if (sortPath) {
    return sortByPath<T>(items, sortPath, validOrder)
  }
  return items
}
