import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { resolveClientHeaders } from './resolve-client-headers'

describe('resolve-client-headers', () => {
  it('returns the resolved headers when valid headers are provided', async () => {
    const app = new Elysia()
      .use(resolveClientHeaders)
      .get('/', ({ client, service, handler }) => {
        return {
          client,
          service,
          handler
        }
      })
    const api = treaty(app)

    const { status, data } = await api.get({
      headers: {
        'x-client': 'test-client',
        'x-service': 'test-service',
        'x-handler': 'test-handler'
      }
    })

    expect(status).toBe(200)
    expect(data).toEqual({
      client: 'test-client',
      service: 'test-service',
      handler: 'test-handler'
    })
  })

  it('returns the external handler when no x-handler is provided', async () => {
    const app = new Elysia()
      .use(resolveClientHeaders)
      .get('/', ({ client, service, handler }) => {
        return {
          client,
          service,
          handler
        }
      })
    const api = treaty(app)

    const { status, data } = await api.get({
      headers: {
        'x-client': 'test-client',
        'x-service': 'test-service'
      }
    })

    expect(status).toBe(200)
    expect(data).toEqual({
      client: 'test-client',
      service: 'test-service',
      handler: 'external'
    })
  })

  it('returns an error when headers are not provided', async () => {
    const app = new Elysia()
      .use(resolveClientHeaders)
      .get('/', ({ client, service, handler }) => {
        return {
          client,
          service,
          handler
        }
      })
    const api = treaty(app)

    const { status, error } = await api.get({})

    expect(status).toBe(500)
    expect(error).toBeDefined()
    expect(error?.status).toBe(500)
    expect(error?.value).toBe(
      'Missing or invalid client header; unable to determine required handler'
    )
  })

  it('returns an error when null headers are provided', async () => {
    const app = new Elysia()
      .use(resolveClientHeaders)
      .get('/', ({ client, service, handler }) => {
        return {
          client,
          service,
          handler
        }
      })
    const api = treaty(app)

    const { status, error } = await api.get({
      headers: { 'x-client': null, 'x-service': null, 'x-handler': null }
    })

    expect(status).toBe(200)
    expect(error).toBeNull()
  })

  it('returns an error when empty headers are provided', async () => {
    const app = new Elysia()
      .use(resolveClientHeaders)
      .get('/', ({ client, service, handler }) => {
        return {
          client,
          service,
          handler
        }
      })
    const api = treaty(app)

    const { status, error } = await api.get({
      headers: { 'x-client': '', 'x-service': '', 'x-handler': '' }
    })

    expect(status).toBe(500)
    expect(error).toBeDefined()
    expect(error?.status).toBe(500)
    expect(error?.value).toBe(
      'Missing or invalid client header; unable to determine required handler'
    )
  })
})
