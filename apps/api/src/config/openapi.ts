import type { ElysiaOpenAPIConfig } from '@elysiajs/openapi'

export const documentation: ElysiaOpenAPIConfig['documentation'] = {
  info: {
    title: 'Digital planning data schema',
    description: 'This is the API documentation for the ODP schema',
    version: '@next'
  },
  externalDocs: {
    description: 'Digital planning data schema',
    url: 'https://github.com/theopensystemslab/digital-planning-data-schemas'
  },
  // components: {
  //   securitySchemes: {
  //     basicAuth: {
  //       type: 'http',
  //       scheme: 'basic'
  //     }
  //   }
  // },
  // security: [{ basicAuth: [] }],
  tags: [
    {
      name: 'Internal',
      description: 'Internal endpoints, for DPR use',
      externalDocs: {
        description: 'Find more info here',
        url: 'https://planningregister.org'
      }
    },
    {
      name: 'Public',
      description:
        'Endpoints that do not require authentication and return non-sensitive data'
    },
    {
      name: 'Private',
      description:
        'Endpoints that require authentication and return sensitive data'
    },
    {
      name: 'BOPS Handler',
      description:
        'Handler for BOPS data source that convert requests and responses (e.g. BOPS, etc.)'
    }
  ]
}
