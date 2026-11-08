import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import * as crypto from 'crypto'
import { FlattenedSign, flattenedVerify, GeneralSign, generalVerify } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { plaintext: Uint8Array; secret: Uint8Array }

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.secret = crypto.randomFillSync(new Uint8Array(48))
})

test('General JWS signing', async () => {
  const generalJws = await new GeneralSign(context.plaintext)
    .addSignature(context.secret)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ alg: 'HS256' })
    .addSignature(context.secret)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ alg: 'HS384' })
    .sign()
  assert.equal(
    generalJws.payload,
    'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  )
  assert.equal(generalJws.signatures.length, 2)
})

test('General JWS signs one payload for all signatures and refreshes it for each operation', async () => {
  const payload = Uint8Array.of(1, 128, 255)
  const builder = new GeneralSign(payload)
    .addSignature(context.secret)
    .setProtectedHeader({ alg: 'HS256' })
    .addSignature(context.secret)
    .setProtectedHeader({
      get alg() {
        payload[0]++
        return 'HS256'
      },
    })
  for (const expectedFirstByte of [1, 2]) {
    const jws = await builder.sign()
    assert.equal(payload[0], expectedFirstByte + 1)
    for (const signature of jws.signatures) {
      const verified = await flattenedVerify({ ...signature, payload: jws.payload }, context.secret)
      assert.deepEqual(verified.payload, Uint8Array.of(expectedFirstByte, 128, 255))
    }
  }
})

test('General JWS signing b64:false', async () => {
  const generalJws = await new GeneralSign(context.plaintext)
    .addSignature(context.secret)
    .setProtectedHeader({ bar: 'baz', b64: false, crit: ['b64'] })
    .setUnprotectedHeader({ alg: 'HS256' })
    .addSignature(context.secret)
    .setProtectedHeader({ bar: 'baz', b64: false, crit: ['b64'] })
    .setUnprotectedHeader({ alg: 'HS384' })
    .sign()
  assert.equal(generalJws.payload, '')
  assert.equal(generalJws.signatures.length, 2)
})

test('General JWS signing compares serialized b64 modes', async () => {
  let b64Reads = 0
  const protectedHeader = {
    alg: 'HS256',
    crit: ['b64'],
    get b64() {
      b64Reads++
      return b64Reads === 1 ? false : true
    },
  }
  const generalJws = await new GeneralSign(new TextEncoder().encode('foo'))
    .addSignature(context.secret)
    .setProtectedHeader(protectedHeader)
    .addSignature(context.secret)
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign()
  assert.equal(b64Reads, 1)
  assert.equal(generalJws.payload, '')
  await assert.doesNotReject(generalVerify({ ...generalJws, payload: 'foo' }, context.secret))
})

test('General JWS signing validations', async () => {
  const sig = new GeneralSign(context.plaintext)
  assert.throws(
    () => {
      sig
        .addSignature(context.secret)
        .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: false, alg: 'HS256' })
        .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: false, alg: 'HS256' })
    },
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setProtectedHeader can only be called once')
      return true
    },
  )
  assert.throws(
    () => {
      sig
        .addSignature(context.secret)
        .setProtectedHeader({ bar: 'baz', crit: ['b64'], b64: true, alg: 'HS384' })
        .setUnprotectedHeader({ foo: 'bar' })
        .setUnprotectedHeader({ foo: 'bar' })
    },
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setUnprotectedHeader can only be called once')
      return true
    },
  )
  await assert.rejects(
    sig.sign(),
    errorLike({
      message: 'inconsistent use of JWS Unencoded Payload (RFC7797)',
      code: 'ERR_JWS_INVALID',
    }),
  )
})

test('GeneralSign JOSE header values must be objects', async () => {
  for (const value of [null, 'not an object', [], new Date(0), 42, false]) {
    await assert.rejects(
      new GeneralSign(context.plaintext)
        .addSignature(context.secret)
        .setProtectedHeader(value as never)
        .setUnprotectedHeader({ alg: 'HS256' })
        .sign(),
      errorLike({ code: 'ERR_JWS_INVALID' }),
    )
    await assert.rejects(
      new GeneralSign(context.plaintext)
        .addSignature(context.secret)
        .setProtectedHeader({ alg: 'HS256' })
        .setUnprotectedHeader(value as never)
        .sign(),
      errorLike({ code: 'ERR_JWS_INVALID' }),
    )
  }
})

