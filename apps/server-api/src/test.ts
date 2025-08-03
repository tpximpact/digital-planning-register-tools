import { env } from '@libs/env'
import Elysia from 'elysia'

const deviceDetect = new Elysia({ name: 'device-detect' })
  .derive({ as: 'global' }, ({ request }) => {
    const userAgent = request.headers.get('user-agent')
    return { userAgent }
  })
  .on('beforeHandle', ({ userAgent }) => {
    console.log('Before handle')
    console.log(userAgent)
  })
  .get('/device', ({ userAgent }) => userAgent)

const auth = new Elysia({ name: 'auth' })
  .use(deviceDetect)
  .get('/auth', ({ userAgent }) => userAgent)

export const app = new Elysia()
  .use(auth)
  .get('/', ({ userAgent }) => userAgent)
  .listen(4000, () => {
    console.log(
      `Server is running in ${env?.NODE_ENV} mode at http://localhost:4000`
    )
  })

// export const app = new Elysia()
//   .onError(({ error }) => {
//     console.log(error)
//     return {}
//   })
//   .get('/test/:id', ({ params: { id } }) => {
//     console.log('hello')
//     throw new Error('This is a test error')
//   })
//   .listen(4000, () => {
//     console.log(
//       `Server is running in ${env?.NODE_ENV} mode at http://localhost:4000`
//     )
//   })
