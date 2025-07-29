import { serve } from 'bun'
import index from './index.html'
import { env } from '@dpr/libs'

const port = env?.PORT ? parseInt(env.PORT, 10) : 3000

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/hello': {
      GET(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET'
        })
      },
      PUT(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT'
        })
      }
    },

    '/api/hello/:name': (req) => {
      const name = req.params.name
      return Response.json({
        message: `Hello, ${name}!`
      })
    }
  },

  development: env?.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true
  },

  port
})

console.log(`🚀 Server running at ${server.url}`)
