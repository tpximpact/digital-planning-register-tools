import { Elysia } from 'elysia'

export const publicDocumentsRoute = new Elysia({
  prefix: '/documents'
}).get('/', 'List all documents')
