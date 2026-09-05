import test from 'ava'
import * as crypto from 'crypto'

import { base64url, compactVerify, CompactSign } from '../../src/index.js'

test.before(async (t) => {
  t.context.secret = crypto.randomFillSync(new Uint8Array(32))
})

test('JWS format validation', async (t) => {
  {
    await t.notThrowsAsync(async () => {
      await compactVerify(
        await new CompactSign(new Uint8Array())
          .setProtectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
        t.context.secret,
      )
    })
  }

  await t.throwsAsync(compactVerify(null, new Uint8Array(0)), {
    message: 'Compact JWS must be a string or Uint8Array',
    code: 'ERR_JWS_INVALID',
  })
  await t.throwsAsync(compactVerify('.....', new Uint8Array(0)), {
    message: 'Invalid Compact JWS',
    code: 'ERR_JWS_INVALID',
  })
})

test('sign empty data', async (t) => {
  const jws = await new CompactSign(new Uint8Array(0))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))

  t.is(jws.split('.')[1], '')

  const { payload } = await compactVerify(jws, new Uint8Array(32))
  t.is(payload.byteLength, 0)
})

test('Compact JWS payload checks retain their resolver timing', async (t) => {
  const encoded = base64url.encode(JSON.stringify({ alg: 'HS256' }))
  let resolverCalls = 0
  const resolver = async () => {
    resolverCalls++
    return t.context.secret
  }

  await t.throwsAsync(compactVerify(`${encoded}.é.`, resolver), {
    code: 'ERR_JWS_INVALID',
    message: 'The payload is not a valid base64url string',
  })
  t.is(resolverCalls, 1)

  const unencoded = base64url.encode(JSON.stringify({ alg: 'HS256', b64: false, crit: ['b64'] }))
  await t.throwsAsync(compactVerify(`${unencoded}.é.`, resolver), {
    code: 'ERR_JWS_INVALID',
    message: 'JWS Compact Serialization payload must use only ASCII characters',
  })
  t.is(resolverCalls, 1)
})

test('Compact JWS resolves a key before rejecting an unsupported alg', async (t) => {
  const encoded = base64url.encode(JSON.stringify({ alg: 'unsupported' }))
  let resolverCalls = 0

  await t.throwsAsync(
    compactVerify(`${encoded}.e30.`, async () => {
      resolverCalls++
      return t.context.secret
    }),
    { code: 'ERR_JOSE_NOT_SUPPORTED' },
  )
  t.is(resolverCalls, 1)
})

test('Compact JWS verification snapshots the protected member before resolving a key', async (t) => {
  const payload = new TextEncoder().encode('payload')
  const original = base64url.encode(JSON.stringify({ alg: 'HS256', kid: 'original' }))
  const signed = await new CompactSign(payload)
    .setProtectedHeader({ alg: 'HS256', kid: 'mutated' })
    .sign(t.context.secret)
  const [mutated, encodedPayload, signature] = signed.split('.')

  await t.throwsAsync(
    compactVerify(`${original}.${encodedPayload}.${signature}`, async (_protectedHeader, token) => {
      token.protected = mutated
      return t.context.secret
    }),
    { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
  )
})

test('Compact JWS results retain their serialization shape after key resolution', async (t) => {
  const jws = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  const result = await compactVerify(jws, async (_protectedHeader, token) => {
    delete token.protected
    token.header = { unexpected: true }
    return t.context.secret
  })

  t.deepEqual(result.protectedHeader, { alg: 'HS256' })
  t.false('unprotectedHeader' in result)
  t.is(result.key, t.context.secret)
})

test.serial('resolved keys are returned as own data properties', async (t) => {
  const jws = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)
  let intercepted: unknown
  let result
  const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'key')

  Object.defineProperty(Object.prototype, 'key', {
    configurable: true,
    set(value) {
      intercepted = value
    },
  })
  try {
    result = await compactVerify(jws, async () => t.context.secret)
  } finally {
    if (descriptor) Object.defineProperty(Object.prototype, 'key', descriptor)
    else Reflect.deleteProperty(Object.prototype, 'key')
  }

  t.true(Object.hasOwn(result!, 'key'))
  t.is(result!.key, t.context.secret)
  t.is(intercepted, undefined)
})
