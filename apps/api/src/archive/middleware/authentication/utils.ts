import { timingSafeEqual } from 'crypto'

/**
 * Timing safe string comparison
 * @param actual
 * @param expected
 * @param encoding
 * @returns
 */
export function strSafeEqual(
  actual: string,
  expected: string,
  encoding: BufferEncoding = 'utf-8'
) {
  const actualBuffer = Buffer.from(actual, encoding)
  const expectedBuffer = Buffer.from(expected, encoding)
  const maxLength = Math.max(actualBuffer.byteLength, expectedBuffer.byteLength)
  return timingSafeEqual(
    //pads buffers to equal length, requirement for timingSafeEqual
    Buffer.concat([actualBuffer, Buffer.alloc(maxLength, 0)], maxLength),
    Buffer.concat([expectedBuffer, Buffer.alloc(maxLength, 0)], maxLength)
  )
}
