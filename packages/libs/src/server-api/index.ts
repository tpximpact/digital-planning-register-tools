import { treaty } from '@elysiajs/eden'
import type { App } from '@apps/server-api'

export const serverApi = treaty<App>('localhost:4000')
