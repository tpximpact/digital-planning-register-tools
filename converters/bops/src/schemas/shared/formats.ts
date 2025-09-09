import { FormatRegistry } from '@sinclair/typebox'

// Register a custom format for bops-date-time strings (YYYY-MM-DDTHH:mm:ss)
// Only allow dates with milliseconds and a timezone offset (not Z)
FormatRegistry.Set('bops-date-time', (value) => {
  // Matches: YYYY-MM-DDTHH:mm:ss.mmm+HH:mm or -HH:mm
  return /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.\d{3}([+-]([01][0-9]|2[0-3]):[0-5][0-9])$/.test(
    value
  )
})
