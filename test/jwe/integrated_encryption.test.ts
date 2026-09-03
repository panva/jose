import test from 'ava'
import { AEAD_AES_256_GCM, CipherSuite, KDF_HKDF_SHA256, KEM_DHKEM_P256_HKDF_SHA256 } from 'hpke'

import { createAlgorithmFactory, freezeKey } from '../../src/lib/algorithm_capability.js'
import { integratedEncryption, loadJWEAlgorithms } from '../../src/lib/jwe_algorithm.js'
import {
  createCompactDecryptFunction,
  createCompactEncryptClass,
  createFlattenedDecryptFunction,
  createFlattenedEncryptClass,
  createGeneralDecryptFunction,
  createGeneralEncryptClass,
} from '../../src/lib/jwe_serialization.js'
import { createEncryptJWTClass, createJwtDecryptFunction } from '../../src/lib/jwt_jwe.js'
import { dir } from '../../src/algorithms/jwe.js'
import { A256GCM } from '../../src/algorithms/jwe/enc.js'
import { DEF } from '../../src/algorithms/jwe/zip.js'
import { decode as b64u, encode as encodeB64u } from '../../src/util/base64url.js'
import { JOSENotSupported, JWEDecryptionFailed, JWEInvalid } from '../../src/util/errors.js'
import type * as types from '../../src/types.d.ts'

const alg = 'HPKE-7'
const plaintext = new TextEncoder().encode('Integrated Encryption JWE')
const aad = new TextEncoder().encode('additional authenticated data')
const suite = new CipherSuite(KEM_DHKEM_P256_HKDF_SHA256, KDF_HKDF_SHA256, AEAD_AES_256_GCM)

const key = freezeKey({
  alg,
  kty: ['EC'],
  subtle: { name: 'ECDH', namedCurve: 'P-256' },
  usages: [[], ['deriveBits']],
  ops: [undefined, 'deriveBits'],
} as const)

// These are HPKE algorithm rules, not generic Integrated Encryption invariants from Section 7.
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

