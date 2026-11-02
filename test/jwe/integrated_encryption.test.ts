import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { AEAD_AES_256_GCM, CipherSuite, KDF_HKDF_SHA256, KEM_DHKEM_P256_HKDF_SHA256 } from 'hpke'

import { CompactEncrypt } from '../../src/jwe/compact/encrypt.js'
import { compactDecrypt } from '../../src/jwe/compact/decrypt.js'
import { FlattenedEncrypt } from '../../src/jwe/flattened/encrypt.js'
import { flattenedDecrypt } from '../../src/jwe/flattened/decrypt.js'
import { GeneralEncrypt } from '../../src/jwe/general/encrypt.js'
import { generalDecrypt } from '../../src/jwe/general/decrypt.js'
import { EncryptJWT } from '../../src/jwt/encrypt.js'
import { jwtDecrypt } from '../../src/jwt/decrypt.js'
import { JWE, type JWEIntegratedEncryptionAlgorithm } from '../../src/lib/jwe_algorithms.js'
import { JOSENotSupported, JWEDecryptionFailed, JWEInvalid } from '../../src/util/errors.js'
import { decode as b64u, encode as encodeB64u } from '../../src/util/base64url.js'
import { decompress } from '../../src/lib/deflate.js'
import type * as types from '../../src/types.d.ts'
import { errorLike } from '../_errors.js'

const alg = 'HPKE-7'
const encoder = new TextEncoder()
const plaintext = encoder.encode('Integrated Encryption JWE')
const aad = encoder.encode('additional authenticated data')
const suite = new CipherSuite(KEM_DHKEM_P256_HKDF_SHA256, KDF_HKDF_SHA256, AEAD_AES_256_GCM)

// These are HPKE-specific rules rather than generic Integrated Encryption invariants.
function checkHpkeHeaders(
  protectedHeader: types.JWEHeaderParameters | undefined,
  joseHeader: types.JWEHeaderParameters,
): void {
  if (protectedHeader?.alg !== alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.')
  }
  if (joseHeader.ek !== undefined) {
    throw new JWEInvalid('JWE "ek" Header Parameter must not be present')
  }
  if (joseHeader.psk_id !== undefined) {
    throw new JOSENotSupported('JWE HPKE PSK mode is not supported')
  }
}

const integrated: JWEIntegratedEncryptionAlgorithm = {
  alg,
  kty: ['EC'],
  mode: 'integrated-encryption',
  ops: [undefined, 'deriveBits'],
  subtle: { name: 'ECDH', namedCurve: 'P-256' },
  usages: [[], ['deriveBits']],
  async encrypt(input, inputPlaintext, additionalData, protectedHeader, joseHeader) {
    checkHpkeHeaders(protectedHeader, joseHeader)
    if (input instanceof Uint8Array) throw new TypeError()
    const { encapsulatedSecret, ciphertext } = await suite.Seal(input, inputPlaintext, {
      aad: additionalData,
    })
    return [encapsulatedSecret, ciphertext]
  },
  async decrypt(input, encryptedKey, ciphertext, additionalData, protectedHeader, joseHeader) {
    checkHpkeHeaders(protectedHeader, joseHeader)
    if (input instanceof Uint8Array || encryptedKey === undefined) {
      throw new JWEDecryptionFailed()
    }
    try {
      return await suite.Open(input, encryptedKey, ciphertext, { aad: additionalData })
    } catch (cause) {
      throw new JWEDecryptionFailed(undefined, { cause })
    }
  },
}

before(() => {
  JWE[alg] = integrated
})

after(() => {
  delete JWE[alg]
})

const header = () => ({ alg }) as unknown as types.JWEHeaderParameters
const compactHeader = () => ({ alg }) as unknown as types.CompactJWEHeaderParameters

function generateKeyPair() {
  // Extractability lets runtimes without SubtleCrypto#getPublicKey derive the public key while
  // decapsulating through the HPKE package's portable export/import fallback.
  return suite.GenerateKeyPair(true)
}

function replaceProtectedHeader(
  jwe: types.FlattenedJWE,
  protectedHeader: types.JWEHeaderParameters,
): types.FlattenedJWE {
  return { ...jwe, protected: encodeB64u(JSON.stringify(protectedHeader)) }
}

function tamper(input: string): string {
  const bytes = b64u(input)
  bytes[0] ^= 1
  return encodeB64u(bytes)
}