test('General JWS verification rejects inconsistent b64 modes', async () => {
  const encoded = await new FlattenedSign(new TextEncoder().encode('foo'))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  const unencoded = await new FlattenedSign(new TextEncoder().encode(encoded.payload))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
    .sign(context.secret)
  const signatures = [
    { protected: encoded.protected, signature: encoded.signature },
    { protected: unencoded.protected, signature: unencoded.signature },
  ]
  let resolveCalls = 0
  const resolve = () => {
    resolveCalls++
    return context.secret
  }
  for (const ordered of [signatures, [...signatures].reverse()]) {
    await assert.rejects(
      generalVerify({ payload: encoded.payload, signatures: ordered }, resolve),
      errorLike({
        code: 'ERR_JWS_INVALID',
        message: 'inconsistent use of JWS Unencoded Payload (RFC7797)',
      }),
    )
  }
  assert.equal(resolveCalls, 0)
  const { payload } = await generalVerify(
    { payload: encoded.payload, signatures: [signatures[0], signatures[0]] },
    resolve,
  )
  assert.deepEqual(payload, new TextEncoder().encode('foo'))
  assert.equal(resolveCalls, 1)
  const ignored = await new FlattenedSign(new TextEncoder().encode('foo'))
    .setProtectedHeader({ alg: 'HS256', b64: false })
    .sign(context.secret)
  const ignoredResult = await generalVerify(
    {
      payload: encoded.payload,
      signatures: [signatures[0], { protected: ignored.protected, signature: ignored.signature }],
    },
    context.secret,
  )
  assert.deepEqual(ignoredResult.payload, new TextEncoder().encode('foo'))
  const unrecognized = await new FlattenedSign(new TextEncoder().encode(encoded.payload))
    .setProtectedHeader({
      alg: 'HS256',
      b64: false,
      crit: ['b64', 'unknown'],
      unknown: true,
    })
    .sign(context.secret, { crit: { unknown: true } })
  await assert.rejects(
    generalVerify(
      {
        payload: encoded.payload,
        signatures: [
          { protected: unrecognized.protected, signature: unrecognized.signature },
          signatures[0],
        ],
      },
      resolve,
    ),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'inconsistent use of JWS Unencoded Payload (RFC7797)',
    }),
  )
  assert.equal(resolveCalls, 1)
  const throwing = Object.defineProperty({ signature: '' }, 'protected', {
    get() {
      throw new Error('unexpected getter')
    },
  })
  const afterThrowing = await generalVerify(
    { payload: encoded.payload, signatures: [throwing as never, signatures[0]] },
    resolve,
  )
  assert.deepEqual(afterThrowing.payload, new TextEncoder().encode('foo'))
  assert.equal(resolveCalls, 2)
  let protectedReads = 0
  const switching = Object.defineProperty({ signature: unencoded.signature }, 'protected', {
    enumerable: true,
    get() {
      protectedReads++
      return protectedReads === 1 ? encoded.protected : unencoded.protected
    },
  })
  const afterSwitching = await generalVerify(
    { payload: encoded.payload, signatures: [switching as never, signatures[0]] },
    context.secret,
  )
  assert.equal(protectedReads, 1)
  assert.deepEqual(afterSwitching.protectedHeader, { alg: 'HS256' })
  assert.deepEqual(afterSwitching.payload, new TextEncoder().encode('foo'))
  const detached = new TextEncoder().encode(encoded.payload)
  await assert.rejects(
    generalVerify({ payload: detached, signatures }, resolve),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'inconsistent use of JWS Unencoded Payload (RFC7797)',
    }),
  )
  assert.equal(resolveCalls, 2)
})