const capability = createAlgorithmFactory(
  {
    category: 'jwe-key-management',
    algorithm: alg,
    ...integratedEncryption(
      key,
      async (input, inputPlaintext, additionalData, protectedHeader, joseHeader) => {
        checkHpkeHeaders(protectedHeader, joseHeader)
        if (input instanceof Uint8Array) throw new TypeError()
        const { encapsulatedSecret, ciphertext } = await suite.Seal(input, inputPlaintext, {
          aad: additionalData,
        })
        return [encapsulatedSecret, ciphertext]
      },
      async (input, encryptedKey, ciphertext, additionalData, protectedHeader, joseHeader) => {
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
    ),
  },
  1,
)
const algorithms = loadJWEAlgorithms([capability, DEF] as never)
const CompactEncrypt = createCompactEncryptClass(algorithms)
const compactDecrypt = createCompactDecryptFunction(algorithms)
const FlattenedEncrypt = createFlattenedEncryptClass(algorithms)
const flattenedDecrypt = createFlattenedDecryptFunction(algorithms)
const GeneralEncrypt = createGeneralEncryptClass(algorithms)
const generalDecrypt = createGeneralDecryptFunction(algorithms)
const EncryptJWT = createEncryptJWTClass(algorithms)
const jwtDecrypt = createJwtDecryptFunction(algorithms)

function generateKeyPair() {
  // Extractability lets runtimes without SubtleCrypto#getPublicKey derive the public key during
  // decapsulation using the package's portable export/import fallback.
  return suite.GenerateKeyPair(true)
}

function protectedHeader(jwe: types.FlattenedJWE): types.JWEHeaderParameters {
  return JSON.parse(new TextDecoder().decode(b64u(jwe.protected!)))
}

function replaceProtectedHeader(
  jwe: types.FlattenedJWE,
  header: types.JWEHeaderParameters,
): types.FlattenedJWE {
  return { ...jwe, protected: encodeB64u(JSON.stringify(header)) }
}

function tamper(input: string): string {
  const bytes = b64u(input)
  bytes[0] ^= 1
  return encodeB64u(bytes)
}

test('integrated encryption is a distinct JWE key management mode', (t) => {
  t.is(algorithms.alg[alg].mode, 'integrated-encryption')
  t.is(loadJWEAlgorithms([capability] as never).alg[alg].mode, 'integrated-encryption')
  t.throws(() => loadJWEAlgorithms([capability, dir] as never), {
    instanceOf: TypeError,
    message: 'At least one JWE content encryption algorithm factory must be provided',
  })
})

test('Integrated Encryption leaves algorithm-specific headers to the capability', async (t) => {
  const testAlg = 'test-integrated'
  const testKey = freezeKey({ ...key, alg: testAlg })
  let encryptHeaders: types.JWEHeaderParameters | undefined
  let decryptHeaders: types.JWEHeaderParameters | undefined
  const testCapability = createAlgorithmFactory(
    {
      category: 'jwe-key-management',
      algorithm: testAlg,
      ...integratedEncryption(
        testKey,
        async (_key, input, _aad, _protectedHeader, joseHeader) => {
          encryptHeaders = joseHeader
          return [undefined, input]
        },
        async (_key, encryptedKey, ciphertext, _aad, _protectedHeader, joseHeader) => {
          t.is(encryptedKey, undefined)
          decryptHeaders = joseHeader
          return ciphertext
        },
      ),
    },
    1,
  )
  const selection = loadJWEAlgorithms([testCapability] as never)
  const TestEncrypt = createFlattenedEncryptClass(selection)
  const testDecrypt = createFlattenedDecryptFunction(selection)
  const { publicKey, privateKey } = await generateKeyPair()
  const header = { alg: testAlg, ek: 'algorithm-owned', psk_id: 'algorithm-owned' }

  const jwe = await new TestEncrypt(plaintext).setProtectedHeader(header).encrypt(publicKey)
  t.deepEqual(encryptHeaders, header)
  t.deepEqual((await testDecrypt(jwe, privateKey)).plaintext, plaintext)
  t.deepEqual(decryptHeaders, header)
})

test('integrated and conventional encryption coexist in one selection', async (t) => {
  const mixed = loadJWEAlgorithms([capability, dir, A256GCM] as never)
  const MixedEncrypt = createFlattenedEncryptClass(mixed)
  const mixedDecrypt = createFlattenedDecryptFunction(mixed)
  const { publicKey, privateKey } = await generateKeyPair()

  const integrated = await new MixedEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .encrypt(publicKey)
  t.deepEqual((await mixedDecrypt(integrated, privateKey)).plaintext, plaintext)

  const secret = crypto.getRandomValues(new Uint8Array(32))
  const conventional = await new MixedEncrypt(plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(secret)
  t.deepEqual((await mixedDecrypt(conventional, secret)).plaintext, plaintext)
})

test('HPKE-7 integrated encryption round trips every JWE serialization', async (t) => {
  const { publicKey, privateKey } = await generateKeyPair()
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .setAdditionalAuthenticatedData(aad)
    .encrypt(publicKey)
  t.truthy(flattened.encrypted_key)
  t.false('iv' in flattened)
  t.false('tag' in flattened)
  const flattenedResult = await flattenedDecrypt(flattened, privateKey, {
    keyManagementAlgorithms: [alg],
  })
  t.deepEqual(flattenedResult.plaintext, plaintext)
  t.deepEqual(flattenedResult.additionalAuthenticatedData, aad)

  const compact = await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg } as types.CompactJWEHeaderParameters)
    .encrypt(publicKey)
  const [, encryptedKey, iv, ciphertext, tag] = compact.split('.')
  t.truthy(encryptedKey)
  t.is(iv, '')
  t.truthy(ciphertext)
  t.is(tag, '')
  t.deepEqual((await compactDecrypt(compact, privateKey)).plaintext, plaintext)

  const general = await new GeneralEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .addRecipient(publicKey)
    .encrypt()
  t.false('iv' in general)
  t.false('tag' in general)
  t.deepEqual((await generalDecrypt(general, privateKey)).plaintext, plaintext)
})

