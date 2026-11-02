import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import { captureRejection, errorLike } from '../_errors.js'
import * as crypto from 'node:crypto'

import {
  CompactEncrypt,
  FlattenedEncrypt,
  EncryptJWT,
  compactDecrypt,
  decodeProtectedHeader,
} from '../../src/index.js'

const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
const keyObjectTest = typeof rsa.publicKey.toCryptoKey === 'function' ? test : test.skip

const context = {} as {
  plaintext: Uint8Array<ArrayBuffer>
  initializationVector: Uint8Array<ArrayBuffer>
  secret: Uint8Array<ArrayBuffer>
}

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.initializationVector = new Uint8Array(12)
  context.secret = new Uint8Array(16)
})

test('CompactEncrypt constructor validates plaintext', () => {
  assert.throws(
    () => new CompactEncrypt(null as never),
    (error) =>
      error instanceof TypeError && error.message === 'plaintext must be an instance of Uint8Array',
  )
})

test('CompactEncrypt', async () => {
  const jwe = await new CompactEncrypt(context.plaintext)
    .setInitializationVector(context.initializationVector)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)
  assert.deepStrictEqual(
    jwe,
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AAAAAAAAAAAAAAAA.Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M.Y5cdeOSFYNyxcPWQlrVFzw',
  )
})

test('JWE builders snapshot headers and critical extension options per operation', async () => {
  for (const builder of [
    new CompactEncrypt(context.plaintext),
    new FlattenedEncrypt(context.plaintext),
    new EncryptJWT(),
  ]) {
    const protectedHeader = {
      alg: 'dir',
      enc: 'A128GCM',
      crit: ['test'],
      test: 'first',
    }
    builder.setProtectedHeader(protectedHeader)
    const first = builder.encrypt(context.secret, { crit: { test: true } })
    protectedHeader.test = 'second'
    const second = builder.encrypt(context.secret, { crit: { test: true } })

    const headers = (await Promise.all([first, second])).map(decodeProtectedHeader)
    assert.strictEqual(headers[0].test, 'first')
    assert.strictEqual(headers[1].test, 'second')
    await assert.rejects(
      builder.encrypt(context.secret),
      errorLike({ code: 'ERR_JOSE_NOT_SUPPORTED' }),
    )
  }
})

test('CompactEncrypt.prototype.setProtectedHeader', () => {
  assert.throws(
    () => new CompactEncrypt(context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
    (error) =>
      error instanceof TypeError && error.message === 'setProtectedHeader can only be called once',
  )
})

test('CompactEncrypt.prototype.setKeyManagementParameters', () => {
  assert.throws(
    () =>
      new CompactEncrypt(context.plaintext)
        .setKeyManagementParameters({})
        .setKeyManagementParameters({}),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setKeyManagementParameters can only be called once',
  )
})

test('CompactEncrypt.prototype.setInitializationVector', () => {
  assert.throws(
    () =>
      new CompactEncrypt(context.plaintext)
        .setInitializationVector(context.initializationVector)
        .setInitializationVector(context.initializationVector),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setInitializationVector can only be called once',
  )
})

test('CompactEncrypt.prototype.setContentEncryptionKey', () => {
  assert.throws(
    () =>
      new CompactEncrypt(context.plaintext)
        .setContentEncryptionKey(context.secret)
        .setContentEncryptionKey(context.secret),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setContentEncryptionKey can only be called once',
  )
})

test('CompactEncrypt.prototype.encrypt must have a JOSE header', async () => {
  await assert.rejects(
    new CompactEncrypt(context.plaintext).encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
})

test('CompactEncrypt.prototype.encrypt validates the JOSE header before options', async () => {
  let reads = 0
  const options = {
    get crit() {
      reads++
      throw new Error('options read')
    },
  }

  await assert.rejects(
    new CompactEncrypt(context.plaintext).encrypt(context.secret, options),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
  assert.strictEqual(reads, 0)
})

test('CompactEncrypt.prototype.encrypt JOSE header have an alg', async () => {
  await assert.rejects(
    new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
    }),
  )
})

test('CompactEncrypt.prototype.encrypt JOSE header have an enc', async () => {
  await assert.rejects(
    new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
    }),
  )
})

keyObjectTest('ECDH-ES validates KeyObject compatibility', async () => {
  await assert.rejects(
    new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .encrypt(rsa.publicKey),
    (error) =>
      error instanceof TypeError &&
      'code' in error &&
      error.code === 'ERR_MISSING_OPTION' &&
      /'namedCurve' is required/.test(error.message),
  )

  const x25519 = crypto.generateKeyPairSync('x25519')
  const jwe = await new CompactEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
    .encrypt(x25519.publicKey)
  const { plaintext } = await compactDecrypt(jwe, x25519.privateKey)

  assert.deepStrictEqual(plaintext, context.plaintext)
})

keyObjectTest('KeyObject conversion errors do not trigger a JWK fallback', async () => {
  const sentinel = new RangeError('sentinel')
  const { publicKey } = crypto.generateKeyPairSync('x25519')
  Object.defineProperty(publicKey, 'toCryptoKey', {
    value() {
      throw sentinel
    },
  })

  const error = await captureRejection(
    new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .encrypt(publicKey),
  )

  assert.strictEqual(error, sentinel)
})
