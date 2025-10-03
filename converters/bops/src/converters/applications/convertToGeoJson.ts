/**
 * Somehow data like this comes through to production, its not
 *  valid according to the current schema so we smoosh it together to make it valid!
 */

export const convertToGeoJson = (mapData: unknown) => {
  if (typeof mapData !== 'object' || mapData === null) {
    throw new Error('mapData must be a non-null object')
  }

  let data: unknown[] = []

  for (const [key, value] of Object.entries(mapData)) {
    if (key.startsWith('EPSG:3857')) {
      data = value
    }
  }

  return data
}
