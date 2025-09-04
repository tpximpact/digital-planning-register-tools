import type { DprCommentSubmission } from '../types/definitions'
import type { Documentation } from '../types/types'
import { postComment } from './postComment'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=postComment`,
  file: `src/handlers/bops/v2/postComment.ts`,
  description: 'Post a comment to BOPS',
  arguments: ['council', 'applicationId'],
  run: async (args: [string, string, DprCommentSubmission]) => {
    return await postComment(...args)
  },
  examples: [
    {
      url: `/docs/json?handler=BopsV2&method=postComment&applicationId=1&council=camden&apiData=1`,
      description: 'Submitting a comment to BOPS'
    }
  ]
}
