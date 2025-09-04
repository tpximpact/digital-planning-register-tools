import type { Documentation, SearchParamsComments } from '../types/types'
import { publicComments } from './publicComments'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=publicComments`,
  file: `src/handlers/bops/v2/publicComments.ts`,
  description: 'publicComments',
  arguments: ['council', 'reference', 'searchParams'],
  run: async (args: [string, string, SearchParamsComments]) => {
    return await publicComments(...args)
  },
  examples: [
    // this is using the southwark council bops data from the comments endpoint - will need to be updated when bops branch is merged
    // uncomment below when bops branch is merged and remove the southwark examples
    {
      url: `/docs/json?handler=BopsV2&method=publicComments&council=southwark&reference=25-00292-HAPP`,
      description: 'publicComments has publicComments'
    },
    {
      url: `/docs/json?handler=BopsV2&method=publicComments&council=southwark&reference=doesnotexist`,
      description: "publicComments doesn't have publicComments"
    }
    // {
    //   url: `/docs/json?handler=BopsV2&method=publicComments&council=camden&reference=24-00129-HAPP`,
    //   description: "publicComments has publicComments",
    // },
    // {
    //   url: `/docs/json?handler=BopsV2&method=publicComments&council=camden&reference=doesnotexist`,
    //   description: "publicComments doesn't have publicComments",
    // },
  ]
}
