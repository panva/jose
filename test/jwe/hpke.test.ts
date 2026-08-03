import assert from 'node:assert/strict'
import test from 'node:test'
import { errorLike } from '../_errors.js'

import {
  CompactEncrypt,
  FlattenedEncrypt,
  GeneralEncrypt,
  base64url,
  compactDecrypt,
  flattenedDecrypt,
  generalDecrypt,
  EncryptJWT,
  jwtDecrypt,
  generateKeyPair,
  exportJWK,
  importJWK,
} from '../../src/index.js'

import type { FlattenedJWE, JWEHeaderParameters } from '../../src/index.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const plaintext = encoder.encode('Integrated HPKE JWE')
const aad = encoder.encode('additional authenticated data')

const algorithms = ['HPKE-9', 'HPKE-12', 'HPKE-13'] as const

const supported = new Map<string, boolean>()
const jwkSupported = new Map<string, boolean>()

async function isSupported(alg: string) {
  if (supported.has(alg)) {
    return supported.get(alg)!
  }

  try {
    await generateKeyPair(alg)
    await crypto.subtle.digest(
      { name: 'cSHAKE256', outputLength: 256 } as AlgorithmIdentifier,
      new Uint8Array(),
    )
    supported.set(alg, true)
  } catch {
    supported.set(alg, false)
  }

  return supported.get(alg)!
}

async function isJWKSupported(alg: string) {
  if (jwkSupported.has(alg)) {
    return jwkSupported.get(alg)!
  }

  try {
    const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true })
    await importJWK(await exportJWK(publicKey))
    await importJWK(await exportJWK(privateKey))
    jwkSupported.set(alg, true)
  } catch {
    jwkSupported.set(alg, false)
  }

  return jwkSupported.get(alg)!
}

async function firstSupported(...algs: string[]) {
  for (const alg of algs) {
    if (await isSupported(alg)) {
      return alg
    }
  }
  return undefined
}

function protectedHeader(jwe: FlattenedJWE): JWEHeaderParameters {
  return JSON.parse(decoder.decode(base64url.decode(jwe.protected!)))
}

function setProtectedHeader(jwe: FlattenedJWE, header: JWEHeaderParameters): FlattenedJWE {
  return { ...jwe, protected: base64url.encode(JSON.stringify(header)) }
}

function tamper(input: string): string {
  const bytes = base64url.decode(input)
  bytes[0]! ^= 0x01
  return base64url.encode(bytes)
}

test('Integrated HPKE flattened and compact roundtrip', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg))) {
      t.diagnostic(`${alg} unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg)

    const flattened = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setAdditionalAuthenticatedData(aad)
      .encrypt(publicKey)

    assert.deepStrictEqual(protectedHeader(flattened), { alg })
    assert.ok(flattened.encrypted_key)
    assert.strictEqual('iv' in flattened, false)
    assert.strictEqual('tag' in flattened, false)

    const flattenedResult = await flattenedDecrypt(flattened, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    assert.deepStrictEqual(flattenedResult.plaintext, plaintext)
    assert.deepStrictEqual(flattenedResult.additionalAuthenticatedData, aad)

    const compact = await new CompactEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .encrypt(publicKey)
    const [encodedHeader, encryptedKey, iv, ciphertext, tag] = compact.split('.')
    assert.ok(encodedHeader)
    assert.ok(encryptedKey)
    assert.strictEqual(iv, '')
    assert.ok(ciphertext)
    assert.strictEqual(tag, '')

    const compactResult = await compactDecrypt(compact, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    assert.deepStrictEqual(compactResult.plaintext, plaintext)
    assert.deepStrictEqual(compactResult.protectedHeader, { alg })

    const jwt = await new EncryptJWT({ sub: alg }).setProtectedHeader({ alg }).encrypt(publicKey)
    assert.deepStrictEqual((await jwtDecrypt(jwt, privateKey)).payload, { sub: alg })
  }
})

test('Integrated HPKE general JWE single recipient', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg))) {
      t.diagnostic(`${alg} unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg)
    const jwe = await new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .addRecipient(publicKey)
      .encrypt()

    assert.strictEqual('iv' in jwe, false)
    assert.strictEqual('tag' in jwe, false)
    assert.ok(jwe.recipients[0].encrypted_key)

    const { plaintext: decrypted } = await generalDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    assert.deepStrictEqual(decrypted, plaintext)
  }
})

