export const env =
  typeof Bun !== 'undefined'
    ? Bun.env
    : typeof process !== 'undefined'
      ? process?.env
      : undefined
