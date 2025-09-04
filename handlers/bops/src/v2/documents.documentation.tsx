import type { Documentation, SearchParamsDocuments } from '../types/types'
import { documents } from './documents'

export const documentation: Documentation = {
  url: `/docs/json?handler=BopsV2&method=documents`,
  file: `src/handlers/bops/v2/documents.ts`,
  description: 'documents',
  arguments: ['council', 'reference'],
  run: async (args: [string, string, SearchParamsDocuments]) => {
    return await documents(...args)
  },
  examples: [
    {
      url: `/docs/json?handler=BopsV2&method=documents&council=camden&reference=24-00129-HAPP`,
      description: 'documents has documents'
    },
    {
      url: `/docs/json?handler=BopsV2&method=documents&council=camden&reference=doesnotexist`,
      description: "documents doesn't have documents"
    }
  ]
}
