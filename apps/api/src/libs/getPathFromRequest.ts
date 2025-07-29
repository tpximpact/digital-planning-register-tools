/**
 * Get pathname from request
 */
export const getPathFromRequest = (request: Request) => {
  return new URL(request.url).pathname
}
