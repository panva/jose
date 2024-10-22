import test from 'ava'
import * as crypto from 'crypto'

import { FlattenedSign, flattenedVerify } from '../../src/index.js'

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  t.context.secret = crypto.randomFillSync(new Uint8Array(32))
})

test('JWS format validation', async (t) => {
  const fullJws = await new FlattenedSign(t.context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)

  {
    await t.throwsAsync(flattenedVerify(null, t.context.secret), {
      message: 'Flattened JWS must be an object',
      code: 'ERR_JWS_INVALID',
    })
  }

  {
    const jws = { ...fullJws }
    jws.protected = undefined
    jws.header = undefined

    await t.throwsAsync(flattenedVerify(jws, t.context.secret), {
      message: 'Flattened JWS must have either of the "protected" or "header" members',
      code: 'ERR_JWS_INVALID',
    })
  }

  {
    await t.notThrowsAsync(async () => {
      await flattenedVerify(
        await new FlattenedSign(new Uint8Array())
          .setProtectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
        t.context.secret,
      )
    })
  }

  {
    const jws = { ...fullJws }
    jws.signature = undefined
    const assertion = {
      message: 'JWS Signature missing or incorrect type',
      code: 'ERR_JWS_INVALID',
    }

    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
    jws.signature = null

    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Protected Header incorrect type',
      code: 'ERR_JWS_INVALID',
    }
    jws.protected = null
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Unprotected Header incorrect type',
      code: 'ERR_JWS_INVALID',
    }
    jws.header = null
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Protected Header is invalid',
      code: 'ERR_JWS_INVALID',
    }
    jws.protected = `1${jws.protected}`
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Payload missing',
      code: 'ERR_JWS_INVALID',
    }
    jws.payload = undefined
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    jws.header = { alg: 'HS256', bar: 'bar' }
    const assertion = {
      message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      code: 'ERR_JWS_INVALID',
    }
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    jws.header = undefined
    const assertion = {
      message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
      code: 'ERR_JWS_INVALID',
    }
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    jws.payload = null
    const assertion = {
      message: 'JWS Payload must be a string',
      code: 'ERR_JWS_INVALID',
    }
    await t.throwsAsync(flattenedVerify(jws, t.context.secret), assertion)
  }

  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'signature verification failed',
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }
    await t.throwsAsync(flattenedVerify(jws, crypto.randomFillSync(new Uint8Array(32))), assertion)
  }
})

test('sign empty data', async (t) => {
  const jws = await new FlattenedSign(new Uint8Array(0))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))

  t.is(jws.payload, '')

  const { payload } = await flattenedVerify(jws, new Uint8Array(32))
  t.is(payload.byteLength, 0)
})
