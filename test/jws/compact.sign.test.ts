import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import { CompactSign } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { payload: Uint8Array; secret: Uint8Array }

before(() => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.payload = encode('It’s a dangerous business, Frodo, going out your door.')
  context.secret = new Uint8Array(32)
})

test('CompactSign', async () => {
  const jws = await new CompactSign(context.payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  assert.equal(
    jws,
    'eyJhbGciOiJIUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.UKohvCM6JaKEJlDt7ApBPgcQMW4lmp-UGXfwPmCfUaA',
  )
})

test('CompactSign.prototype.setProtectedHeader', () => {
  assert.throws(
    () => new CompactSign(context.payload).setProtectedHeader({}).setProtectedHeader({}),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setProtectedHeader can only be called once')
      return true
    },
  )
})

test('CompactSign.prototype.sign must have a JOSE header', async () => {
  await assert.rejects(
    new CompactSign(context.payload).sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    }),
  )
})

test('CompactSign.prototype.sign JOSE header have an alg', async () => {
  await assert.rejects(
    new CompactSign(context.payload).setProtectedHeader({}).sign(context.secret),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
    }),
  )
})

test('CompactSign rejects unencoded payloads before validating alg', async () => {
  await assert.rejects(
    new CompactSign(context.payload)
      .setProtectedHeader({ b64: false, crit: ['b64'] })
      .sign(context.secret),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'use the flattened module for creating JWS with b64: false')
      return true
    },
  )
})

test('CompactSign reads crit options before requiring a header', async () => {
  const marker = new Error('crit option read')
  await assert.rejects(
    new CompactSign(context.payload).sign(context.secret, {
      get crit(): never {
        throw marker
      },
    }),
    (error) => error === marker,
  )
})
