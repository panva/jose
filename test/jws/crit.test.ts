import test from 'ava'

import { base64url, FlattenedSign, flattenedVerify } from '../../src/index.js'

const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

test('crit member checks check', async (t) => {
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256' })
      .setUnprotectedHeader({ crit: ['b64'] })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JWS_INVALID',
      message: '"crit" (Critical) Header Parameter MUST be integrity protected',
    },
  )
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: [null], b64: false })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JWS_INVALID',
      message:
        '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
    },
  )
  await t.throwsAsync(
    new FlattenedSign(encode('foo'))
      .setProtectedHeader({ alg: 'HS256', crit: ['nope'], nope: 'foo' })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "nope" is not recognized',
    },
  )
})

test('duplicate "crit" values are rejected when producing', async (t) => {
  // RFC 7515 Section 4.1.11: producers MUST NOT include duplicate names in the "crit" list.
  await t.throwsAsync(
    new FlattenedSign(new TextEncoder().encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: true, crit: ['b64', 'b64'] })
      .sign(new Uint8Array(32)),
    {
      code: 'ERR_JWS_INVALID',
      message: '"crit" (Critical) Header Parameter MUST NOT contain duplicate values',
    },
  )

  await t.notThrowsAsync(
    new FlattenedSign(new TextEncoder().encode('foo'))
      .setProtectedHeader({ alg: 'HS256', b64: true, crit: ['b64'] })
      .sign(new Uint8Array(32)),
  )
})

test('duplicate "crit" values are tolerated when consuming', async (t) => {
  // The recipient side only MAY consider such a header invalid, and the extension set is a Set, so
  // a duplicated entry has no effect on what is checked.
  const jws = await new FlattenedSign(new TextEncoder().encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: true, crit: ['b64'] })
    .sign(new Uint8Array(32))

  const header = JSON.parse(new TextDecoder().decode(base64url.decode(jws.protected!)))
  header.crit = ['b64', 'b64']
  const tampered = { ...jws, protected: base64url.encode(JSON.stringify(header)) }

  // The signature no longer matches the rewritten header, which is the failure that surfaces.
  await t.throwsAsync(flattenedVerify(tampered, new Uint8Array(32)), {
    code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
  })
})
