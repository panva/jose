import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'

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
import { errorLike } from '../_errors.js'

const hasCompressionStreams = typeof globalThis.CompressionStream !== 'undefined'

const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

const context = {} as {
  plaintext: Uint8Array<ArrayBuffer>
  secret: Awaited<ReturnType<typeof generateSecret>>
}

before(async () => {
  context.plaintext = encode("It's a dangerous business, Frodo, going out your door.")
  context.secret = await generateSecret('A128GCM')
})

if (hasCompressionStreams) {
  test('FlattenedEncrypt/flattenedDecrypt with zip: DEF', async () => {
    const jwe = await new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    const { plaintext } = await flattenedDecrypt(jwe, context.secret)
    assert.deepStrictEqual(plaintext, context.plaintext)
  })

  test('CompactEncrypt/compactDecrypt with zip: DEF', async () => {
    const jwe = await new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    const { plaintext } = await compactDecrypt(jwe, context.secret)
    assert.deepStrictEqual(plaintext, context.plaintext)
  })

  test('GeneralEncrypt/generalDecrypt with zip: DEF', async () => {
    const jwe = await new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM', zip: 'DEF' })
      .addRecipient(context.secret)
      .setUnprotectedHeader({ alg: 'A128GCMKW' })
      .encrypt()

    const { plaintext } = await generalDecrypt(jwe, context.secret)
    assert.deepStrictEqual(plaintext, context.plaintext)

    for (const maxDecompressedLength of [0, context.plaintext.byteLength - 1]) {
      await assert.rejects(
        generalDecrypt(jwe, context.secret, { maxDecompressedLength }),
        errorLike({ code: 'ERR_JWE_DECRYPTION_FAILED' }),
      )
    }
  })

  test('EncryptJWT/jwtDecrypt with zip: DEF', async () => {
    const jwt = await new EncryptJWT({ foo: 'bar' })
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    const { payload, protectedHeader } = await jwtDecrypt(jwt, context.secret)
    assert.strictEqual(payload.foo, 'bar')
    assert.strictEqual(protectedHeader.zip, 'DEF')
  })

  test('jwtDecrypt with zip: DEF and maxDecompressedLength option', async () => {
    const jwt = await new EncryptJWT({ foo: 'bar' })
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    // Should succeed with a generous limit
    await assert.doesNotReject(jwtDecrypt(jwt, context.secret, { maxDecompressedLength: Infinity }))

    // Should succeed with a reasonable limit
    await assert.doesNotReject(jwtDecrypt(jwt, context.secret, { maxDecompressedLength: 1024 }))
  })

  test('maxDecompressedLength: 0 disables zip support on decrypt', async () => {
    const jwe = await new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    await assert.rejects(
      compactDecrypt(jwe, context.secret, { maxDecompressedLength: 0 }),
      errorLike({
        message: 'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
        code: 'ERR_JOSE_NOT_SUPPORTED',
      }),
    )
  })

  test('maxDecompressedLength: Infinity disables bomb protection', async () => {
    // Create a large plaintext
    const largePlaintext = new Uint8Array(300_000)
    const jwe = await new CompactEncrypt(largePlaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    // Default limit (250KB) should reject
    await assert.rejects(
      compactDecrypt(jwe, context.secret),
      errorLike({
        message: 'Decompressed plaintext exceeded the configured limit',
        code: 'ERR_JWE_INVALID',
      }),
    )

    // Infinity should allow
    const { plaintext } = await compactDecrypt(jwe, context.secret, {
      maxDecompressedLength: Infinity,
    })
    assert.strictEqual(plaintext.byteLength, 300_000)
  })

  test('maxDecompressedLength enforcement', async () => {
    const plaintext = new Uint8Array(1024)
    const jwe = await new CompactEncrypt(plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    await assert.rejects(
      compactDecrypt(jwe, context.secret, { maxDecompressedLength: 512 }),
      errorLike({
        message: 'Decompressed plaintext exceeded the configured limit',
        code: 'ERR_JWE_INVALID',
      }),
    )

    await assert.doesNotReject(compactDecrypt(jwe, context.secret, { maxDecompressedLength: 2048 }))
  })

  test('maxDecompressedLength must be 0, a positive safe integer, or Infinity', async () => {
    const jwe = await new CompactEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
      .encrypt(context.secret)

    for (const value of [-1, 0.5, NaN, -Infinity]) {
      await assert.rejects(
        compactDecrypt(jwe, context.secret, { maxDecompressedLength: value }),
        (error) =>
          error instanceof TypeError &&
          error.message === 'maxDecompressedLength must be 0, a positive safe integer, or Infinity',
      )
    }
  })

  test('invalid deflate data is properly rejected', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    const cek = crypto.randomBytes(32)
    const iv = crypto.randomBytes(12)
    const protectedHeader = { alg: 'RSA-OAEP-256', enc: 'A256GCM', zip: 'DEF' }
    const protectedB64 = Buffer.from(JSON.stringify(protectedHeader)).toString('base64url')

    const cipher = crypto.createCipheriv('aes-256-gcm', cek, iv, { authTagLength: 16 })
    cipher.setAAD(Buffer.from(protectedB64))
    const ciphertext = Buffer.concat([cipher.update(new Uint8Array([0x00])), cipher.final()])
    const tag = cipher.getAuthTag()
    const encryptedKey = crypto.publicEncrypt({ key: publicKey, oaepHash: 'sha256' }, cek)

    const flattened = {
      protected: protectedB64,
      encrypted_key: Buffer.from(encryptedKey).toString('base64url'),
      iv: Buffer.from(iv).toString('base64url'),
      ciphertext: Buffer.from(ciphertext).toString('base64url'),
      tag: Buffer.from(tag).toString('base64url'),
    }

    await assert.rejects(
      flattenedDecrypt(flattened, privateKey),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'Failed to decompress plaintext',
      }),
    )
  })
}

