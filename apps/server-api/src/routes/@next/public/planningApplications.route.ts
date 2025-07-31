import { Elysia, t } from 'elysia'

export const publicPlanningApplicationsRoute = new Elysia({
  prefix: '/planningApplications'
})
  .get('/', 'List all')
  .get(
    '/:id',
    ({ params: { id } }) => {
      // Simulate fetching a planning application by ID
      if (isNaN(Number(id))) {
        throw new Error('Invalid ID')
      }

      return {
        message: 'hello',
        id
      }
    },
    {
      params: t.Object({
        id: t.Number()
      })
    }
  )
