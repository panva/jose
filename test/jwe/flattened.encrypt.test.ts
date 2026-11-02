import test, { before } from 'node:test'
import assert from 'node:assert/strict'

import {
  FlattenedEncrypt,
  base64url,
  flattenedDecrypt,
  decodeProtectedHeader,
  generateKeyPair,
} from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as {
  plaintext: Uint8Array<ArrayBuffer>
  additionalAuthenticatedData: Uint8Array<ArrayBuffer>
  initializationVector: Uint8Array<ArrayBuffer>
  secret: Uint8Array<ArrayBuffer>
}

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  context.initializationVector = new Uint8Array(12)
  context.secret = new Uint8Array(16)
})

test('FlattenedEncrypt', async () => {
  {
    const jwe = await new FlattenedEncrypt(context.plaintext)
      .setInitializationVector(context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(context.secret)
    assert.deepStrictEqual(jwe, {
      ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
      header: {
        enc: 'A128GCM',
      },
      iv: 'AAAAAAAAAAAAAAAA',
      protected: 'eyJhbGciOiJkaXIifQ',
      tag: 'OYBq53cJNorm8LoZf4SwsA',
    })
  }
  {
    const jwe = await new FlattenedEncrypt(context.plaintext)
      .setInitializationVector(context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setSharedUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(context.secret)
    assert.deepStrictEqual(jwe, {
      ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
      unprotected: {
        enc: 'A128GCM',
      },
      iv: 'AAAAAAAAAAAAAAAA',
      protected: 'eyJhbGciOiJkaXIifQ',
      tag: 'OYBq53cJNorm8LoZf4SwsA',
    })
  }
  {
    const jwe = await new FlattenedEncrypt(context.plaintext)
      .setInitializationVector(context.initializationVector)
      .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .encrypt(context.secret)
    assert.deepStrictEqual(jwe, {
      ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
      unprotected: {
        alg: 'dir',
        enc: 'A128GCM',
      },
      iv: 'AAAAAAAAAAAAAAAA',
      tag: 'vrBCoJmYwG3M6xCZ5VSR3g',
    })
  }
  {
    const jwe = await new FlattenedEncrypt(context.plaintext)
      .setInitializationVector(context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
      .setSharedUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(context.secret)
    assert.deepStrictEqual(jwe, {
      aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
      ciphertext: 'Svw4TvnFg_PTTKPXFteMF4Lmisk8ODBNko7607TNs49EbT0BKRz9tEep2dmks9KPvD-CfX7hW1M',
      unprotected: {
        enc: 'A128GCM',
      },
      iv: 'AAAAAAAAAAAAAAAA',
      protected: 'eyJhbGciOiJkaXIifQ',
      tag: 'gEwNlfPZ-O-dG7dTFkhMyQ',
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
      new FlattenedEncrypt(new Uint8Array()),
    ]) {
      assert.throws(
        () => new FlattenedEncrypt(value),
        (error) =>
          error instanceof TypeError &&
          error.message === 'plaintext must be an instance of Uint8Array',
      )
    }
  }
})

test('FlattenedEncrypt.prototype.setProtectedHeader', () => {
  assert.throws(
    () => new FlattenedEncrypt(context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
    (error) =>
      error instanceof TypeError && error.message === 'setProtectedHeader can only be called once',
  )
})

test('FlattenedEncrypt.prototype.setUnprotectedHeader', () => {
  assert.throws(
    () => new FlattenedEncrypt(context.plaintext).setUnprotectedHeader({}).setUnprotectedHeader({}),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setUnprotectedHeader can only be called once',
  )
})

test('FlattenedEncrypt.prototype.setSharedUnprotectedHeader', () => {
  assert.throws(
    () =>
      new FlattenedEncrypt(context.plaintext)
        .setSharedUnprotectedHeader({})
        .setSharedUnprotectedHeader({}),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setSharedUnprotectedHeader can only be called once',
  )
})

test('FlattenedEncrypt JOSE header values must be objects', async () => {
  for (const value of [null, 'not an object', [], new Date(0), 42, false]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader(value as never)
        .setUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .encrypt(context.secret),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )

    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .setSharedUnprotectedHeader(value as never)
        .encrypt(context.secret),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )

    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .setUnprotectedHeader(value as never)
        .encrypt(context.secret),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )
  }
})

test('FlattenedEncrypt key management parameters must be an object', async () => {
  for (const value of [null, 'not an object', [], new Date(0), 42, false]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
        .setKeyManagementParameters(value as never)
        .encrypt(context.secret),
      TypeError,
    )
  }
})

