import test from 'ava'

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
  test.serial(
    `${format} verification preserves primitive errors and distinguishes false results`,
    async (t) => {
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
      await t.notThrowsAsync(verify(token))

      const parts = token.split('.')
      const signature = base64url.decode(parts[2]!)
      signature[0]! ^= 1
      parts[2] = base64url.encode(signature)
      const invalid = await t.throwsAsync(verify(parts.join('.')), {
        instanceOf: errors.JWSSignatureVerificationFailed,
        code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
        message: 'signature verification failed',
      })
      t.false(Object.hasOwn(invalid!, 'cause'))

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
        const error = await t.throwsAsync(verify(token), {
          instanceOf: errors.JWSSignatureVerificationFailed,
          code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
          message: 'signature verification failed',
        })
        t.is(error?.cause, cause)
        t.is(calls, 1)
      } finally {
        if (descriptor) Object.defineProperty(subtle, 'verify', descriptor)
        else Reflect.deleteProperty(subtle, 'verify')
      }
      await t.notThrowsAsync(verify(token))
    },
  )
}

test('JOSE Header decoding preserves decoding and parsing errors', (t) => {
  for (const [encoded, Cause] of [
    ['!', TypeError],
    [base64url.encode(new Uint8Array([0xff])), TypeError],
    [base64url.encode('{'), SyntaxError],
  ] as const) {
    const error = t.throws(() => decodeProtectedHeader(`${encoded}..`), {
      instanceOf: TypeError,
    })
    t.true(error?.cause instanceof Cause)
  }

  const error = t.throws(() => decodeProtectedHeader(`${base64url.encode('null')}..`), {
    instanceOf: TypeError,
  })
  t.false(Object.hasOwn(error!, 'cause'))
})

test('JWT decoding preserves decoding and parsing errors', (t) => {
  for (const [encoded, Cause] of [
    ['!', TypeError],
    [base64url.encode(new Uint8Array([0xff])), TypeError],
    [base64url.encode('{'), SyntaxError],
  ] as const) {
    const error = t.throws(() => decodeJwt(`e30.${encoded}.`), {
      instanceOf: errors.JWTInvalid,
    })
    t.true(error?.cause instanceof Cause)
  }

  const error = t.throws(() => decodeJwt(`e30.${base64url.encode('null')}.`), {
    instanceOf: errors.JWTInvalid,
  })
  t.false(Object.hasOwn(error!, 'cause'))
})

test('authenticated JWT Claims Set parsing preserves the underlying error', async (t) => {
  const key = new Uint8Array(32)
  for (const [payload, Cause] of [
    [new Uint8Array([0xff]), TypeError],
    [new TextEncoder().encode('{'), SyntaxError],
  ] as const) {
    const token = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
    const error = await t.throwsAsync(jwtVerify(token, key), {
      instanceOf: errors.JWTInvalid,
      message: 'JWT Claims Set must be a top-level JSON object',
    })
    t.true(error?.cause instanceof Cause)
  }
})

test('JWS member decoding and ASCII encoding preserve their errors', async (t) => {
  const key = new Uint8Array(32)
  const token = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(key)
  const [protectedHeader] = token.split('.')
  for (const input of [`${protectedHeader}..!`, `${protectedHeader}.é.`]) {
    const error = await t.throwsAsync(compactVerify(input, key), {
      instanceOf: errors.JWSInvalid,
    })
    t.true(error?.cause instanceof TypeError)
  }

  const unencoded = base64url.encode(JSON.stringify({ alg: 'HS256', b64: false, crit: ['b64'] }))
  const error = await t.throwsAsync(compactVerify(`${unencoded}.é.`, key), {
    instanceOf: errors.JWSInvalid,
    message: 'JWS Compact Serialization payload must use only ASCII characters',
  })
  t.true(error?.cause instanceof TypeError)
})

test('local JWKS cloning preserves the underlying error', (t) => {
  const cause = new Error('failed to read keys')
  const error = t.throws(
    () =>
      createLocalJWKSet({
        get keys() {
          throw cause
        },
      }),
    { instanceOf: errors.JWKSInvalid, message: 'JSON Web Key Set malformed' },
  )
  t.is(error?.cause, cause)
})

test('remote JWKS response parsing preserves the underlying error', async (t) => {
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
  const error = await t.throwsAsync(jwks({ alg: 'Ed25519' }), {
    instanceOf: errors.JOSEError,
    message: 'Failed to parse the JSON Web Key Set HTTP response as JSON',
  })
  t.is(error?.cause, cause)
})

test('remote JWKS timeouts preserve the underlying error', async (t) => {
  const cause = new DOMException('request timed out', 'TimeoutError')
  const jwks = createRemoteJWKSet(new URL('https://as.example.com/jwks'), {
    [customFetch]: async () => {
      throw cause
    },
  })
  const error = await t.throwsAsync(jwks({ alg: 'Ed25519' }), {
    instanceOf: errors.JWKSTimeout,
    code: 'ERR_JWKS_TIMEOUT',
    message: 'request timed out',
  })
  t.is(error?.cause, cause)
})

test('key format parsing preserves the underlying error', async (t) => {
  const error = await t.throwsAsync(
    importSPKI('-----BEGIN PUBLIC KEY-----\nAA==\n-----END PUBLIC KEY-----', 'ECDH-ES'),
    { instanceOf: errors.JOSENotSupported, message: 'Invalid or unsupported key format' },
  )
  t.true(error?.cause instanceof Error)
})
