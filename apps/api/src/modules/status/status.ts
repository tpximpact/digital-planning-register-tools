import { Elysia } from 'elysia'
import { ENV_HANDLER_API as ENV } from '@dpr/config'

const { STATUS_API_KEY } = ENV

const CLIENT_IDS = [
  'barnet',
  'buckinghamshire',
  'camden',
  'gateshead',
  'lambeth',
  'southwark',
  'medway',
  'newcastle',
  'south-gloucestershire'
]

const PATHS = [
  // { method: 'GET', path: '/' },
  // { method: 'GET', path: '/docs' },
  // { method: 'GET', path: '/docs/json' },
  // { method: 'GET', path: '/health' },
  // { method: 'GET', path: '/api/@next/applications' },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/documents'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/documents/:documentId'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/publicComments'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/publicComments/:publicCommentId'
  // },
  // {
  //   method: 'POST',
  //   path: '/api/@next/applications/:applicationId/publicComments'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/specialistComments'
  // },
  // {
  //   method: 'GET',
  //   path: '/api/@next/applications/:applicationId/specialistComments/:specialistId'
  // },
  {
    method: 'GET',
    path: '/api/@next/public/applications',
    query: { page: 1, resultsPerPage: 10 },
    childParams: {
      applicationId: 'data[0].data.application.reference'
    }
  },
  {
    method: 'GET',
    path: '/api/@next/public/applications/:applicationId'
  },
  {
    method: 'GET',
    path: '/api/@next/public/applications/:applicationId/documents'
  },
  // {
  //   method: 'GET',
  //   path: '/api/@next/public/applications/:applicationId/documents/:documentId'
  // },
  {
    method: 'GET',
    path: '/api/@next/public/applications/:applicationId/publicComments'
  },
  // {
  //   method: 'GET',
  //   path: '/api/@next/public/applications/:applicationId/publicComments/:publicCommentId'
  // },
  {
    method: 'GET',
    path: '/api/@next/public/applications/:applicationId/specialistComments',
    query: { page: 1, resultsPerPage: 10 },
    childParams: {
      specialistId: 'data.comments[0].id'
    }
  },
  {
    method: 'GET',
    path: '/api/@next/public/applications/:applicationId/specialistComments/:specialistId'
  }
]

function validateBasicAuth(
  authHeader: string | null,
  expectedKey: string
): boolean {
  if (!authHeader?.startsWith('Basic ')) return false
  const decoded = atob(authHeader.slice(6))
  const password = decoded.includes(':')
    ? decoded.split(':').slice(1).join(':')
    : decoded
  return password === expectedKey
}

export const statusPlugin = (app: Elysia) => {
  app.get('/status', async ({ request, set }) => {
    if (!STATUS_API_KEY) {
      set.status = 500
      return 'STATUS_API_KEY env var is not set.'
    }

    if (
      !validateBasicAuth(request.headers.get('authorization'), STATUS_API_KEY)
    ) {
      set.status = 401
      set.headers['www-authenticate'] = 'Basic realm="API Status"'
      return 'Unauthorized'
    }

    const routes = PATHS

    const html = await Bun.file(
      new URL('./status.html', import.meta.url)
    ).text()

    const injected = html.replace(
      '<!-- __CONFIG__ -->',
      `<script>
        window.__STATUS_CONFIG__ = ${JSON.stringify({
          clientIds: CLIENT_IDS,
          routes
        })}
      </script>`
    )

    set.headers['content-type'] = 'text/html; charset=utf-8'
    return injected
  })

  return app
}
