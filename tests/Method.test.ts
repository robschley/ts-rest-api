import { Method, canHaveBody } from '../src/Method'

describe('Method', function() {
  it('should include CONNECT', function() {
    expect(Method.Connect).toBe('CONNECT')
  })

  it('should include DELETE', function() {
    expect(Method.Delete).toBe('DELETE')
  })

  it('should include HEAD', function() {
    expect(Method.Head).toBe('HEAD')
  })

  it('should include GET', function() {
    expect(Method.Get).toBe('GET')
  })

  it('should include OPTIONS', function() {
    expect(Method.Options).toBe('OPTIONS')
  })

  it('should include PATCH', function() {
    expect(Method.Patch).toBe('PATCH')
  })

  it('should include POST', function() {
    expect(Method.Post).toBe('POST')
  })

  it('should include PUT', function() {
    expect(Method.Put).toBe('PUT')
  })

  it('should include TRACE', function() {
    expect(Method.Trace).toBe('TRACE')
  })
})

describe('canHaveBody', function() {

  it('CONNECT can have a body', function() {
    expect(canHaveBody(Method.Connect)).toBe(true)
  })

  it('DELETE cannot have a body', function() {
    expect(canHaveBody(Method.Delete)).toBe(false)
  })

  it('HEAD cannot have a body', function() {
    expect(canHaveBody(Method.Head)).toBe(false)
  })

  it('GET cannot have a body', function() {
    expect(canHaveBody(Method.Get)).toBe(false)
  })

  it('OPTIONS can have a body', function() {
    expect(canHaveBody(Method.Options)).toBe(true)
  })

  it('PATCH can have a body', function() {
    expect(canHaveBody(Method.Patch)).toBe(true)
  })

  it('POST can have a body', function() {
    expect(canHaveBody(Method.Post)).toBe(true)
  })

  it('PUT can have a body', function() {
    expect(canHaveBody(Method.Put)).toBe(true)
  })

  it('TRACE can have a body', function() {
    expect(canHaveBody(Method.Trace)).toBe(true)
  })
})
