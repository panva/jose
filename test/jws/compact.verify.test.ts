import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import * as crypto from 'crypto'
import { base64url, compactVerify, CompactSign, errors } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { secret: Uint8Array }

before(async () => {
  context.secret = crypto.randomFillSync(new Uint8Array(32))
})

test('JWS format validation', async () => {
  {
    await assert.doesNotReject(async () => {
      await compactVerify(
        await new CompactSign(new Uint8Array())
          .setProtectedHeader({ alg: 'HS256' })
          .sign(context.secret),
        context.secret,
      )
    })
  }
  await assert.rejects(
    compactVerify(null, new Uint8Array(0)),
    errorLike({
      message: 'Compact JWS must be a string or Uint8Array',
      code: 'ERR_JWS_INVALID',
    }),
  )
  await assert.rejects(
    compactVerify('.....', new Uint8Array(0)),
    errorLike({
      message: 'Invalid Compact JWS',
      code: 'ERR_JWS_INVALID',
    }),
  )
})

test('sign empty data', async () => {
  const jws = await new CompactSign(new Uint8Array(0))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))
  assert.equal(jws.split('.')[1], '')
  const { payload } = await compactVerify(jws, new Uint8Array(32))
  assert.equal(payload.byteLength, 0)
})

test('Compact JWS payload checks retain their resolver timing', async () => {
  const encoded = base64url.encode(JSON.stringify({ alg: 'HS256' }))
  const unencoded = base64url.encode(JSON.stringify({ alg: 'HS256', b64: false, crit: ['b64'] }))
  let resolverCalls = 0
  const resolver = async () => {
    resolverCalls++
    return context.secret
  }
  for (const payload of [
    'é',
    'a'.repeat(127) + 'é',
    'a'.repeat(128) + 'é',
    'a'.repeat(1024) + '\ud800',
  ]) {
    const previousCalls = resolverCalls
    await assert.rejects(compactVerify(`${encoded}.${payload}.`, resolver), (error) => {
      assert.ok(error instanceof errors.JWSInvalid)
      assert.equal(error.code, 'ERR_JWS_INVALID')
      assert.equal(error.message, 'The payload is not a valid base64url string')
      return true
    })
    assert.equal(resolverCalls, previousCalls + 1)
    await assert.rejects(compactVerify(`${unencoded}.${payload}.`, resolver), (error) => {
      assert.ok(error instanceof errors.JWSInvalid)
      assert.equal(error.code, 'ERR_JWS_INVALID')
      assert.equal(
        error.message,
        'JWS Compact Serialization payload must use only ASCII characters',
      )
      return true
    })
    assert.equal(resolverCalls, previousCalls + 1)
  }
})

test('Compact JWS resolves a key before rejecting an unsupported alg', async () => {
  const encoded = base64url.encode(JSON.stringify({ alg: 'unsupported' }))
  let resolverCalls = 0
  await assert.rejects(
    compactVerify(`${encoded}.e30.`, async () => {
      resolverCalls++
      return context.secret
    }),
    errorLike({ code: 'ERR_JOSE_NOT_SUPPORTED' }),
  )
  assert.equal(resolverCalls, 1)
})

test('Compact JWS verification snapshots the protected member before resolving a key', async () => {
  const payload = new TextEncoder().encode('payload')
  const original = base64url.encode(JSON.stringify({ alg: 'HS256', kid: 'original' }))
  const signed = await new CompactSign(payload)
    .setProtectedHeader({ alg: 'HS256', kid: 'mutated' })
    .sign(context.secret)
  const [mutated, encodedPayload, signature] = signed.split('.')
  await assert.rejects(
    compactVerify(`${original}.${encodedPayload}.${signature}`, async (_protectedHeader, token) => {
      token.protected = mutated
      return context.secret
    }),
    errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
  )
})

test('Compact JWS results retain their serialization shape after key resolution', async () => {
  const jws = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  const result = await compactVerify(jws, async (_protectedHeader, token) => {
    delete token.protected
    token.header = { unexpected: true }
    return context.secret
  })
  assert.deepEqual(result.protectedHeader, { alg: 'HS256' })
  assert.equal('unprotectedHeader' in result, false)
  assert.equal(result.key, context.secret)
})

test('resolved keys are returned as own data properties', async () => {
  const jws = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
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
    result = await compactVerify(jws, async () => context.secret)
  } finally {
    if (descriptor) Object.defineProperty(Object.prototype, 'key', descriptor)
    else Reflect.deleteProperty(Object.prototype, 'key')
  }
  assert.equal(Object.hasOwn(result!, 'key'), true)
  assert.equal(result!.key, context.secret)
  assert.equal(intercepted, undefined)
})
