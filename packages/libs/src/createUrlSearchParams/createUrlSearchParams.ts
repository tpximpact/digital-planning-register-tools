export const createUrlSearchParams = <T extends Record<string, unknown>>(
  searchParams: T
) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null) params.append(key, String(value))
  }

  return params
}
