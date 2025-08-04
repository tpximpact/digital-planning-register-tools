import { describe, it, expect } from 'bun:test'

import { app } from '@apps/server-api'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

describe('core', () => {
  it('works', async () => {
    const response = await app
      .handle(new Request(`http://localhost:${port}`))
      .then((x) => x.text())

    expect(response).not.toBeNull()
  })
})
