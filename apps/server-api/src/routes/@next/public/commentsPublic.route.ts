import { Elysia } from 'elysia'

export const publicCommentsPublicRoute = new Elysia({
  prefix: '/comments/public'
}).get('/', 'List all public comments')
