import test from 'ava'

import { CompactSign, FlattenedSign, flattenedVerify } from '../../src/index.js'
const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

test('JSON Web Signature (JWS) Unencoded Payload Option', async (t) => {
  const jws = await new FlattenedSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(new Uint8Array(32))

  t.deepEqual(jws, {
    payload: '',
    protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
    signature: 'VklKdp4tVYD61VNPDBTqxqdEQcUL3JK-D4dGXu9NvWs',
  })

  await t.notThrowsAsync(flattenedVerify({ ...jws, payload: 'foo' }, new Uint8Array(32)))
  await t.notThrowsAsync(flattenedVerify({ ...jws, payload: encode('foo') }, new Uint8Array(32)))
})

test('b64 check', async (t) => {
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: null, crit: ['b64'] })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JWS_INVALID',
      message: 'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
    },
  )
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
      .sign(new Uint8Array(32)),
    { code: 'ERR_JWS_INVALID', message: 'Extension Header Parameter "b64" is missing' },
  )
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: ['b64'] })
      .setUnprotectedHeader({ b64: false })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JWS_INVALID',
      message: 'Extension Header Parameter "b64" MUST be integrity protected',
    },
  )
})

test('CompactSign rejects an unencoded payload', async (t) => {
  await t.throwsAsync(
    new CompactSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
      .sign(new Uint8Array(32)),
    {
      instanceOf: TypeError,
      message: 'use the flattened module for creating JWS with b64: false',
    },
  )
})

test('CompactSign is unaffected when b64 is not in crit', async (t) => {
  // Without "crit" listing it, "b64" is not in effect and the payload is encoded as usual.
  const jws = await new CompactSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(new Uint8Array(32))

  const { 1: payload } = jws.split('.')
  t.is(payload, 'Zm9v')

  const jws2 = await new CompactSign(encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: true, crit: ['b64'] })
    .sign(new Uint8Array(32))
  t.is(jws2.split('.')[1], 'Zm9v')
})
