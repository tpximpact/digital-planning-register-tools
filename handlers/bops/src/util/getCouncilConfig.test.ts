import {
  describe,
  it,
  expect,
  spyOn,
  beforeEach,
  beforeAll,
  afterAll
} from 'bun:test'
import { getCouncilConfig, type ClientConfig } from './getCouncilConfig'

describe('getCouncilConfig', () => {
  const fetchSpy = spyOn(global, 'fetch')

  beforeAll(() => {
    process.env.ADMIN_API_URL = 'http://fake-admin-api.com'
    process.env.INTERNAL_API_TOKEN = 'test-token'
  })

  beforeEach(() => {
    fetchSpy.mockClear()
  })

  afterAll(() => {
    fetchSpy.mockRestore()
  })

  it('should return the config object on a successful fetch', async () => {
    const mockConfig: ClientConfig = {
      id: 1,
      name: 'test-council',
      slug: 'test-council',
      endpoint: 'https://test.api/',
      lastPolledAt: null,
      updatedAt: '2025-09-11T10:36:15.000Z',
      createdAt: '2025-09-11T10:36:15.000Z'
    }

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(mockConfig), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const result = await getCouncilConfig('test-council')
    expect(result).toEqual(mockConfig)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('should return null when the fetch response is 404', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 404 }))

    const result = await getCouncilConfig('not-found-council')
    expect(result).toBeNull()
  })

  it('should return null when the fetch response is not ok (e.g., 500)', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 })
    )

    const result = await getCouncilConfig('error-council')

    expect(result).toBeNull()
  })
})
