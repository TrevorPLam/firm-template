import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware, MAX_BODY_SIZE_BYTES } from '@/middleware'

const MAX_BODY_SIZE_BYTES = 1024 * 1024

function buildRequest(method: string, contentLength?: string) {
  const headers = new Headers()
  if (contentLength !== undefined) {
    headers.set('content-length', contentLength)
  }

  return new NextRequest('http://localhost/test', { method, headers })
}

describe('middleware content-length validation', () => {
  it('allows valid payload sizes (happy path)', () => {
    // WHY: Valid Content-Length should pass through to NextResponse.next().
    const request = buildRequest('POST', '512')
    const response = middleware(request)

    expect(response.status).toBe(200)
  })

  it('allows empty bodies with Content-Length 0 (empty case)', () => {
    // WHY: Empty POST bodies are valid for some routes.
    const request = buildRequest('POST', '0')
    const response = middleware(request)

    expect(response.status).toBe(200)
  })

  it('rejects missing Content-Length headers (error case)', () => {
    // WHY: Missing length can bypass payload size limits.
    const request = buildRequest('POST')
    const response = middleware(request)

    expect(response.status).toBe(411)
  })

  it('rejects invalid Content-Length values', () => {
    // WHY: Non-numeric and negative values should fail closed.
    expect(middleware(buildRequest('POST', 'abc')).status).toBe(400)
    expect(middleware(buildRequest('POST', '-1')).status).toBe(400)
    expect(middleware(buildRequest('POST', '10.5')).status).toBe(400)
  })

  it('rejects oversized payloads', () => {
    // WHY: Enforce a strict upper bound to prevent DoS via large bodies.
    const request = buildRequest('POST', `${MAX_BODY_SIZE_BYTES + 1}`)
    const response = middleware(request)

    expect(response.status).toBe(413)
  })
})
