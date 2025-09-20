import { Elysia } from 'elysia'

export const documents = new Elysia({
  tags: ['@next', 'documents']
}).get('/', 'List all documents')
