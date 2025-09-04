import type { Documentation, SearchParamsComments } from '../types/types'
import { specialistComments } from './specialistComments'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=specialistComments`,
  file: `src/handlers/bops/v2/specialistComments.ts`,
  description: 'specialistComments',
  arguments: ['council', 'reference', 'searchParams'],
  run: async (args: [string, string, SearchParamsComments]) => {
    return await specialistComments(...args)
  },
  examples: [
    {
      url: `/docs/json?handler=BopsV2&method=specialistComments&council=southwark&reference=25-00292-HAPP`,
      description: 'specialistComments has specialistComments'
    },
    {
      url: `/docs/json?handler=BopsV2&method=specialistComments&council=southwark&reference=doesnotexist`,
      description: "specialistComments doesn't have specialistComments"
    }
    // {
    //   url: `/docs/json?handler=BopsV2&method=specialistComments&council=camden&reference=24-00129-HAPP`,
    //   description: "specialistComments has specialistComments",
    // },
    // {
    //   url: `/docs/json?handler=BopsV2&method=specialistComments&council=camden&reference=doesnotexist`,
    //   description: "specialistComments doesn't have specialistComments",
    // },
  ]
}