test('critical JWE extension values must survive JSON serialization', async () => {
  for (const foo of [() => true, Symbol('foo')]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', crit: ['foo'], foo })
        .encrypt(context.secret, { crit: { foo: true } }),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )

    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ enc: 'A128GCM', crit: ['foo'] })
        .setUnprotectedHeader({ alg: 'dir', foo })
        .encrypt(context.secret, { crit: { foo: false } }),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )
  }

  await assert.doesNotReject(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM', crit: ['foo'] })
      .setUnprotectedHeader({ alg: 'dir', foo: true })
      .encrypt(context.secret, { crit: { foo: false } }),
  )

  let critReads = 0
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A128GCM',
      get crit() {
        critReads++
        return critReads === 1 ? ['foo'] : ['foo', 'foo']
      },
      foo: true,
    })
    .encrypt(context.secret, { crit: { foo: true } })

  assert.strictEqual(critReads, 1)
  assert.deepStrictEqual(decodeProtectedHeader(jwe).crit, ['foo'])
})

test('FlattenedEncrypt only uses serialized protected header parameters', async () => {
  const inherited = Object.create({ alg: 'dir', enc: 'A128GCM' })
  const nonEnumerable = Object.defineProperties(
    {},
    {
      alg: { value: 'dir' },
      enc: { value: 'A128GCM' },
    },
  )

  for (const protectedHeader of [inherited, nonEnumerable]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader(protectedHeader)
        .encrypt(context.secret),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
      }),
    )
  }
})

test('FlattenedEncrypt.prototype.setInitializationVector', () => {
  assert.throws(
    () =>
      new FlattenedEncrypt(context.plaintext)
        .setInitializationVector(context.initializationVector)
        .setInitializationVector(context.initializationVector),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setInitializationVector can only be called once',
  )
})

test('FlattenedEncrypt.prototype.setContentEncryptionKey', () => {
  assert.throws(
    () =>
      new FlattenedEncrypt(context.plaintext)
        .setContentEncryptionKey(context.secret)
        .setContentEncryptionKey(context.secret),
    (error) =>
      error instanceof TypeError &&
      error.message === 'setContentEncryptionKey can only be called once',
  )
})

test('FlattenedEncrypt.prototype.encrypt must have a JOSE header', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext).encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
})

test('FlattenedEncrypt.prototype.encrypt JOSE header must be disjoint', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setUnprotectedHeader({ alg: 'dir' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    }),
  )
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ alg: 'dir' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    }),
  )
})

test('FlattenedEncrypt.prototype.encrypt generated Key Management Parameters must be disjoint', async () => {
  // The generated "p2s" and "p2c" join the JWE Protected Header, so a "p2c" the caller put in
  // another header would make the result violate RFC 7516 Section 7.2.1.
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ p2c: 4096 })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    }),
  )
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
      .setUnprotectedHeader({ tag: 'not-the-generated-one' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    }),
  )
})

test('FlattenedEncrypt.prototype.encrypt JOSE header have an alg', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
    }),
  )
})

test('FlattenedEncrypt.prototype.encrypt JOSE header have an enc', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir' })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
    }),
  )
})

test('Default PBES2 Count', async () => {
  assert.strictEqual(
    decodeProtectedHeader(
      await new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
        .encrypt(context.secret),
    ).p2c,
    2048,
  )
})

test('PBES2 p2c must be a positive integer on encrypt', async () => {
  for (const p2c of [0, -1, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
        .setKeyManagementParameters({ p2c })
        .encrypt(context.secret),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'PBES2 Count Input must be a positive integer',
      }),
    )
  }
})

test('PBES2 p2s must contain at least 8 octets', async () => {
  for (const p2s of [new Uint8Array(7), null, false, 0, '']) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
        .setKeyManagementParameters({ p2c: 1, p2s: p2s as never })
        .encrypt(context.secret),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'PBES2 Salt Input must be 8 or more octets',
      }),
    )
  }
})

test('ECDH apu and apv must be Uint8Array instances', async () => {
  const { publicKey } = await generateKeyPair('ECDH-ES')

  for (const parameter of ['apu', 'apv'] as const) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
        .setKeyManagementParameters({ [parameter]: 'abc' as never })
        .encrypt(publicKey),
      TypeError,
    )
  }
})

test('ECDH apu and apv must be distinct', async () => {
  const { publicKey } = await generateKeyPair('ECDH-ES')
  const partyInfo = new Uint8Array()

  for (const alg of ['ECDH-ES', 'ECDH-ES+A128KW'] as const) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg, enc: 'A128GCM' })
        .setKeyManagementParameters({ apu: partyInfo, apv: partyInfo })
        .encrypt(publicKey),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'JOSE Header "apu" and "apv" values must be distinct',
      }),
    )
  }
})

test('ECDH processes apu and apv supplied as JOSE Header Parameters', async () => {
  const { privateKey, publicKey } = await generateKeyPair('ECDH-ES')
  const apu = base64url.encode(Uint8Array.of(1))
  const apv = base64url.encode(Uint8Array.of(2))

  for (const alg of ['ECDH-ES', 'ECDH-ES+A128KW'] as const) {
    for (const protectedParameters of [true, false]) {
      const encryption = new FlattenedEncrypt(context.plaintext).setProtectedHeader(
        protectedParameters ? { alg, enc: 'A128GCM', apu, apv } : { alg, enc: 'A128GCM' },
      )
      if (!protectedParameters) encryption.setUnprotectedHeader({ apu, apv })
      const jwe = await encryption.encrypt(publicKey)
      const result = await flattenedDecrypt(jwe, privateKey)
      assert.deepStrictEqual(result.plaintext, context.plaintext)
    }
  }
})

