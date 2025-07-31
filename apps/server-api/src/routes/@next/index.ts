import { Elysia } from 'elysia'
import { nextPublicRoute } from './public'

export const apiNextRoute = new Elysia({
  prefix: '/@next'
}).use(nextPublicRoute)
