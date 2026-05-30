// apps/api/src/modules/open-api/open-api.ts
import path from 'path'
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { documentation } from '../../config'

const projectRoot = path.join(import.meta.dir, '../../..')

const staticDocs = new Elysia({ name: 'openapi-static' })
  .get('/docs/json', async () => {
    const file = Bun.file('./schema.json')
    return file.json()
  })
  .get('/swagger', () => {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>API Docs - Swagger</title>
          <meta charset="utf-8"/>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script>
            SwaggerUIBundle({
              url: '/docs/json',
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
            })
          </script>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  })
  .get('/docs', () => {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>API Docs - Scalar</title>
          <meta charset="utf-8"/>
        </head>
        <body>
          <script
            id="api-reference"
            data-url="/docs/json"
            src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  })

const liveDocs = (debug: boolean) =>
  new Elysia({ name: 'openapi-live' })
    .use(
      openapi({
        path: '/swagger',
        provider: 'swagger-ui',
        exclude: { paths: ['/'] },
        documentation,
        references: fromTypes('src/app.ts', {
          projectRoot,
          tsconfigPath: path.join(projectRoot, 'tsconfig.build.json'),
          debug
        })
      })
    )
    .use(
      openapi({
        path: '/docs',
        provider: 'scalar',
        exclude: { paths: ['/'] },
        documentation,
        references: fromTypes('src/app.ts', {
          projectRoot,
          tsconfigPath: path.join(projectRoot, 'tsconfig.build.json'),
          debug
        })
      })
    )

export const docs = (isProduction: boolean, debug: boolean) =>
  isProduction ? staticDocs : liveDocs(debug)
