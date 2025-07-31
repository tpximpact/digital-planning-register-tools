import { Elysia } from 'elysia'

export const publicCommentsSpecialistRoute = new Elysia({
  prefix: '/comments/specialist'
}).get('/', 'List all specialist comments')
