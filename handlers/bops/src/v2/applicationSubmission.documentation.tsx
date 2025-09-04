import type { Documentation } from '../types/types'
import { applicationSubmission } from './applicationSubmission'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=applicationSubmission`,
  file: `src/handlers/bops/v2/applicationSubmission.ts`,
  description: 'applicationSubmission',
  arguments: ['council', 'reference'],
  run: async (args: [string, string]) => {
    return await applicationSubmission(...args)
  },
  examples: [
    {
      url: `/docs/json?handler=BopsV2&method=applicationSubmission&council=camden&reference=24-00136-HAPP`,
      description: 'applicationSubmission exists'
    },
    {
      url: `/docs/json?handler=BopsV2&method=applicationSubmission&council=camden&reference=nonexistent`,
      description: 'applicationSubmission doesnt exist'
    }
  ]
}
