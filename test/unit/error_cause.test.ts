import assert from 'node:assert/strict'
import test from 'node:test'
import { captureRejection, captureError } from '../_errors.js'

import {
  base64url,
  CompactSign,
  compactVerify,
  createLocalJWKSet,
  createRemoteJWKSet,
  customFetch,
  decodeJwt,
  decodeProtectedHeader,
  errors,
  flattenedVerify,
  generateKeyPair,
  importSPKI,
  jwtVerify,
} from '../../src/index.js'

for (const format of ['compact', 'flattened', 'jwt'] as const) {
  test(`${format} verification preserves primitive errors and distinguishes false results`, async () => {
    const { privateKey, publicKey } = await generateKeyPair('Ed25519')
    const token = await new CompactSign(new TextEncoder().encode('{}'))
      .setProtectedHeader({ alg: 'Ed25519' })
      .sign(privateKey)
    const verify = (input: string) => {
      if (format === 'jwt') return jwtVerify(input, publicKey)
      if (format === 'compact') return compactVerify(input, publicKey)
      const [protectedHeader, payload, signature] = input.split('.')
      return flattenedVerify({ protected: protectedHeader, payload, signature }, publicKey)
    }
    await assert.doesNotReject(verify(token))

    const parts = token.split('.')
    const signature = base64url.decode(parts[2]!)
    signature[0]! ^= 1
    parts[2] = base64url.encode(signature)
    const invalid = await captureRejection(verify(parts.join('.')), (error) => {
      assert.ok(error instanceof errors.JWSSignatureVerificationFailed)
      assert.strictEqual(error.code, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED')
      assert.strictEqual(error.message, 'signature verification failed')
      return true
    })
    assert.strictEqual(Object.hasOwn(invalid!, 'cause'), false)

    const subtle = crypto.subtle
    const descriptor = Object.getOwnPropertyDescriptor(subtle, 'verify')
    const cause = new DOMException('verification failed', 'OperationError')
    let calls = 0
    Object.defineProperty(subtle, 'verify', {
      configurable: true,
      value: async () => {
        calls++
        throw cause
      },
    })
    try {
      const error = await captureRejection(verify(token), (error) => {
        assert.ok(error instanceof errors.JWSSignatureVerificationFailed)
        assert.strictEqual(error.code, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED')
        assert.strictEqual(error.message, 'signature verification failed')
        return true
      })
      assert.strictEqual(error?.cause, cause)
      assert.strictEqual(calls, 1)
    } finally {
      if (descriptor) Object.defineProperty(subtle, 'verify', descriptor)
      else Reflect.deleteProperty(subtle, 'verify')
    }
    await assert.doesNotReject(verify(token))
  })
}

test('JOSE Header decoding preserves decoding and parsing errors', () => {
  for (const [encoded, Cause] of [
    ['!', TypeError],
    [base64url.encode(new Uint8Array([0xff])), TypeError],
    [base64url.encode('{'), SyntaxError],
  ] as const) {
    const error = captureError(() => decodeProtectedHeader(`${encoded}..`), TypeError)
    assert.strictEqual(error?.cause instanceof Cause, true)
  }

  const error = captureError(
    () => decodeProtectedHeader(`${base64url.encode('null')}..`),
    TypeError,
  )
  assert.strictEqual(Object.hasOwn(error!, 'cause'), false)
})

test('JWT decoding preserves decoding and parsing errors', () => {
  for (const [encoded, Cause] of [
    ['!', TypeError],
    [base64url.encode(new Uint8Array([0xff])), TypeError],
    [base64url.encode('{'), SyntaxError],
  ] as const) {
    const error = captureError(() => decodeJwt(`e30.${encoded}.`), errors.JWTInvalid)
    assert.strictEqual(error?.cause instanceof Cause, true)
  }

  const error = captureError(() => decodeJwt(`e30.${base64url.encode('null')}.`), errors.JWTInvalid)
  assert.strictEqual(Object.hasOwn(error!, 'cause'), false)
})

test('authenticated JWT Claims Set parsing preserves the underlying error', async () => {
  const key = new Uint8Array(32)
  for (const [payload, Cause] of [
    [new Uint8Array([0xff]), TypeError],
    [new TextEncoder().encode('{'), SyntaxError],
  ] as const) {
    const token = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
    const error = await captureRejection(jwtVerify(token, key), (error) => {
      assert.ok(error instanceof errors.JWTInvalid)
      assert.strictEqual(error.message, 'JWT Claims Set must be a top-level JSON object')
      return true
    })
    assert.strictEqual(error?.cause instanceof Cause, true)
  }
})

test('JWS member decoding and ASCII encoding preserve their errors', async () => {
  const key = new Uint8Array(32)
  const token = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(key)
  const [protectedHeader] = token.split('.')
  for (const input of [`${protectedHeader}..!`, `${protectedHeader}.é.`]) {
    const error = await captureRejection(compactVerify(input, key), errors.JWSInvalid)
    assert.strictEqual(error?.cause instanceof TypeError, true)
  }

  const unencoded = base64url.encode(JSON.stringify({ alg: 'HS256', b64: false, crit: ['b64'] }))
  const error = await captureRejection(compactVerify(`${unencoded}.é.`, key), (error) => {
    assert.ok(error instanceof errors.JWSInvalid)
    assert.strictEqual(
      error.message,
      'JWS Compact Serialization payload must use only ASCII characters',
    )
    return true
  })
  assert.strictEqual(error?.cause instanceof TypeError, true)
})

test('local JWKS cloning preserves the underlying error', () => {
  const cause = new Error('failed to read keys')
  const error = captureError(
    () =>
      createLocalJWKSet({
        get keys() {
          throw cause
        },
      }),
    (error) => {
      assert.ok(error instanceof errors.JWKSInvalid)
      assert.strictEqual(error.message, 'JSON Web Key Set malformed')
      return true
    },
  )
  assert.strictEqual(error?.cause, cause)
})

test('remote JWKS response parsing preserves the underlying error', async () => {
  const cause = new SyntaxError('invalid response JSON')
  const jwks = createRemoteJWKSet(new URL('https://as.example.com/jwks'), {
    [customFetch]: async () => {
      const response = new Response('', { status: 200 })
      response.json = async () => {
        throw cause
      }
      return response
    },
  })
  const error = await captureRejection(jwks({ alg: 'Ed25519' }), (error) => {
    assert.ok(error instanceof errors.JOSEError)
    assert.strictEqual(error.message, 'Failed to parse the JSON Web Key Set HTTP response as JSON')
    return true
  })
  assert.strictEqual(error?.cause, cause)
})

test('remote JWKS timeouts preserve the underlying error', async () => {
  const cause = new DOMException('request timed out', 'TimeoutError')
  const jwks = createRemoteJWKSet(new URL('https://as.example.com/jwks'), {
    [customFetch]: async () => {
      throw cause
    },
  })
  const error = await captureRejection(jwks({ alg: 'Ed25519' }), (error) => {
    assert.ok(error instanceof errors.JWKSTimeout)
    assert.strictEqual(error.code, 'ERR_JWKS_TIMEOUT')
    assert.strictEqual(error.message, 'request timed out')
    return true
  })
  assert.strictEqual(error?.cause, cause)
})

test('key format parsing preserves the underlying error', async () => {
  const error = await captureRejection(
    importSPKI('-----BEGIN PUBLIC KEY-----\nAA==\n-----END PUBLIC KEY-----', 'ECDH-ES'),
    (error) => {
      assert.ok(error instanceof errors.JOSENotSupported)
      assert.strictEqual(error.message, 'Invalid or unsupported key format')
      return true
    },
  )
  assert.strictEqual(error?.cause instanceof Error, true)
})