test('Integrated HPKE general JWE multi-recipient encryption rejection', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.diagnostic('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey } = await generateKeyPair(alg)

  await assert.rejects(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    }),
  )
})

test('Integrated HPKE general JWE multi-recipient decryption rejection', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.diagnostic('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg)
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .encrypt(publicKey)

  await assert.rejects(
    generalDecrypt(
      {
        ciphertext: flattened.ciphertext,
        protected: flattened.protected,
        recipients: [
          { encrypted_key: flattened.encrypted_key },
          { encrypted_key: tamper(flattened.encrypted_key!) },
        ],
      },
      privateKey,
      { keyManagementAlgorithms: [alg] },
    ),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    }),
  )
})

test('Integrated HPKE validation', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.diagnostic('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg)
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader({ alg }).encrypt(publicKey)

  await assert.rejects(
    new FlattenedEncrypt(plaintext).setUnprotectedHeader({ alg }).encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    }),
  )

  await assert.rejects(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, enc: 'A128GCM' }).encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    }),
  )

  await assert.rejects(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, ek: '' }).encrypt(publicKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    }),
  )

  await assert.rejects(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, psk_id: '' }).encrypt(publicKey),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    }),
  )

  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setContentEncryptionKey(new Uint8Array(16))
      .encrypt(publicKey),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(
        error.message,
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
      return true
    },
  )

  await assert.rejects(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setInitializationVector(new Uint8Array(12))
      .encrypt(publicKey),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(
        error.message,
        `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
      return true
    },
  )

  await assert.rejects(
    flattenedDecrypt(setProtectedHeader(jwe, { alg, enc: 'A128GCM' }), privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    }),
  )

  await assert.rejects(
    flattenedDecrypt(setProtectedHeader(jwe, { alg, ek: '' }), privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    }),
  )

  await assert.rejects(
    flattenedDecrypt(setProtectedHeader(jwe, { alg, psk_id: '' }), privateKey),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    }),
  )

  await assert.rejects(
    flattenedDecrypt({ ...jwe, encrypted_key: undefined }, privateKey),
    errorLike({
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    }),
  )

  await assert.rejects(
    flattenedDecrypt({ ...jwe, ciphertext: tamper(jwe.ciphertext) }, privateKey),
    errorLike({
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    }),
  )

  await assert.rejects(
    flattenedDecrypt({ ...jwe, encrypted_key: tamper(jwe.encrypted_key!) }, privateKey),
    errorLike({
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    }),
  )

  await assert.rejects(
    flattenedDecrypt(jwe, privateKey, { keyManagementAlgorithms: ['RSA-OAEP'] }),
    errorLike({
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    }),
  )

  await assert.doesNotReject(flattenedDecrypt(jwe, privateKey, { contentEncryptionAlgorithms: [] }))
})

test('Integrated HPKE AKP JWK import and export', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg)) || !(await isJWKSupported(alg))) {
      t.diagnostic(`${alg} JWK import/export unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true })
    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)

    assert.strictEqual(publicJwk.kty, 'AKP')
    assert.strictEqual(publicJwk.alg, alg)
    assert.ok(publicJwk.pub)
    assert.strictEqual('priv' in publicJwk, false)

    assert.strictEqual(privateJwk.kty, 'AKP')
    assert.strictEqual(privateJwk.alg, alg)
    assert.strictEqual(privateJwk.pub, publicJwk.pub)
    assert.ok(privateJwk.priv)

    const importedPublicKey = await importJWK(publicJwk)
    const importedPrivateKey = await importJWK(privateJwk)
    const jwe = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .encrypt(importedPublicKey)

    const { plaintext: decrypted } = await flattenedDecrypt(jwe, importedPrivateKey, {
      keyManagementAlgorithms: [alg],
    })
    assert.deepStrictEqual(decrypted, plaintext)
  }
})
