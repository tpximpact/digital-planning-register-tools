import { describe, it, expect } from 'bun:test'

import { app } from './app'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

describe('core', () => {
  it('works', async () => {
    const response = await app()
      .handle(new Request(`http://localhost:${port}`))
      .then((x) => x.text())

    expect(response).toBe(
      JSON.stringify({
        data: null,
        status: { code: 404, message: 'Not Found' }
      })
    )
  })
})