test('AES-GCMKW iv must not ignore invalid falsy values', async () => {
  for (const iv of [null, false, 0, '']) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
        .setKeyManagementParameters({ iv: iv as never })
        .encrypt(context.secret),
      (error) =>
        error instanceof TypeError && error.message === '"iv" must be an instance of Uint8Array',
    )
  }
})

test('ECDH and AES-GCMKW generate fresh per-operation values', async () => {
  const { publicKey } = await generateKeyPair('ECDH-ES')
  const ecdh = await Promise.all(
    [0, 1].map(() =>
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
        .encrypt(publicKey),
    ),
  )
  const [firstEpk, secondEpk] = ecdh.map(
    (jwe) => decodeProtectedHeader(jwe).epk as Record<string, unknown>,
  )
  assert.notDeepStrictEqual(firstEpk, secondEpk)

  const gcmkw = await Promise.all(
    [0, 1].map(() =>
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
        .encrypt(context.secret),
    ),
  )
  assert.notStrictEqual(decodeProtectedHeader(gcmkw[0]).iv, decodeProtectedHeader(gcmkw[1]).iv)
})

test('ECDH epk must not ignore invalid falsy values', async () => {
  const { publicKey } = await generateKeyPair('ECDH-ES')

  for (const epk of [null, false, 0, '']) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
        .setKeyManagementParameters({ epk: epk as never })
        .encrypt(publicKey),
      TypeError,
    )
  }
})

test('non-extractable ephemeral keys use getPublicKey when available', async () => {
  const supportsGetPublicKey = typeof Reflect.get(crypto.subtle, 'getPublicKey') === 'function'

  for (const [crv, algorithm] of [
    ['P-256', { name: 'ECDH', namedCurve: 'P-256' }],
    ['X25519', { name: 'X25519' }],
  ] as const) {
    const recipient = await generateKeyPair('ECDH-ES', { crv })
    const ephemeralKey = (
      (await crypto.subtle.generateKey(algorithm, false, ['deriveBits'])) as CryptoKeyPair
    ).privateKey
    const encryption = new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .setKeyManagementParameters({ epk: ephemeralKey })
      .encrypt(recipient.publicKey)

    if (!supportsGetPublicKey) {
      await assert.rejects(
        encryption,
        (error) =>
          error instanceof TypeError && error.message === 'CryptoKey for "epk" must be extractable',
      )
      continue
    }

    const jwe = await encryption
    const { plaintext } = await flattenedDecrypt(jwe, recipient.privateKey)
    const { epk } = decodeProtectedHeader(jwe)

    assert.deepStrictEqual(plaintext, context.plaintext)
    assert.strictEqual(epk?.crv, crv)
    assert.strictEqual('d' in epk!, false)
  }
})

test('a non-extractable epk has an epk-specific fallback error', async () => {
  const ownDescriptor = Object.getOwnPropertyDescriptor(crypto.subtle, 'getPublicKey')
  Object.defineProperty(crypto.subtle, 'getPublicKey', {
    configurable: true,
    value: undefined,
  })

  try {
    const { publicKey } = await generateKeyPair('ECDH-ES')
    const ephemeralKey = (
      await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])
    ).privateKey

    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
        .setKeyManagementParameters({ epk: ephemeralKey })
        .encrypt(publicKey),
      (error) =>
        error instanceof TypeError && error.message === 'CryptoKey for "epk" must be extractable',
    )
  } finally {
    if (ownDescriptor) {
      Object.defineProperty(crypto.subtle, 'getPublicKey', ownDescriptor)
    } else {
      Reflect.deleteProperty(crypto.subtle, 'getPublicKey')
    }
  }
})

test('a zero-length additional authenticated data round trips', async () => {
  const cek = new Uint8Array(32)
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(new Uint8Array())
    .encrypt(cek)

  assert.strictEqual(Object.hasOwn(jwe, 'aad'), false)

  const { plaintext } = await flattenedDecrypt(jwe, cek)
  assert.deepStrictEqual(plaintext, context.plaintext)
})

test('additional authenticated data must be a Uint8Array', async () => {
  for (const aad of ['secret aad', [1, 2, 3], new ArrayBuffer(3)]) {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setAdditionalAuthenticatedData(aad as never)
        .encrypt(new Uint8Array(32)),
      TypeError,
    )
  }
})

test('a non-empty additional authenticated data is still carried', async () => {
  const cek = new Uint8Array(32)
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(new Uint8Array([1, 2, 3]))
    .encrypt(cek)

  assert.strictEqual(jwe.aad, 'AQID')

  const { plaintext, additionalAuthenticatedData } = await flattenedDecrypt(jwe, cek)
  assert.deepStrictEqual(plaintext, context.plaintext)
  assert.deepStrictEqual(additionalAuthenticatedData, new Uint8Array([1, 2, 3]))
})