test('unsupported zip value on encrypt throws JOSENotSupported', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'gzip' })
      .encrypt(context.secret),
    errorLike({
      message: 'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
      code: 'ERR_JOSE_NOT_SUPPORTED',
    }),
  )
})

test('zip must be in a protected header on encrypt', async () => {
  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ zip: 'DEF' })
      .encrypt(context.secret),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )

  await assert.rejects(
    new FlattenedEncrypt(context.plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
      .setUnprotectedHeader({ zip: 'DEF' })
      .encrypt(context.secret),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )
})

test('zip must be in a protected header on encrypt (multi-recipient)', async () => {
  const secret1 = await generateSecret('A128KW')
  const secret2 = await generateSecret('A128KW')

  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ zip: 'DEF' })
      .addRecipient(secret1)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .addRecipient(secret2)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .encrypt(),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )

  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .addRecipient(secret1)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .addRecipient(secret2)
      .setUnprotectedHeader({ alg: 'A128KW', zip: 'DEF' })
      .encrypt(),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )
})

test('zip must be in a protected header on decrypt', async () => {
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)

  // Tamper: put zip in unprotected header
  const tampered = { ...jwe, unprotected: { zip: 'DEF' } }
  await assert.rejects(
    flattenedDecrypt(tampered, context.secret),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )

  // Tamper: put zip in per-recipient header
  const tampered2 = { ...jwe, header: { zip: 'DEF' } }
  await assert.rejects(
    flattenedDecrypt(tampered2, context.secret),
    errorLike({
      message: 'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
      code: 'ERR_JWE_INVALID',
    }),
  )
})

test('unsupported zip value on decrypt throws JOSENotSupported', async () => {
  // Build a JWE without zip, then tamper the protected header to have zip: gzip
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)

  // Replace protected header with one containing zip: gzip
  const tampered = {
    ...jwe,
    protected: btoa(JSON.stringify({ alg: 'dir', enc: 'A128GCM', zip: 'gzip' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''),
  }

  await assert.rejects(
    flattenedDecrypt(tampered, context.secret),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
    }),
  )
})

if (!hasCompressionStreams) {
  test('zip: DEF throws JOSENotSupported when CompressionStream is unavailable', async () => {
    await assert.rejects(
      new FlattenedEncrypt(context.plaintext)
        .setProtectedHeader({ alg: 'dir', enc: 'A128GCM', zip: 'DEF' })
        .encrypt(context.secret),
      errorLike({
        code: 'ERR_JOSE_NOT_SUPPORTED',
      }),
    )
  })
}
