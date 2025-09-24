import { t, type Static } from 'elysia'

export const ClientHeaders = t.Object(
  {
    'x-client': t.String({
      example: 'camden',
      minLength: 1,
      maxLength: 100
    }),
    'x-service': t.String({
      example: 'documentation-example',
      minLength: 1,
      maxLength: 100
    })
  },
  {
    title: 'Headers',
    description: 'Headers required in order to return the correct results'
  }
)
export type ClientHeaders = Static<typeof ClientHeaders>
