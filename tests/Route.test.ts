
import { buildRoute } from '../src/Route'

describe('buildRoute', function() {

  const baseURL = 'http://example.com'

  interface TestPayload {
    id: number
    version: number
    name: string
  }

  it('should replace tokens', function() {
    const payload = { id: 42, version: 1, name: 'ignored' } as TestPayload
    const result = buildRoute(baseURL + '/tests/:id', payload)
    expect(result).toBe(baseURL + '/tests/42')
  })

  it('should append unused tokens if query true', function() {
    const payload = { id: 42, version: 1, name: 'pancakes' } as TestPayload
    const result = buildRoute(baseURL + '/tests/:id', payload, true)
    expect(result).toBe(baseURL + '/tests/42?version=1&name=pancakes')
  })
})