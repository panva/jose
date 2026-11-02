import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import { FlattenedSign, flattenedVerify } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { payload: Uint8Array; secret: Uint8Array }

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.payload = encode('It’s a dangerous business, Frodo, going out your door.')
  context.secret = new Uint8Array(32)
})

test('FlattenedSign encodes the current payload and options for each operation', async () => {
  const payload = Uint8Array.of(1)
  const builder = new FlattenedSign(payload).setProtectedHeader({
    alg: 'HS256',
    crit: ['test'],
    test: true,
  })
  const options = { crit: { test: true } }
  const first = builder.sign(context.secret, options)
  payload[0] = 2
  const second = builder.sign(context.secret, options)
  const results = await Promise.all(
    [first, second].map(async (jws) => flattenedVerify(await jws, context.secret, options)),
  )
  assert.deepEqual(results[0].payload, Uint8Array.of(1))
  assert.deepEqual(results[1].payload, Uint8Array.of(2))
  await assert.rejects(builder.sign(context.secret), errorLike({ code: 'ERR_JOSE_NOT_SUPPORTED' }))
})

test('FlattenedSign', async () => {
  {
    const jws = await new FlattenedSign(context.payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setUnprotectedHeader({ foo: 'bar' })
      .sign(context.secret)
    assert.deepEqual(jws, {
      header: {
        foo: 'bar',
      },
      payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
      protected: 'eyJhbGciOiJIUzI1NiJ9',
      signature: 'UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
    })
  }
  {
    const jws = await new FlattenedSign(context.payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(context.secret)
    assert.deepEqual(jws, {
      protected: 'eyJhbGciOiJIUzI1NiJ9',
      payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
      signature: 'UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
    })
  }
  {
    const jws = await new FlattenedSign(context.payload)
      .setUnprotectedHeader({ alg: 'HS256' })
      .sign(context.secret)
    assert.deepEqual(jws, {
      header: {
        alg: 'HS256',
      },
      payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
      signature: 'O7HdMZ_6_aEQWLGGItmCKN3pf8-nZ9mHnPfT7rrPCwk',
    })
  }
  {
    for (const value of [
      undefined,
      null,
      {},
      '',
      'foo',
      1,
      0,
      true,
      false,
      [],
      new FlattenedSign(new Uint8Array()),
    ]) {
      assert.throws(
        () => new FlattenedSign(value),
        (error) => {
          assert.ok(error instanceof TypeError)
          assert.equal(error.message, 'payload must be an instance of Uint8Array')
          return true
        },
      )
    }
  }
})

test('FlattenedSign.prototype.setProtectedHeader', () => {
  assert.throws(
    () => new FlattenedSign(context.payload).setProtectedHeader({}).setProtectedHeader({}),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setProtectedHeader can only be called once')
      return true
    },
  )
})

test('FlattenedSign.prototype.setUnprotectedHeader', () => {
  assert.throws(
    () => new FlattenedSign(context.payload).setUnprotectedHeader({}).setUnprotectedHeader({}),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setUnprotectedHeader can only be called once')
      return true
    },
  )
})

test('FlattenedSign JOSE header values must be objects', async () => {
  for (const value of [null, 'not an object', [], new Date(0), 42, false]) {
    await assert.rejects(
      new FlattenedSign(context.payload)
        .setProtectedHeader(value as never)
        .setUnprotectedHeader({ alg: 'HS256' })
        .sign(context.secret),
      errorLike({ code: 'ERR_JWS_INVALID' }),
    )
    await assert.rejects(
      new FlattenedSign(context.payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setUnprotectedHeader(value as never)
        .sign(context.secret),
      errorLike({ code: 'ERR_JWS_INVALID' }),
    )
  }
})

test('FlattenedSign.prototype.sign must have a JOSE header', async () => {
  await assert.rejects(
    new FlattenedSign(context.payload).sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    }),
  )
})

test('FlattenedSign.prototype.sign JOSE header must be disjoint', async () => {
  await assert.rejects(
    new FlattenedSign(context.payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setUnprotectedHeader({ alg: 'HS256' })
      .sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
    }),
  )
})

test('FlattenedSign.prototype.sign JOSE header have an alg', async () => {
  await assert.rejects(
    new FlattenedSign(context.payload)
      .setProtectedHeader({})
      .setUnprotectedHeader({})
      .sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
    }),
  )
  await assert.doesNotReject(
    new FlattenedSign(context.payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setUnprotectedHeader({ foo: 'bar' })
      .sign(context.secret),
  )
  await assert.doesNotReject(
    new FlattenedSign(context.payload).setProtectedHeader({ alg: 'HS256' }).sign(context.secret),
  )
  await assert.doesNotReject(
    new FlattenedSign(context.payload)
      .setProtectedHeader({ foo: 'bar' })
      .setUnprotectedHeader({ alg: 'HS256' })
      .sign(context.secret),
  )
  await assert.doesNotReject(
    new FlattenedSign(context.payload).setUnprotectedHeader({ alg: 'HS256' }).sign(context.secret),
  )
})

test('FlattenedSign only uses serialized protected header parameters', async () => {
  const inherited = Object.create({ alg: 'HS256' })
  const nonEnumerable = Object.defineProperty({}, 'alg', { value: 'HS256' })
  for (const protectedHeader of [inherited, nonEnumerable]) {
    await assert.rejects(
      new FlattenedSign(context.payload).setProtectedHeader(protectedHeader).sign(context.secret),
      errorLike({
        code: 'ERR_JWS_INVALID',
        message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
      }),
    )
  }
})