test('integrated encryption round trips every JWE serialization', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader(header())
    .setAdditionalAuthenticatedData(aad)
    .encrypt(publicKey)
  assert.ok(flattened.encrypted_key)
  assert.strictEqual('iv' in flattened, false)
  assert.strictEqual('tag' in flattened, false)
  const flattenedResult = await flattenedDecrypt(flattened, privateKey, {
    contentEncryptionAlgorithms: [],
  })
  assert.deepStrictEqual(flattenedResult.plaintext, plaintext)
  assert.deepStrictEqual(flattenedResult.additionalAuthenticatedData, aad)

  const compact = await new CompactEncrypt(plaintext)
    .setProtectedHeader(compactHeader())
    .encrypt(publicKey)
  const [, encryptedKey, iv, ciphertext, tag] = compact.split('.')
  assert.ok(encryptedKey)
  assert.strictEqual(iv, '')
  assert.ok(ciphertext)
  assert.strictEqual(tag, '')
  assert.deepStrictEqual((await compactDecrypt(compact, privateKey)).plaintext, plaintext)

  const general = await new GeneralEncrypt(plaintext)
    .setProtectedHeader(header())
    .addRecipient(publicKey)
    .encrypt()
  assert.strictEqual('iv' in general, false)
  assert.strictEqual('tag' in general, false)
  assert.deepStrictEqual((await generalDecrypt(general, privateKey)).plaintext, plaintext)

  const conventionalKey = crypto.getRandomValues(new Uint8Array(32))
  const conventional = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(conventionalKey)
  assert.deepStrictEqual(
    (await flattenedDecrypt(conventional, conventionalKey)).plaintext,
    plaintext,
  )
})

test('HPKE-7 interoperates with the HPKE single-shot API', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const encodedProtected = encodeB64u(JSON.stringify({ alg }))
  const encodedAad = encodeB64u(aad)
  const additionalData = encoder.encode(`${encodedProtected}.${encodedAad}`)
  const { encapsulatedSecret, ciphertext } = await suite.Seal(publicKey, plaintext, {
    aad: additionalData,
  })

  assert.deepStrictEqual(
    (
      await flattenedDecrypt(
        {
          aad: encodedAad,
          ciphertext: encodeB64u(ciphertext),
          encrypted_key: encodeB64u(encapsulatedSecret),
          protected: encodedProtected,
        },
        privateKey,
      )
    ).plaintext,
    plaintext,
  )

  const jwe = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader(header())
    .setAdditionalAuthenticatedData(aad)
    .encrypt(publicKey)
  assert.deepStrictEqual(
    await suite.Open(privateKey, b64u(jwe.encrypted_key!), b64u(jwe.ciphertext), {
      aad: encoder.encode(`${jwe.protected}.${jwe.aad}`),
    }),
    plaintext,
  )
})

test('integrated encryption works with JWT and compression', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg, zip: 'DEF' } as unknown as types.JWEHeaderParameters)
    .encrypt(publicKey)
  assert.deepStrictEqual((await flattenedDecrypt(flattened, privateKey)).plaintext, plaintext)

  const jwt = await new EncryptJWT({ sub: 'subject' })
    .setProtectedHeader(compactHeader())
    .encrypt(publicKey)
  assert.deepStrictEqual((await jwtDecrypt(jwt, privateKey)).payload, { sub: 'subject' })
})

test('integrated encryption passes algorithm-owned inputs through unchanged', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const passthroughAlg = 'test-integrated-passthrough'
  let encryptInput:
    | [Uint8Array, Uint8Array, types.JWEHeaderParameters | undefined, types.JWEHeaderParameters]
    | undefined
  let decryptInput:
    | [Uint8Array, Uint8Array, types.JWEHeaderParameters | undefined, types.JWEHeaderParameters]
    | undefined
  const passthrough: JWEIntegratedEncryptionAlgorithm = {
    ...integrated,
    alg: passthroughAlg,
    async encrypt(_key, inputPlaintext, additionalData, protectedHeader, joseHeader) {
      encryptInput = [inputPlaintext, additionalData, protectedHeader, joseHeader]
      return [undefined, inputPlaintext]
    },
    async decrypt(_key, encryptedKey, ciphertext, additionalData, protectedHeader, joseHeader) {
      assert.strictEqual(encryptedKey, undefined)
      decryptInput = [ciphertext, additionalData, protectedHeader, joseHeader]
      return ciphertext
    },
  }
  JWE[passthroughAlg] = passthrough

  try {
    const protectedHeader = {
      alg: passthroughAlg,
      ek: 'algorithm-owned',
      psk_id: 'algorithm-owned',
      test_parameter: true,
      zip: 'DEF',
    } as unknown as types.JWEHeaderParameters
    const jwe = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader(protectedHeader)
      .setAdditionalAuthenticatedData(aad)
      .encrypt(publicKey)

    assert.strictEqual('encrypted_key' in jwe, false)
    assert.strictEqual('iv' in jwe, false)
    assert.strictEqual('tag' in jwe, false)
    assert.deepStrictEqual(encryptInput?.[2], protectedHeader)
    assert.deepStrictEqual(encryptInput?.[3], protectedHeader)
    assert.deepStrictEqual(encryptInput?.[1], encoder.encode(`${jwe.protected}.${jwe.aad}`))
    assert.deepStrictEqual(await decompress(encryptInput![0], Infinity), plaintext)

    const result = await flattenedDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: [passthroughAlg],
    })
    assert.deepStrictEqual(result.plaintext, plaintext)
    assert.deepStrictEqual(decryptInput?.[2], protectedHeader)
    assert.deepStrictEqual(decryptInput?.[3], protectedHeader)
    assert.deepStrictEqual(decryptInput?.[1], encryptInput?.[1])
    assert.deepStrictEqual(decryptInput?.[0], encryptInput?.[0])

    await assert.rejects(
      flattenedDecrypt(jwe, privateKey, {
        keyManagementAlgorithms: [passthroughAlg],
        maxDecompressedLength: plaintext.byteLength - 1,
      }),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'Decompressed plaintext exceeded the configured limit',
      }),
    )

    const compact = await new CompactEncrypt(plaintext)
      .setProtectedHeader({ alg: passthroughAlg } as unknown as types.CompactJWEHeaderParameters)
      .encrypt(publicKey)
    assert.strictEqual(compact.split('.')[1], '')
    assert.deepStrictEqual((await compactDecrypt(compact, privateKey)).plaintext, plaintext)
  } finally {
    delete JWE[passthroughAlg]
  }
})

