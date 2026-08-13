import test from 'ava'

import {
  FlattenedEncrypt,
  flattenedDecrypt,
  decodeProtectedHeader,
  generateKeyPair,
} from '../../src/index.js'

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  t.context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  t.context.initializationVector = new Uint8Array(12)
  t.context.secret = new Uint8Array(16)
})

test('FlattenedEncrypt', async (t) => {
  {
    const jwe = await new FlattenedEncrypt(t.context.plaintext)
      .setInitializationVector(t.context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(t.context.secret)
    t.deepEqual(jwe, {
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
    const jwe = await new FlattenedEncrypt(t.context.plaintext)
      .setInitializationVector(t.context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setSharedUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(t.context.secret)
    t.deepEqual(jwe, {
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
    const jwe = await new FlattenedEncrypt(t.context.plaintext)
      .setInitializationVector(t.context.initializationVector)
      .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .encrypt(t.context.secret)
    t.deepEqual(jwe, {
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
    const jwe = await new FlattenedEncrypt(t.context.plaintext)
      .setInitializationVector(t.context.initializationVector)
      .setProtectedHeader({ alg: 'dir' })
      .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
      .setSharedUnprotectedHeader({ enc: 'A128GCM' })
      .encrypt(t.context.secret)
    t.deepEqual(jwe, {
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
      t.throws(() => new FlattenedEncrypt(value), {
        instanceOf: TypeError,
        message: 'plaintext must be an instance of Uint8Array',
      })
    }
  }
})

test('FlattenedEncrypt.prototype.setProtectedHeader', (t) => {
  t.throws(
    () => new FlattenedEncrypt(t.context.plaintext).setProtectedHeader({}).setProtectedHeader({}),
    {
      instanceOf: TypeError,
      message: 'setProtectedHeader can only be called once',
    },
  )
})

test('FlattenedEncrypt.prototype.setUnprotectedHeader', (t) => {
  t.throws(
    () =>
      new FlattenedEncrypt(t.context.plaintext).setUnprotectedHeader({}).setUnprotectedHeader({}),
    {
      instanceOf: TypeError,
      message: 'setUnprotectedHeader can only be called once',
    },
  )
})

test('FlattenedEncrypt.prototype.setSharedUnprotectedHeader', (t) => {
  t.throws(
    () =>
      new FlattenedEncrypt(t.context.plaintext)
        .setSharedUnprotectedHeader({})
        .setSharedUnprotectedHeader({}),
    {
      instanceOf: TypeError,
      message: 'setSharedUnprotectedHeader can only be called once',
    },
  )
})

test('FlattenedEncrypt.prototype.setInitializationVector', (t) => {
  t.throws(
    () =>
      new FlattenedEncrypt(t.context.plaintext)
        .setInitializationVector(t.context.initializationVector)
        .setInitializationVector(t.context.initializationVector),
    {
      instanceOf: TypeError,
      message: 'setInitializationVector can only be called once',
    },
  )
})

test('FlattenedEncrypt.prototype.setContentEncryptionKey', (t) => {
  t.throws(
    () =>
      new FlattenedEncrypt(t.context.plaintext)
        .setContentEncryptionKey(t.context.secret)
        .setContentEncryptionKey(t.context.secret),
    {
      instanceOf: TypeError,
      message: 'setContentEncryptionKey can only be called once',
    },
  )
})

test('FlattenedEncrypt.prototype.encrypt must have a JOSE header', async (t) => {
  await t.throwsAsync(new FlattenedEncrypt(t.context.plaintext).encrypt(t.context.secret), {
    code: 'ERR_JWE_INVALID',
    message:
      'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
  })
})

test('FlattenedEncrypt.prototype.encrypt JOSE header must be disjoint', async (t) => {
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setUnprotectedHeader({ alg: 'dir' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ alg: 'dir' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    },
  )
})

test('FlattenedEncrypt.prototype.encrypt generated Key Management Parameters must be disjoint', async (t) => {
  // The generated "p2s" and "p2c" join the JWE Protected Header, so a "p2c" the caller put in
  // another header would make the result violate RFC 7516 Section 7.2.1.
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ p2c: 4096 })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
      .setUnprotectedHeader({ tag: 'not-the-generated-one' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    },
  )
})

test('FlattenedEncrypt.prototype.encrypt JOSE header have an alg', async (t) => {
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter missing or invalid',
    },
  )
})

test('FlattenedEncrypt.prototype.encrypt JOSE header have an enc', async (t) => {
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir' })
      .encrypt(t.context.secret),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
    },
  )
})

test('Default PBES2 Count', async (t) => {
  t.is(
    decodeProtectedHeader(
      await new FlattenedEncrypt(t.context.plaintext)
        .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
        .encrypt(t.context.secret),
    ).p2c,
    2048,
  )
})

test('PBES2 p2c must be a positive integer on encrypt', async (t) => {
  for (const p2c of [0, -1, 1.5]) {
    await t.throwsAsync(
      new FlattenedEncrypt(t.context.plaintext)
        .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
        .setKeyManagementParameters({ p2c })
        .encrypt(t.context.secret),
      {
        code: 'ERR_JWE_INVALID',
        message: 'PBES2 Count Input must be a positive integer',
      },
    )
  }
})

test('non-extractable ephemeral keys use getPublicKey when available', async (t) => {
  const supportsGetPublicKey = typeof Reflect.get(crypto.subtle, 'getPublicKey') === 'function'

  for (const [crv, algorithm] of [
    ['P-256', { name: 'ECDH', namedCurve: 'P-256' }],
    ['X25519', { name: 'X25519' }],
  ] as const) {
    const recipient = await generateKeyPair('ECDH-ES', { crv })
    const ephemeralKey = (
      (await crypto.subtle.generateKey(algorithm, false, ['deriveBits'])) as CryptoKeyPair
    ).privateKey
    const encryption = new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .setKeyManagementParameters({ epk: ephemeralKey })
      .encrypt(recipient.publicKey)

    if (!supportsGetPublicKey) {
      await t.throwsAsync(encryption, {
        instanceOf: TypeError,
        message: 'CryptoKey for "epk" must be extractable',
      })
      continue
    }

    const jwe = await encryption
    const { plaintext } = await flattenedDecrypt(jwe, recipient.privateKey)
    const { epk } = decodeProtectedHeader(jwe)

    t.deepEqual(plaintext, t.context.plaintext)
    t.is(epk?.crv, crv)
    t.false('d' in epk!)
  }
})

test.serial('a non-extractable epk has an epk-specific fallback error', async (t) => {
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

    await t.throwsAsync(
      new FlattenedEncrypt(t.context.plaintext)
        .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
        .setKeyManagementParameters({ epk: ephemeralKey })
        .encrypt(publicKey),
      {
        instanceOf: TypeError,
        message: 'CryptoKey for "epk" must be extractable',
      },
    )
  } finally {
    if (ownDescriptor) {
      Object.defineProperty(crypto.subtle, 'getPublicKey', ownDescriptor)
    } else {
      Reflect.deleteProperty(crypto.subtle, 'getPublicKey')
    }
  }
})

test('a zero-length additional authenticated data round trips', async (t) => {
  const cek = new Uint8Array(32)
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(new Uint8Array())
    .encrypt(cek)

  t.false(Object.hasOwn(jwe, 'aad'))

  const { plaintext } = await flattenedDecrypt(jwe, cek)
  t.deepEqual(plaintext, t.context.plaintext)
})

test('a non-empty additional authenticated data is still carried', async (t) => {
  const cek = new Uint8Array(32)
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(new Uint8Array([1, 2, 3]))
    .encrypt(cek)

  t.is(jwe.aad, 'AQID')

  const { plaintext, additionalAuthenticatedData } = await flattenedDecrypt(jwe, cek)
  t.deepEqual(plaintext, t.context.plaintext)
  t.deepEqual(additionalAuthenticatedData, new Uint8Array([1, 2, 3]))
})
