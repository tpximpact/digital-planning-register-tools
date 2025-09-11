import type { PostSubmissionPublishedPublicCommentsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/endpoints/PublicCommentsEndpoint'
import type { BopsPublicCommentsEndpoint } from '../../../schemas/bops/publicComments'

export const bopsPublicCommentsEndpointToOdp = (
  input: BopsPublicCommentsEndpoint
): PostSubmissionPublishedPublicCommentsEndpoint => {
  return input
}
