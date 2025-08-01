/**
 * @file Error class for DPR authentication errors
 */
export class DprAuthenticationError extends Error {
  public code = 'DPR_AUTHENTICATION_ERROR'

  constructor(
    override readonly message: string,
    readonly realm: string
  ) {
    super(message)
    this.realm = realm
  }
}
