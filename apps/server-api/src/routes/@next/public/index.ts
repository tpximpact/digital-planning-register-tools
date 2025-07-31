import { Elysia } from 'elysia'
import { publicPlanningApplicationsRoute } from './planningApplications.route'
import { publicCommentsSpecialistRoute } from './commentsSpecialist.route'
import { publicDocumentsRoute } from './documents.route'
import { publicCommentsPublicRoute } from './commentsPublic.route'

export const nextPublicRoute = new Elysia({
  prefix: '/public'
})
  .use(publicPlanningApplicationsRoute)
  .use(publicCommentsPublicRoute)
  .use(publicCommentsSpecialistRoute)
  .use(publicDocumentsRoute)