test('HPKE-7 applies its algorithm-specific header rules', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader(header()).encrypt(publicKey)

  await assert.rejects(
    new FlattenedEncrypt(plaintext).setUnprotectedHeader(header()).encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    }),
  )
  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg, ek: 'AA' } as unknown as types.JWEHeaderParameters)
      .encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    }),
  )
  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg, psk_id: 'cHNr' } as unknown as types.JWEHeaderParameters)
      .encrypt(publicKey),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    }),
  )
  await assert.rejects(
    flattenedDecrypt({ ...replaceProtectedHeader(jwe, {}), header: header() }, privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    }),
  )
  await assert.rejects(
    flattenedDecrypt(
      replaceProtectedHeader(jwe, {
        alg,
        ek: 'AA',
      } as unknown as types.JWEHeaderParameters),
      privateKey,
    ),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    }),
  )
  await assert.rejects(
    flattenedDecrypt(
      replaceProtectedHeader(jwe, {
        alg,
        psk_id: 'cHNr',
      } as unknown as types.JWEHeaderParameters),
      privateKey,
    ),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    }),
  )
})

test('integrated encryption enforces generic processing rules', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader(header()).encrypt(publicKey)

  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg, enc: 'A256GCM' } as unknown as types.JWEHeaderParameters)
      .encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    }),
  )
  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader(header())
      .setContentEncryptionKey(new Uint8Array())
      .encrypt(publicKey),
    (error) =>
      error instanceof TypeError &&
      error.message ===
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
  )
  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader(header())
      .setInitializationVector(new Uint8Array())
      .encrypt(publicKey),
    (error) =>
      error instanceof TypeError &&
      error.message ===
        `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
  )
  await assert.rejects(
    flattenedDecrypt({ ...jwe, iv: 'AA' }, privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE Initialization Vector must be empty for integrated encryption',
    }),
  )
  await assert.rejects(
    flattenedDecrypt({ ...jwe, tag: 'AA' }, privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE Authentication Tag must be empty for integrated encryption',
    }),
  )
  await assert.rejects(
    flattenedDecrypt({ ...jwe, encrypted_key: '' }, privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE Encrypted Key incorrect type',
    }),
  )
  await assert.rejects(
    flattenedDecrypt(replaceProtectedHeader(jwe, { alg, enc: 'A256GCM' }), privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    }),
  )
  await assert.doesNotReject(
    flattenedDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [],
    }),
  )
  await assert.rejects(
    flattenedDecrypt(jwe, privateKey, { keyManagementAlgorithms: [] }),
    errorLike({
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    }),
  )

  const compact = await new CompactEncrypt(plaintext)
    .setProtectedHeader(compactHeader())
    .encrypt(publicKey)
  for (const index of [2, 4]) {
    const segments = compact.split('.')
    segments[index] = 'AA'
    await assert.rejects(
      compactDecrypt(segments.join('.'), privateKey),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message:
          index === 2
            ? 'JWE Initialization Vector must be empty for integrated encryption'
            : 'JWE Authentication Tag must be empty for integrated encryption',
      }),
    )
  }
})

test('integrated algorithms own their encrypted key and ciphertext failures', async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader(header()).encrypt(publicKey)
  const authenticated = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg, kid: 'recipient' } as unknown as types.JWEHeaderParameters)
    .setAdditionalAuthenticatedData(aad)
    .encrypt(publicKey)

  for (const input of [
    { ...jwe, ciphertext: tamper(jwe.ciphertext) },
    { ...jwe, encrypted_key: tamper(jwe.encrypted_key!) },
    { ...jwe, encrypted_key: undefined },
    { ...authenticated, aad: tamper(authenticated.aad!) },
    replaceProtectedHeader(authenticated, {
      alg,
      kid: 'other',
    } as unknown as types.JWEHeaderParameters),
  ]) {
    await assert.rejects(
      flattenedDecrypt(input, privateKey),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }

  await assert.rejects(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader(header())
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    }),
  )
  await assert.rejects(
    generalDecrypt(
      {
        ciphertext: jwe.ciphertext,
        protected: jwe.protected,
        recipients: [
          { encrypted_key: jwe.encrypted_key },
          { encrypted_key: tamper(jwe.encrypted_key!) },
        ],
      },
      privateKey,
    ),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    }),
  )
})