test('General JWS verification does not hide invalid algorithms options', async () => {
  const jws = await new GeneralSign(context.plaintext)
    .addSignature(context.secret)
    .setProtectedHeader({ alg: 'HS256' })
    .sign()
  let resolveCalls = 0
  const resolve = () => {
    resolveCalls++
    return context.secret
  }
  for (const algorithms of [null, 'HS256', {}, [1], ['HS256', null]]) {
    for (const input of [jws, { ...jws, signatures: [] }, { ...jws, signatures: [{}] }]) {
      for (const key of [context.secret, resolve]) {
        await assert.rejects(
          generalVerify(input as never, key, { algorithms: algorithms as never }),
          errorLike({
            name: 'TypeError',
            message: '"algorithms" option must be an array of strings',
          }),
        )
      }
    }
  }
  assert.equal(resolveCalls, 0)
  await assert.rejects(
    generalVerify(jws, resolve, { algorithms: ['HS384'] }),
    errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
  )
  assert.equal(resolveCalls, 0)
})

test('General JWS verify format validation', async () => {
  const sig = new GeneralSign(context.plaintext)
  sig
    .addSignature(context.secret)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ alg: 'HS256' })
  const generalJws = await sig.sign()
  {
    await assert.doesNotReject(async () => {
      await generalVerify(
        await new GeneralSign(new Uint8Array())
          .addSignature(context.secret)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(),
        context.secret,
      )
    })
  }
  {
    await assert.rejects(
      generalVerify(null, context.secret),
      errorLike({
        message: 'General JWS must be an object',
        code: 'ERR_JWS_INVALID',
      }),
    )
  }
  {
    await assert.rejects(
      generalVerify({ signatures: null }, context.secret),
      errorLike({
        message: 'JWS Signatures missing or incorrect type',
        code: 'ERR_JWS_INVALID',
      }),
    )
  }
  {
    await assert.rejects(
      generalVerify({ signatures: [null] }, context.secret),
      errorLike({
        message: 'JWS Signatures missing or incorrect type',
        code: 'ERR_JWS_INVALID',
      }),
    )
  }
  {
    const jws = { payload: generalJws.payload, signatures: [] }
    await assert.rejects(
      generalVerify(jws, context.secret),
      errorLike({
        message: 'signature verification failed',
        code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
      }),
    )
  }
  {
    await assert.doesNotReject(generalVerify(generalJws, context.secret))
  }
  {
    await assert.rejects(
      generalVerify({ ...generalJws, payload: undefined as never }, context.secret),
      errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
    )
  }
  {
    const { payload, signatures } = generalJws
    const jws = { payload, signatures: [...signatures, {}] }
    await assert.doesNotReject(generalVerify(jws, context.secret))
  }
  {
    const { payload, signatures } = generalJws
    const jws = { payload, signatures: [{}, ...signatures] }
    await assert.doesNotReject(generalVerify(jws, context.secret))
  }
})

test('an empty protected member is not an encoded protected header', async () => {
  const jws = await new GeneralSign(context.plaintext)
    .addSignature(context.secret)
    .setUnprotectedHeader({ alg: 'HS256' })
    .sign()
  jws.signatures[0].protected = ''
  await assert.rejects(
    generalVerify(jws, context.secret),
    errorLike({
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }),
  )
})

test('sign empty data', async () => {
  const jws = await new GeneralSign(new Uint8Array(0))
    .addSignature(new Uint8Array(32))
    .setProtectedHeader({ alg: 'HS256' })
    .sign()
  assert.equal(jws.payload, '')
  const { payload } = await generalVerify(jws, new Uint8Array(32))
  assert.equal(payload.byteLength, 0)
  const mixed = new GeneralSign(new Uint8Array(0))
    .addSignature(new Uint8Array(32))
    .setProtectedHeader({ alg: 'HS256' })
    .addSignature(new Uint8Array(32))
    .setProtectedHeader({ alg: 'HS256', b64: false, crit: ['b64'] })
  await assert.rejects(
    mixed.sign(),
    errorLike({
      message: 'inconsistent use of JWS Unencoded Payload (RFC7797)',
      code: 'ERR_JWS_INVALID',
    }),
  )
})
