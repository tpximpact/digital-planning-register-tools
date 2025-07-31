import { Elysia } from 'elysia'
import { apiNextRoute } from './@next'

export const apiRoute = new Elysia({
  prefix: '/api'
}).use(apiNextRoute)