test('integrated encryption composes with JWT and compression', async (t) => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg, zip: 'DEF' })
    .encrypt(publicKey)

  t.deepEqual(protectedHeader(jwe), { alg, zip: 'DEF' })
  t.deepEqual((await flattenedDecrypt(jwe, privateKey)).plaintext, plaintext)

  const jwt = await new EncryptJWT({ sub: 'subject' })
    .setProtectedHeader({ alg } as types.CompactJWEHeaderParameters)
    .encrypt(publicKey)
  t.deepEqual((await jwtDecrypt(jwt, privateKey)).payload, { sub: 'subject' })
})

test('integrated encryption enforces generic JWE processing rules', async (t) => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader({ alg }).encrypt(publicKey)

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, enc: 'A256GCM' }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setContentEncryptionKey(new Uint8Array())
      .encrypt(publicKey),
    {
      instanceOf: TypeError,
      message: `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setInitializationVector(new Uint8Array())
      .encrypt(publicKey),
    {
      instanceOf: TypeError,
      message: `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    },
  )

  await t.throwsAsync(flattenedDecrypt({ ...jwe, iv: 'AA' }, privateKey), {
    code: 'ERR_JWE_INVALID',
    message: 'JWE Initialization Vector must be empty for integrated encryption',
  })
  await t.throwsAsync(flattenedDecrypt({ ...jwe, tag: 'AA' }, privateKey), {
    code: 'ERR_JWE_INVALID',
    message: 'JWE Authentication Tag must be empty for integrated encryption',
  })
  t.deepEqual(
    (await flattenedDecrypt(jwe, privateKey, { contentEncryptionAlgorithms: [] })).plaintext,
    plaintext,
  )
  await t.throwsAsync(
    flattenedDecrypt(replaceProtectedHeader(jwe, { alg, enc: 'A256GCM' }), privateKey, {
      contentEncryptionAlgorithms: [],
    }),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setUnprotectedHeader({ alg }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, ek: 'AA' }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    },
  )
  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, psk_id: 'cHNr' }).encrypt(publicKey),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    },
  )
  await t.throwsAsync(
    flattenedDecrypt({ ...replaceProtectedHeader(jwe, {}), header: { alg } }, privateKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    },
  )
  await t.throwsAsync(
    flattenedDecrypt(replaceProtectedHeader(jwe, { alg, ek: 'AA' }), privateKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    },
  )
  await t.throwsAsync(
    flattenedDecrypt(replaceProtectedHeader(jwe, { alg, psk_id: 'cHNr' }), privateKey),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    },
  )
})

test('integrated algorithms own their encrypted key and ciphertext failures', async (t) => {
  const { publicKey, privateKey } = await generateKeyPair()
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader({ alg }).encrypt(publicKey)

  const authenticated = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg, kid: 'recipient' })
    .setAdditionalAuthenticatedData(aad)
    .encrypt(publicKey)

  for (const input of [
    { ...jwe, ciphertext: tamper(jwe.ciphertext) },
    { ...jwe, encrypted_key: tamper(jwe.encrypted_key!) },
    { ...jwe, encrypted_key: undefined },
    { ...authenticated, aad: tamper(authenticated.aad!) },
    replaceProtectedHeader(authenticated, { alg, kid: 'other' }),
  ]) {
    await t.throwsAsync(flattenedDecrypt(input, privateKey), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
  }

  await t.throwsAsync(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    {
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    },
  )
  await t.throwsAsync(
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
    {
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    },
  )
})
