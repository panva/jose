import test from 'ava'
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

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  t.context.initializationVector = new Uint8Array(12)
  t.context.secret = new Uint8Array(16)
})

test('CompactEncrypt constructor validates plaintext', (t) => {
  t.throws(() => new CompactEncrypt(null as never), {
    instanceOf: TypeError,
    message: 'plaintext must be an instance of Uint8Array',
  })
})

test('CompactEncrypt', async (t) => {
  const jwe = await new CompactEncrypt(t.context.plaintext)
    .setInitializationVector(t.context.initializationVector)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(t.context.secret)
  t.deepEqual(
    jwe,
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AAAAAAAAAAAAAAAA.Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M.Y5cdeOSFYNyxcPWQlrVFzw',
  )
})

test('JWE builders snapshot headers and critical extension options per operation', async (t) => {
  for (const builder of [
    new CompactEncrypt(t.context.plaintext),
    new FlattenedEncrypt(t.context.plaintext),
    new EncryptJWT(),
  ]) {
    const protectedHeader = {
      alg: 'dir',
      enc: 'A128GCM',
      crit: ['test'],
      test: 'first',
    }
    builder.setProtectedHeader(protectedHeader)
    const first = builder.encrypt(t.context.secret, { crit: { test: true } })
    protectedHeader.test = 'second'
    const second = builder.encrypt(t.context.secret, { crit: { test: true } })

    const headers = (await Promise.all([first, second])).map(decodeProtectedHeader)
    t.is(headers[0].test, 'first')
    t.is(headers[1].test, 'second')
    await t.throwsAsync(builder.encrypt(t.context.secret), { code: 'ERR_JOSE_NOT_SUPPORTED' })
  }
})

test('CompactEncrypt.prototype.setProtectedHeader', (t) => {
  t.throws(
    () => new CompactEncrypt(t.context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
    {
      instanceOf: TypeError,
      message: 'setProtectedHeader can only be called once',
    },
  )
})

test('CompactEncrypt.prototype.setKeyManagementParameters', (t) => {
  t.throws(
    () =>
      new CompactEncrypt(t.context.plaintext)
        .setKeyManagementParameters({})
        .setKeyManagementParameters({}),
    {
      instanceOf: TypeError,
      message: 'setKeyManagementParameters can only be called once',
    },
  )
})

test('CompactEncrypt.prototype.setInitializationVector', (t) => {
  t.throws(
    () =>
      new CompactEncrypt(t.context.plaintext)
        .setInitializationVector(t.context.initializationVector)
        .setInitializationVector(t.context.initializationVector),
    {
      instanceOf: TypeError,
      message: 'setInitializationVector can only be called once',
    },
  )
})

test('CompactEncrypt.prototype.setContentEncryptionKey', (t) => {
  t.throws(
    () =>
      new CompactEncrypt(t.context.plaintext)
        .setContentEncryptionKey(t.context.secret)
        .setContentEncryptionKey(t.context.secret),
    {
      instanceOf: TypeError,
      message: 'setContentEncryptionKey can only be called once',
    },
  )
})

test('CompactEncrypt.prototype.encrypt must have a JOSE header', async (t) => {
  await t.throwsAsync(new CompactEncrypt(t.context.plaintext).encrypt(t.context.secret), {
    code: 'ERR_JWE_INVALID',
    message:
      'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
  })
})

test('CompactEncrypt.prototype.encrypt validates the JOSE header before options', async (t) => {
  let reads = 0
  const options = {
    get crit() {
      reads++
      throw new Error('options read')
    },
  }

  await t.throwsAsync(new CompactEncrypt(t.context.plaintext).encrypt(t.context.secret, options), {
    code: 'ERR_JWE_INVALID',
    message:
      'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
  })
  t.is(reads, 0)
})

test('CompactEncrypt.prototype.encrypt JOSE header have an alg', async (t) => {
  await t.throwsAsync(
    new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
    },
  )
})

test('CompactEncrypt.prototype.encrypt JOSE header have an enc', async (t) => {
  await t.throwsAsync(
    new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
    },
  )
})

keyObjectTest('ECDH-ES validates KeyObject compatibility', async (t) => {
  await t.throwsAsync(
    new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .encrypt(rsa.publicKey),
    {
      instanceOf: TypeError,
      code: 'ERR_MISSING_OPTION',
      message: /'namedCurve' is required/,
    },
  )

  const x25519 = crypto.generateKeyPairSync('x25519')
  const jwe = await new CompactEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
    .encrypt(x25519.publicKey)
  const { plaintext } = await compactDecrypt(jwe, x25519.privateKey)

  t.deepEqual(plaintext, t.context.plaintext)
})

keyObjectTest('KeyObject conversion errors do not trigger a JWK fallback', async (t) => {
  const sentinel = new RangeError('sentinel')
  const { publicKey } = crypto.generateKeyPairSync('x25519')
  Object.defineProperty(publicKey, 'toCryptoKey', {
    value() {
      throw sentinel
    },
  })

  const error = await t.throwsAsync(
    new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .encrypt(publicKey),
  )

  t.is(error, sentinel)
})
