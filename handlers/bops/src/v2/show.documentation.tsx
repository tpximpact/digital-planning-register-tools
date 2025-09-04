import type { Documentation } from '../types/types'
import { show } from './show'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=show`,
  file: `src/handlers/bops/v2/show.ts`,
  source: [
    'https://camden.bops-staging.services/api/v2/public/planning_applications/applicationid'
  ],
  description: 'show',
  arguments: ['council', 'reference'],
  run: async (args: [string, string]) => {
    return await show(...args)
  },
  examples: [
    {
      url: `/docs/json?handler=BopsV2&method=show&council=camden&reference=24-00136-HAPP`,
      description: 'show exists',
      source: [
        'https://camden.bops-staging.services/api/v2/public/planning_applications/24-00136-HAPP'
      ]
    },
    {
      url: `/docs/json?handler=BopsV2&method=show&council=camden&reference=doesnotexist`,
      description: "show doesn't exist",
      source: [
        'https://camden.bops-staging.services/api/v2/public/planning_applications/doesnotexist'
      ]
    }
  ]
}
