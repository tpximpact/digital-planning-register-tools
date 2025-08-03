import type { ElysiaSwaggerConfig } from '@elysiajs/swagger'

export const swaggerConfig: ElysiaSwaggerConfig<'docs'> = {
  provider: 'swagger-ui',
  // provider: 'scalar',
  path: 'docs',
  excludeStaticFile: true,
  documentation: {
    openapi: '3.1.0',
    externalDocs: {
      description: 'Digital planning data schema repo',
      url: 'https://github.com/theopensystemslab/digital-planning-data-schemas'
    },

    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      },
      parameters: {
        xClient: {
          name: 'x-client',
          in: 'header',
          required: true,
          schema: { type: 'string' },
          description: 'Client identifier'
        },
        xService: {
          name: 'x-service',
          in: 'header',
          required: true,
          schema: { type: 'string' },
          description: 'Service identifier'
        }
      }
    },
    security: [{ basicAuth: [] }]
  },
  swaggerOptions: {
    persistAuthorization: true
  }
}
