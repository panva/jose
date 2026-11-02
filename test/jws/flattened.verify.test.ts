import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import * as crypto from 'crypto'
import { FlattenedSign, base64url, flattenedVerify } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as { plaintext: Uint8Array; secret: Uint8Array }

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.secret = crypto.randomFillSync(new Uint8Array(32))
})

test('JWS format validation', async () => {
  const fullJws = await new FlattenedSign(context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  {
    await assert.rejects(
      flattenedVerify(null, context.secret),
      errorLike({
        message: 'Flattened JWS must be an object',
        code: 'ERR_JWS_INVALID',
      }),
    )
  }
  {
    const jws = { ...fullJws }
    jws.protected = undefined
    jws.header = undefined
    await assert.rejects(
      flattenedVerify(jws, context.secret),
      errorLike({
        message: 'Flattened JWS must have either of the "protected" or "header" members',
        code: 'ERR_JWS_INVALID',
      }),
    )
  }
  {
    await assert.doesNotReject(async () => {
      await flattenedVerify(
        await new FlattenedSign(new Uint8Array())
          .setProtectedHeader({ alg: 'HS256' })
          .sign(context.secret),
        context.secret,
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
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
    jws.signature = null
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Protected Header incorrect type',
      code: 'ERR_JWS_INVALID',
    }
    jws.protected = null
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Unprotected Header incorrect type',
      code: 'ERR_JWS_INVALID',
    }
    jws.header = null
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Protected Header is invalid',
      code: 'ERR_JWS_INVALID',
    }
    jws.protected = `1${jws.protected}`
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
    // RFC 7515 Section 4 - the Protected Header must be a JSON object. Without this a JSON
    // string, number, null or array was accepted and returned as the protectedHeader.
    for (const json of ['"foo"', '123', 'null', '[]']) {
      await assert.rejects(
        flattenedVerify({ ...jws, protected: base64url.encode(json) }, context.secret),
        errorLike(assertion),
      )
    }
  }
  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'JWS Payload missing',
      code: 'ERR_JWS_INVALID',
    }
    jws.payload = undefined
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    jws.header = { alg: 'HS256', bar: 'bar' }
    const assertion = {
      message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      code: 'ERR_JWS_INVALID',
    }
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    jws.header = undefined
    const assertion = {
      message: 'JWS "alg" (Algorithm) Header Parameter missing or invalid',
      code: 'ERR_JWS_INVALID',
    }
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    jws.payload = null
    const assertion = {
      message: 'JWS Payload must be a string',
      code: 'ERR_JWS_INVALID',
    }
    await assert.rejects(flattenedVerify(jws, context.secret), errorLike(assertion))
  }
  {
    const jws = { ...fullJws }
    const assertion = {
      message: 'signature verification failed',
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }
    await assert.rejects(
      flattenedVerify(jws, crypto.randomFillSync(new Uint8Array(32))),
      errorLike(assertion),
    )
  }
})

test('Flattened JWS members are read once', async () => {
  const fullJws = await new FlattenedSign(context.plaintext)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(context.secret)
  let signatureReads = 0
  const switching = Object.defineProperty({ ...fullJws }, 'signature', {
    enumerable: true,
    get() {
      signatureReads++
      if (signatureReads > 1) throw new Error('signature was read twice')
      return fullJws.signature
    },
  })
  await assert.doesNotReject(flattenedVerify(switching, context.secret))
  assert.equal(signatureReads, 1)
})

test('sign empty data', async () => {
  const jws = await new FlattenedSign(new Uint8Array(0))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))
  assert.equal(jws.payload, '')
  const { payload } = await flattenedVerify(jws, new Uint8Array(32))
  assert.equal(payload.byteLength, 0)
})

test('a non-ASCII payload is a JWSInvalid', async () => {
  // The payload segment is used to rebuild the signing input before it is base64url decoded.
  const jws = await new FlattenedSign(new TextEncoder().encode('foo'))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))
  await assert.rejects(
    flattenedVerify({ ...jws, payload: '€' }, new Uint8Array(32)),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'The payload is not a valid base64url string',
    }),
  )
  // A well-formed but wrong payload still fails as a signature verification failure.
  await assert.rejects(
    flattenedVerify({ ...jws, payload: 'YmFy' }, new Uint8Array(32)),
    errorLike({
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    }),
  )
})

test('an empty protected member is not an encoded protected header', async () => {
  const jws = await new FlattenedSign(new TextEncoder().encode('foo'))
    .setUnprotectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))
  await assert.rejects(
    flattenedVerify({ ...jws, protected: '' }, new Uint8Array(32)),
    errorLike({
      code: 'ERR_JWS_INVALID',
    }),
  )
})
