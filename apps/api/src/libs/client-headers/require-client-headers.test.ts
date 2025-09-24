import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { requireClientHeaders } from './require-client-headers'

describe('require-client-headers', () => {
  it('returns a 200 response when headers are provided', async () => {
    const app = new Elysia().use(requireClientHeaders).get('/', () => 'hi')
    const api = treaty(app)

    const { status, data } = await api.get({
      headers: {
        'x-client': 'test-client',
        'x-service': 'test-service'
      }
    })

    expect(status).toBe(200)
    expect(data).toBe('hi')
  })

  it('returns an error when headers are not provided', async () => {
    const app = new Elysia().use(requireClientHeaders).get('/', () => 'hi')
    const api = treaty(app)

    const { status, data } = await api.get({})

    expect(status).toBe(422)
    expect(data).toBeNull()
  })

  it('returns a 200 response when null headers are provided', async () => {
    const app = new Elysia().use(requireClientHeaders).get('/', () => 'hi')
    const api = treaty(app)

    const { status, data } = await api.get({
      headers: {
        'x-client': null,
        'x-service': null
      }
    })

    expect(status).toBe(200)
    expect(data).toBe('hi')
  })

  it('returns an error when empty headers are provided', async () => {
    const app = new Elysia().use(requireClientHeaders).get('/', () => 'hi')
    const api = treaty(app)

    const { status, data } = await api.get({
      headers: { 'x-client': '', 'x-service': '' }
    })

    expect(status).toBe(422)
    expect(data).toBeNull()
  })
})
