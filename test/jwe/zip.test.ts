import test from 'ava'

import {
  FlattenedEncrypt,
  flattenedDecrypt,
  CompactEncrypt,
  compactDecrypt,
  GeneralEncrypt,
  generalDecrypt,
  EncryptJWT,
  jwtDecrypt,
  generateSecret,
} from '../../src/index.js'

const hasCompressionStreams = typeof globalThis.CompressionStream !== 'undefined'

const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

test.before(async (t) => {
  t.context.plaintext = encode("It's a dangerous business, Frodo, going out your door.")
  t.context.secret = await generateSecret('A128GCM')
})

if (hasCompressionStreams) {
  test('FlattenedEncrypt/flattenedDecrypt with zip: DEF', async (t) => {
    const jwe = await new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    const { plaintext } = await flattenedDecrypt(jwe, t.context.secret)
    t.deepEqual(plaintext, t.context.plaintext)
  })

  test('CompactEncrypt/compactDecrypt with zip: DEF', async (t) => {
    const jwe = await new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    const { plaintext } = await compactDecrypt(jwe, t.context.secret)
    t.deepEqual(plaintext, t.context.plaintext)
  })

  test('GeneralEncrypt/generalDecrypt with zip: DEF', async (t) => {
    const jwe = await new GeneralEncrypt(t.context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM', zip: 'DEF' })
      .addRecipient(t.context.secret)
      .setUnprotectedHeader({ alg: 'A128GCMKW' })
      .encrypt()

    const { plaintext } = await generalDecrypt(jwe, t.context.secret)
    t.deepEqual(plaintext, t.context.plaintext)
  })

  test('EncryptJWT/jwtDecrypt with zip: DEF', async (t) => {
    const jwt = await new EncryptJWT({ foo: 'bar' })
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    const { payload, protectedHeader } = await jwtDecrypt(jwt, t.context.secret)
    t.is(payload.foo, 'bar')
    t.is(protectedHeader.zip, 'DEF')
  })

  test('jwtDecrypt with zip: DEF and maxDecompressedLength option', async (t) => {
    const jwt = await new EncryptJWT({ foo: 'bar' })
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    // Should succeed with a generous limit
    await t.notThrowsAsync(jwtDecrypt(jwt, t.context.secret, { maxDecompressedLength: Infinity }))

    // Should succeed with a reasonable limit
    await t.notThrowsAsync(jwtDecrypt(jwt, t.context.secret, { maxDecompressedLength: 1024 }))
  })

  test('maxDecompressedLength: 0 disables zip support on decrypt', async (t) => {
    const jwe = await new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    await t.throwsAsync(compactDecrypt(jwe, t.context.secret, { maxDecompressedLength: 0 }), {
      message: 'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      code: 'ERR_JOSE_NOT_SUPPORTED',
    })
  })

  test('maxDecompressedLength: Infinity disables bomb protection', async (t) => {
    // Create a large plaintext
    const largePlaintext = new Uint8Array(300_000)
    const jwe = await new CompactEncrypt(largePlaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    // Default limit (250KB) should reject
    await t.throwsAsync(compactDecrypt(jwe, t.context.secret), {
      message: 'Decompressed plaintext exceeded the configured limit',
      code: 'ERR_JWE_INVALID',
    })

    // Infinity should allow
    const { plaintext } = await compactDecrypt(jwe, t.context.secret, {
      maxDecompressedLength: Infinity,
    })
    t.is(plaintext.byteLength, 300_000)
  })

  test('maxDecompressedLength enforcement', async (t) => {
    const plaintext = new Uint8Array(1024)
    const jwe = await new CompactEncrypt(plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    await t.throwsAsync(compactDecrypt(jwe, t.context.secret, { maxDecompressedLength: 512 }), {
      message: 'Decompressed plaintext exceeded the configured limit',
      code: 'ERR_JWE_INVALID',
    })

    await t.notThrowsAsync(compactDecrypt(jwe, t.context.secret, { maxDecompressedLength: 2048 }))
  })

  test('maxDecompressedLength must be 0, a positive safe integer, or Infinity', async (t) => {
    const jwe = await new CompactEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(t.context.secret)

    for (const value of [-1, 0.5, NaN, -Infinity]) {
      await t.throwsAsync(compactDecrypt(jwe, t.context.secret, { maxDecompressedLength: value }), {
        instanceOf: TypeError,
        message: 'maxDecompressedLength must be 0, a positive safe integer, or Infinity',
      })
    }
  })
}

test('unsupported zip value on encrypt throws JOSENotSupported', async (t) => {
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'gzip' })
      .encrypt(t.context.secret),
    {
      message: 'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
      code: 'ERR_JOSE_NOT_SUPPORTED',
    },
  )
})

test('zip must be in a protected header on encrypt', async (t) => {
  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ zip: 'DEF' })
      .encrypt(t.context.secret),
    {
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(t.context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setUnprotectedHeader({ zip: 'DEF' })
      .encrypt(t.context.secret),
    {
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    },
  )
})

test('zip must be in a protected header on encrypt (multi-recipient)', async (t) => {
  const secret1 = await generateSecret('A128KW')
  const secret2 = await generateSecret('A128KW')

  await t.throwsAsync(
    new GeneralEncrypt(t.context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ zip: 'DEF' })
      .addRecipient(secret1)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .addRecipient(secret2)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .encrypt(),
    {
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    },
  )

  await t.throwsAsync(
    new GeneralEncrypt(t.context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .addRecipient(secret1)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .addRecipient(secret2)
      .setUnprotectedHeader({ alg: 'A128KW', zip: 'DEF' })
      .encrypt(),
    {
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    },
  )
})

test('zip must be in a protected header on decrypt', async (t) => {
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(t.context.secret)

  // Tamper: put zip in unprotected header
  const tampered = { ...jwe, unprotected: { zip: 'DEF' } }
  await t.throwsAsync(flattenedDecrypt(tampered, t.context.secret), {
    message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    code: 'ERR_JWE_INVALID',
  })

  // Tamper: put zip in per-recipient header
  const tampered2 = { ...jwe, header: { zip: 'DEF' } }
  await t.throwsAsync(flattenedDecrypt(tampered2, t.context.secret), {
    message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    code: 'ERR_JWE_INVALID',
  })
})

test('unsupported zip value on decrypt throws JOSENotSupported', async (t) => {
  // Build a JWE without zip, then tamper the protected header to have zip: gzip
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(t.context.secret)

  // Replace protected header with one containing zip: gzip
  const tampered = {
    ...jwe,
    protected: btoa(JSON.stringify({ alg: 'dir', enc: 'A128GCM', zip: 'gzip' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''),
  }

  await t.throwsAsync(flattenedDecrypt(tampered, t.context.secret), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })
})

if (!hasCompressionStreams) {
  test('zip: DEF throws JOSENotSupported when CompressionStream is unavailable', async (t) => {
    await t.throwsAsync(
      new FlattenedEncrypt(t.context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
        .encrypt(t.context.secret),
      {
        code: 'ERR_JOSE_NOT_SUPPORTED',
      },
    )
  })
}
