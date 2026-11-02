import test from 'node:test'
import assert from 'node:assert/strict'
import { CompactSign, compactVerify, FlattenedSign, flattenedVerify } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

test('JSON Web Signature (JWS) Unencoded Payload Option', async () => {
  const jws = await new FlattenedSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(new Uint8Array(32))
  assert.deepEqual(jws, {
    payload: '',
    protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
    signature: 'VklKdp4tVYD61VNPDBTqxqdEQcUL3JK-D4dGXu9NvWs',
  })
  await assert.doesNotReject(flattenedVerify({ ...jws, payload: 'foo' }, new Uint8Array(32)))
  await assert.doesNotReject(
    flattenedVerify({ ...jws, payload: encode('foo') }, new Uint8Array(32)),
  )
})

test('detached byte payloads are copied before resolving a key', async () => {
  const key = new Uint8Array(32)
  const jws = await new FlattenedSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  const payload = Buffer.from('foo')
  const verified = await flattenedVerify({ ...jws, payload }, async () => {
    payload[0] = 0
    return key
  })
  assert.deepEqual(verified.payload, encode('foo'))
})

test('b64 check', async () => {
  await assert.rejects(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: null, crit: ['b64'] })
      .sign(new Uint8Array(32)),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
    }),
  )
  await assert.rejects(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
      .sign(new Uint8Array(32)),
    errorLike({ code: 'ERR_JWS_INVALID', message: 'Extension Header Parameter "b64" is missing' }),
  )
  await assert.rejects(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
      .setUnprotectedHeader({ b64: false })
      .sign(new Uint8Array(32)),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'Extension Header Parameter "b64" MUST be integrity protected',
    }),
  )
})

test('CompactSign rejects an unencoded payload', async () => {
  await assert.rejects(
    new CompactSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
      .sign(new Uint8Array(32)),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'use the flattened module for creating JWS with b64: false')
      return true
    },
  )
})

test('CompactSign uses one normalized protected header snapshot', async () => {
  let b64Reads = 0
  const key = new Uint8Array(32)
  const jws = await new CompactSign(encode('foo'))
    .setProtectedHeader({
      alg: 'HS256',
      crit: ['b64'],
      get b64() {
        b64Reads++
        return b64Reads === 1 ? true : false
      },
    })
    .sign(key)
  assert.equal(b64Reads, 1)
  assert.equal(jws.split('.')[1], 'Zm9v')
  const verified = await compactVerify(jws, key)
  assert.equal(verified.protectedHeader.b64, true)
})

test('Compact JWS rejects a non-ASCII unencoded payload', async () => {
  const key = new Uint8Array(32)
  const jws = await new FlattenedSign(encode('é'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  await assert.rejects(
    compactVerify(`${jws.protected}.é.${jws.signature}`, key),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'JWS Compact Serialization payload must use only ASCII characters',
    }),
  )
  const ascii = await new FlattenedSign(encode('% ~'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  const verified = await compactVerify(`${ascii.protected}.% ~.${ascii.signature}`, key)
  assert.deepEqual(verified.payload, encode('% ~'))
})

test('JWS JSON rejects lone surrogates in an unencoded payload', async () => {
  const key = new Uint8Array(32)
  const jws = await new FlattenedSign(encode('\ud800'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  // TextEncoder replaces every lone surrogate with the same U+FFFD bytes. Without validating the
  // JSON string first, replacing one lone surrogate with another leaves the signature valid.
  for (const payload of ['\ud801', '\udfff']) {
    await assert.rejects(
      flattenedVerify({ ...jws, payload }, key),
      errorLike({
        code: 'ERR_JWS_INVALID',
        message: 'JWS Payload must be a well-formed Unicode string',
      }),
    )
  }
  const astral = await new FlattenedSign(encode('😀'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  const verified = await flattenedVerify({ ...astral, payload: '😀' }, key)
  assert.deepEqual(verified.payload, encode('😀'))
})

test('JWS JSON rejects unassigned code points in an unencoded payload', async () => {
  const key = new Uint8Array(32)
  const payload = '\u0378'
  const jws = await new FlattenedSign(encode(payload))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  await assert.rejects(
    flattenedVerify({ ...jws, payload }, key),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'JWS Payload must not contain unassigned Unicode code points',
    }),
  )
})

test('JWS JSON reports the first invalid Unicode property', async () => {
  const key = new Uint8Array(32)
  const jws = await new FlattenedSign(encode('valid'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(key)
  for (const [payload, message] of [
    ['\u0378\ud800', 'JWS Payload must not contain unassigned Unicode code points'],
    ['\ud800\u0378', 'JWS Payload must be a well-formed Unicode string'],
  ]) {
    await assert.rejects(
      flattenedVerify({ ...jws, payload }, key),
      errorLike({
        code: 'ERR_JWS_INVALID',
        message,
      }),
    )
  }
})

test('b64 only affects payload encoding when protected and listed in crit', async () => {
  const key = new Uint8Array(32)
  for (const b64 of [false, true]) {
    const jws = await new CompactSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64 })
      .sign(key)
    assert.equal(jws.split('.')[1], 'Zm9v')
    await assert.doesNotReject(compactVerify(jws, key))
  }
  const malformed = await new CompactSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: null } as never)
    .sign(key)
  assert.equal(malformed.split('.')[1], 'Zm9v')
  await assert.doesNotReject(compactVerify(malformed, key))
  const unprotected = await new FlattenedSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256' })
    .setUnprotectedHeader({ b64: false })
    .sign(key)
  assert.equal(unprotected.payload, 'Zm9v')
  await assert.doesNotReject(flattenedVerify(unprotected, key))
  const jws2 = await new CompactSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: true, crit: ['b64'] })
    .sign(key)
  assert.equal(jws2.split('.')[1], 'Zm9v')
})
