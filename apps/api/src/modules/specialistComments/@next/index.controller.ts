import { Elysia } from 'elysia'

export const specialistComments = new Elysia({
  tags: ['@next', 'specialistComments']
}).get('/', 'List all specialist comments')
